'use server'
import { getUser } from './serverUserUtil';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseVariables() {
    const url: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon_key: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (url == undefined || anon_key == undefined) {
        throw new Error("no environmental variable NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");
    } else {
        return ({ url: url, anon_key: anon_key });
    }
}

async function makeServerClient() {
    const { url, anon_key } = getSupabaseVariables();
    const cookieStore = await cookies();
    return (createServerClient(
        url,
        anon_key,
        {
            cookies: {
                setAll(cookies) {
                    cookies.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
                getAll() {
                    return cookieStore.getAll();
                }
            }
        }
    ))
}

async function verify() {
    const { data: { user }, error: authError } = await getUser();
    return { user, authError };
}

export async function postAvailability(event_id: string, guest_name: string, availability: Object) {
    // console.log('hello there')
    try {
        const { user, authError } = await verify();
        const user_id = user ? user.id : null;
        // console.log(Object.entries(availability));
        const formattedTimeslots = Object.entries(availability).flatMap(([day, timeslots]) => {
            return timeslots.blocks.map((block: { start: string, end: string }) => {
                return (`${day};${block.start};${block.end}`);
            });
        });
        // console.log("here are the timeslots given by " + guest_name);
        // console.log(formattedTimeslots);
        // const formattedTimeslots = Object.keys(availability).flatMap((day) => {
        //     const timeslots = availability[day].blocks;
        //     return timeslots.map((block : {start : string, end : string}) => (`${day};${block.start};${block.end}`))
        // });
        const serverClient = await makeServerClient();

        const existingAvailRes = user_id ? (
            await serverClient
                .from('availabilities')
                .select()
                .eq('user_id', user_id)
                .maybeSingle()
        ) : (
            await serverClient
                .from('availabilities')
                .select()
                .eq('name', guest_name)
                .maybeSingle()
        )
        if (existingAvailRes.data) { //existing availability for this user/username already exists
            if (user_id) {
                const { data, error } = await serverClient
                    .from('availabilities')
                    .update({ 
                        name: guest_name,
                        timeslots: formattedTimeslots,
                    })
                    .eq('user_id', user_id);
            }
            else {
                const { data, error } = await serverClient
                    .from('availabilities')
                    .update({ 
                        timeslots: formattedTimeslots,
                    })
                    .eq('name', guest_name);
            }
        }
        else {
            const { data, error } = await serverClient
                .from('availabilities')
                .insert({
                    event_id: event_id,
                    user_id: user_id,
                    name: guest_name,
                    timeslots: formattedTimeslots,
                })
                .select();
        }

    }
    catch (err) {
        console.log(`error: ${err}`);
        return { success: false, error: String(err) };
    }


}
// day availability: { "YYYY-MM-DD" : [{start, end}, {start, end}]} 
// async function modifyAvailabilityWithUser(event_id : string, user_id : string, guest_name : string, timeslots : string)
// async function deleteAvailabilityByUserId(event_id : string, user_id : string)
// async function deleteAvailabilityByGuestName(event_id : string, guest_name : string)
export async function getAllAvailabilitiesByEventId(event_id: string) {
    try {
        // get supabase client
        const serverClient = await makeServerClient();

        const response = await serverClient
            .from('availabilities')
            .select()
            .eq('event_id', event_id)

        if (response.error) {
            return { success: false, error: response.error.message }
        }
        let formattedAvails = response.data.map((avail) => {
            let timeblocks: Record<string, { available: boolean, blocks: { start: string, end: string }[] }> = {};
            avail.timeslots.forEach((timeslot: string) => {
                const info = timeslot.split(";");
                const dayStr = info[0];
                const startTimeStr = info[1];
                const endTimeStr = info[2];
                if (!timeblocks[dayStr]) {
                    timeblocks[dayStr] = {
                        available: true,
                        blocks: []
                    }
                }
                timeblocks[dayStr].blocks.push({
                    start: startTimeStr,
                    end: endTimeStr,
                })
            })
            return ({
                user_id: avail.user_id,
                userId: avail.name,
                availability: timeblocks,
                // availability: avail.timeslots.reduce((acc : Record<string, Object>, curr : string) => {
                //     const info = curr.split(";");
                //     const dayStr = info[0];
                //     const startTimeStr = info[1];
                //     const endTimeStr = info[2];
                //     acc[dayStr] = {
                //         start: startTimeStr,
                //         end: endTimeStr,
                //     }
                // }, {})
            })
        })
        // console.log('here are the properly formatted availabilities:');
        // console.log(formattedAvails);
        return { success: true, availabilities: formattedAvails };
    }
    catch (err) {
        return { success: false, error: String(err) };
    }
}
export async function getAvailabilitiesByUserId(event_id: string, user_id: string) {
    const response = await getAllAvailabilitiesByEventId(event_id);
    if (response.success) {
        let availabilities = response.availabilities ?? [];
        availabilities = availabilities.filter((avail) => avail.user_id == user_id)
        const availability = availabilities[0] ? availabilities[0].availability : null;
        return {
            success: true,
            availability,
        }
    }
    else {
        return response;
    }
}
export async function getAvailabilitiesByGuestName(event_id: string, guest_name: string) {
    const { user } = await verify();
    if (user) { // if logged in, use user_id to search instead
        const response = await getAvailabilitiesByUserId(event_id, user.id);
        return response;
    }
    const response = await getAllAvailabilitiesByEventId(event_id);
    if (response.success) {
        let availabilities = response.availabilities ?? [];
        availabilities = availabilities.filter((avail) => avail.userId == guest_name)
        const availability = availabilities[0] ? availabilities[0].availability : null;
        // console.log('here are the availabilities for ' + guest_name + ':');
        // console.log(availabilities);
        return {
            success: true,
            availability,
        }
    }
    else {
        return response;
    }
}