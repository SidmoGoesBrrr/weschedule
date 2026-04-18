'use server'
import { getUser } from './serverUserUtil';
import {createServerClient} from "@supabase/ssr";
import { cookies} from "next/headers";
import { CookieMethodsServer } from "@supabase/ssr";
import { GetAllCookies } from "@supabase/ssr";
import { create } from "domain";

let serverClient;

function getSupabaseVariables(){
    // const url:string|undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // const anon_key:string|undefined = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    const url = "https://yxgxbbigeiotgmfztxnx.supabase.co"; //temp
    const anon_key = "sb_publishable_alCneJXAQDOSTmWQQlztow_aT4rgBae"; //temp

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

export async function createEvent(title : string, description : string, location : string, timeslots: [string]) {
    try {
        // auth user
        console.log('verifying!');
        const { user, authError } = await verify();
        console.log('have user!');
        console.log(user)
        console.log(authError)
        if (authError) {
            // return { success: false, error: String(authError)}
            console.log("auth error: " + String(authError)); //temp
            user.id = "bonk";
        }
        if (!user) {
            // return { success: false, error: "Could not authenticate user." };
            console.log("no user"); //temp
            user.id = "bonk";
        }
        // get supabase client
        const serverClient = await getServerClient();

        // create event in supabase
        console.log('creating!')
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
        console.log('finished!')
        if (error) {
            console.log('failed!')
            return { success: false, error: error.message };
        }
        return { success: true, data };
    }
    catch (err) {
        console.log('got cooked!')
        return { success: false, error: String(err) };
    }
}

export async function deleteEvent(event_id : string /**stub */) {}