'use server'
import { getUser } from './serverUserUtil';
import {createServerClient} from "@supabase/ssr";
import { cookies} from "next/headers";

let serverClient: any = null;

function getSupabaseVariables(){
    const url:string|undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon_key:string|undefined = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if(url == undefined || anon_key == undefined){
        throw new Error("no environmental variable NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");
    }else{
        return({url:url, anon_key:anon_key});
    }
}

async function makeServerClient(){
    const {url, anon_key} = getSupabaseVariables();
    const cookieStore = await cookies();
    return(createServerClient(
        url,
        anon_key,
        {
            cookies:{
                setAll(cookies){
                    cookies.forEach(({name,value, options})=>{
                        cookieStore.set(name, value, options);
                    });
                },
                getAll(){
                    return cookieStore.getAll();
                }
            }
        }
    ))
}

async function getServerClient() {
    if (!serverClient) {
        serverClient = await makeServerClient();
    }
    return serverClient;
}

async function verify() {
    const { data: { user }, error: authError } = await getUser();
    return { user, authError };
}

export async function createEvent(title : string, description : string, location : string, timeslots: string[]) {
    try {
        // auth user
        // console.log('verifying!');
        const { user, authError } = await verify();
        // console.log('have user!');
        // console.log(user)
        // console.log(authError)
        if (authError) {
            return { success: false, error: String(authError)}
        }
        if (!user) {
            return { success: false, error: "Could not authenticate user." };
        }
        // get supabase client
        const serverClient = await getServerClient();

        // create event in supabase
        // console.log('creating!')
        const { data, error } = await serverClient
            .from('events')
            .insert({
                event_creator: user.id,
                title: title,
                description: description,
                location: location,
                timeslots: timeslots,
            })
            .select();
        // console.log('finished!')
        if (error) {
            // console.log('failed!')
            return { success: false, error: error.message };
        }

        // //debug
        // await test();

        return { success: true, data };
    }
    catch (err) {
        // console.log('got cooked!')
        return { success: false, error: String(err) };
    }
}

export async function deleteEvent(event_id : string) {
    try {
        // auth user
        const { user, authError } = await verify();
        if (authError) {
            return { success: false, error: String(authError)}
        }
        if (!user) {
            return { success: false, error: "Could not authenticate user." };
        }
        // get supabase client
        const serverClient = await getServerClient();

        // verify if event created by owner
        const { event } = await getEventById(event_id);
        if (!event) {
            return { success: false, error: "Event does not exist." };
        }
        // console.log('user id ' + user.id + ' vs event_creator id ' + event.event_creator);
        if (event.event_creator != user.id) {
            return { success: false, error: "User did not create this event." };
        }

        // delete event
        const deleteEventResponse = await serverClient
            .from('events')
            .delete()
            .eq('id', event_id);
        
        if (deleteEventResponse.error) {
            return { success: false, error: deleteEventResponse.error.message }
        }
        // delete availabilities associated with event
        const deleteAvasResponse = await serverClient
            .from('availabilities')
            .delete()
            .eq('event_id', event_id);
        
        if (deleteAvasResponse.error) {
            return { success: false, error: deleteAvasResponse.error.message }
        }

        return { success: true };
    }
    catch (err) {
        // console.log('got cooked!')
        return { success: false, error: String(err) };
    }
}

// do not need to be logged in to get event information
export async function getEventById(event_id : string) {
    try {
        // get supabase client
        const serverClient = await getServerClient();
        const response = await serverClient
            .from('events')
            .select()
            .eq('id', event_id)
            .maybeSingle();
        
        if (response.error) {
            return { success: false, error: response.error.message }
        }
        // console.log(response);
        return { success: true, event: response.data };
    }
    catch (err) {
        // console.log('got cooked!')
        return { success: false, error: String(err) };
    }
}

//debug
async function test() {
    // const response = await getEvents("a", 'a', 'behind you');
    const response = await deleteEvent('2611d8f9-0d81-45c5-9b6b-0ff7e50081e8');
    // const response = await getEventById('110db500-044b-4676-8e78-39db3309e243');
    console.log(response);
}

export async function getEvents(title : string, description : string, location : string) {
    try {
        // get supabase client
        const serverClient = await getServerClient();
        const response = await serverClient
            .from('events')
            .select()
            .ilike('title', '%' + title + '%')
            .ilike('description', '%' + description + '%')
            .ilike('location', '%' + location + '%');
        
        if (response.error) {
            return { success: false, error: response.error.message }
        }
        return { success: true, events: response.data };

    }
    catch (err) {
        // console.log('got cooked!')
        return { success: false, error: String(err) };
    }
}