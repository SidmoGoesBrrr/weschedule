import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getUser } from "./lib/serverUserUtil";
export async function middleware(request:NextRequest){
    const user = await getUser();
    if(user.error != null){
        return NextResponse.redirect(new URL("/login",request.url));
    }else{
        console.log(user);
        return NextResponse.next();
    }

}
export const config ={
    matcher:["/eventcreator", "/availability"],
}