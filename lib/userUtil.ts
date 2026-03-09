"use server"
import { createServerClient} from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { ResponseCookies, type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { success } from "zod";
interface users{
    name: string,
    email: string,
    password:string,
    event_id_ref:number,
    perms:string,
}[]
//  serverClient:SupabaseClient;
//     cookieStore:ReadonlyRequestCookies;

async function createClient():Promise<SupabaseClient>{//:Return a client for interacting with supabase database
    const cookieStore = await cookies();
    const options = {
        cookies:{
            getAll(){
                return cookieStore.getAll();
            },
            setAll(cookieList:{ name:string, value:string, options:object }[]){
                try{
                    cookieList.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                }catch{

                }
            }
        }
    }
    const supabaseUrl:string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey:string = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    return createServerClient(
        supabaseUrl,
        supabaseKey,
        options
    );
};
export async function getUsersLogins():Promise<PostgrestSingleResponse<users[]>>{
    const client = await createClient();
    return(await client.from("userslogin").select("*") as PostgrestSingleResponse<users[]>);
}
export async function userLogin(formData:FormData){
    const cookieStore = await cookies();
    const successResponse = JSON.stringify({msg:"success login"});
    const failureResponse = JSON.stringify({msg:"fail login"});
    //input data
    const [email, password] = [formData.get("email"), formData.get("password")];
   
    const {data} = await getUsersLogins();
    if(data){
        const users = data;
        for(let i = 0; i < users.length i++){
            if(users[i].email == email){
                if(users[i].password == ""){
                    //login without any password
                    return successResponse;
                    
                }else{
                    //login with password
                    if(users[i].password == password){//if database acc has password, check password matches
                        return(successResponse);
                    }
                }
            }
        }
            
        
    }
    return failureResponse;


}


