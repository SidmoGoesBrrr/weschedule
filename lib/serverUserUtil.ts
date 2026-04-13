'use server'
import {createServerClient} from "@supabase/ssr";
import { cookies} from "next/headers";
import { CookieMethodsServer } from "@supabase/ssr";
import { GetAllCookies } from "@supabase/ssr";
import { create } from "domain";
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
export async function getUser(){ //returns userResponse object containing .data and .error.
    //a user is authenticated if .error is null, and not authenticated if otherwise
    const serverClient = await makeServerClient();
    const currentUser = await serverClient.auth.getUser();
    return(currentUser);

}