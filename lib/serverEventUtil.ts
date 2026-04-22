'use server'
import { getUser } from './serverUserUtil';
import {createServerClient} from "@supabase/ssr";
import { cookies} from "next/headers";

export type Event = {
    id: string;
    title: string;
    description: string;
    location: string;
    dates: string[];
    timeslots: string[];
    link: string;
}

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

async function verify() {
    const { data: { user }, error: authError } = await getUser();
    return { user, authError };
}

export async function createEvent(title : string, description : string, location : string, dates: string[], timeslots: string[]) {
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
        const serverClient = await makeServerClient();

        // create event in supabase
        // console.log('creating!')
        const { data, error } = await serverClient
            .from('events')
            .insert({
                event_creator: user.id,
                title: title,
                description: description,
                location: location,
                dates: dates,
                timeslots: timeslots,
            })
            .select();
        // console.log('finished!')
        if (error) {
            // console.log('failed!')
            return { success: false, error: error.message };
        }


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
        const serverClient = await makeServerClient();

        const deleteEventResponse = await serverClient
            .from('events')
            .delete()
            .eq('id', event_id)
            .eq('event_creator', user.id);
        
        if (deleteEventResponse.error) {
            return { success: false, error: deleteEventResponse.error.message }
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
        const serverClient = await makeServerClient();
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

export async function getEvents(title : string, description : string, location : string, dates: string[]) {
    try {
        // get supabase client
        const serverClient = await makeServerClient();

        const response = await serverClient
            .from('events')
            .select()
            .ilike('title', '%' + title + '%')
            .ilike('description', '%' + description + '%')
            .ilike('location', '%' + location + '%')
            .overlaps('dates', dates);
        
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