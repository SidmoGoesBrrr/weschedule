import { createBrowserClient } from "@supabase/ssr";
function getSupabaseVariables(){
    const url:string|undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon_key:string|undefined = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    if(url == undefined || anon_key == undefined){
        throw new Error("no environmental variable NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");
    }else{
        return({url:url, anon_key:anon_key});
    }
}
export async function makeBrowserClient(){
    const {url, anon_key} = getSupabaseVariables();
    const client = await createBrowserClient(
            url,
            anon_key
    );
    return(client);
}

export async function signUp(email:string, password:string){
    const browserClient = await makeBrowserClient();
    const {data, error} =  await browserClient.auth.signUp({
        email: email,
        password: password,
    });
    return(error);
}
export async function login(email:string, password:string){
    const browserClient = await makeBrowserClient();
    const {data, error} =  await browserClient.auth.signInWithPassword({
        email: email,
        password: password,
    });
    return(error);
}