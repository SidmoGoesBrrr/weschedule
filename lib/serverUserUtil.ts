'use server'
import { redirect } from "next/navigation";
import { createServerClient} from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { ResponseCookies, type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface users{
    name: string,
    email: string,
    password:string,
    event_id_ref:number,
    perms:string,
}[]
interface refreshToken{
    email: string,
    event_id_ref:number,
    typ:"refresh"
}
interface accessToken{
    name:string,
    email: string,
    event_id_ref:number,
    perms:string,
    typ:"access"
}
//  serverClient:SupabaseClient;
//     cookieStore:ReadonlyRequestCookies;
const userAccessTokenAlias = "userAccessToken";
const userRefreshTokenAlias = "userRefreshTokenAlias";

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
export async function getUsersLogins():Promise<PostgrestSingleResponse<users[]>>{//used in backend to check login info with exisiting login in database
    const client = await createClient();
    return(await client.from("userslogin").select("*") as PostgrestSingleResponse<users[]>);
}
function getUserRefreshToken(eventId:number, userEmail:string): string { 
    return jwt.sign({eventId:eventId, userEmail:userEmail}, process.env.JWT_KEY as string, {expiresIn:900});
}
function getUserToken(eventId:string, userEmail:string): string {
    return jwt.sign({eventId:eventId, userEmail:userEmail}, process.env.JWT_KEY as string, {expiresIn:120});
}
export async function verifyUser(token:string){//use this function if you want to verify user is logined
    const cookieStore = await cookies();
    const userAccessToken = await cookieStore.get(userAccessTokenAlias);
    if(userAccessToken == null){
        const userRefreshToken = await cookieStore.get(userRefreshTokenAlias);
        if(userRefreshToken == null){
            return false;
        }else{
            return true;
        }
    }else{
        return true;
    }
    return false;
}


export async function userLogin(formData:FormData){

    const cookieStore = await cookies();
    const successResponse = JSON.stringify({msg:"success login"});
    const failureResponse = JSON.stringify({msg:"fail login"});
    //input data
    const [email, password] = [formData.get("email"), formData.get("password")];
   
    const {data} = await getUsersLogins();//get all logins on database
    if(data){
        const users = data;
        for(let i = 0; i < users.length; i++){//check if login info is valid
            if(users[i].email == email){
                if(users[i].password == ""){
                    //login without any password
                    const token = jwt.sign({name:users[i].name, email:users[i].email}, process.env.JWT_KEY as string);
                    cookieStore.set("userToken", token, {path:"/"});
                    //reroute to create page(tba)
                    redirect("\eventcreator");
                    return successResponse;
                
                    
                }else{
                    //login with password
                    
                    if(users[i].password == password){//if database acc has password, check password matches
                        const token = jwt.sign({name:users[i].name, email:users[i].email}, process.env.JWT_KEY as string);
                        cookieStore.set("userToken", token);
                        //reroute to create page(tba)
                        redirect("/eventcreator");
                        return(successResponse);
                    }
                }
            }
        }
            
        
    }
    return failureResponse;


}


