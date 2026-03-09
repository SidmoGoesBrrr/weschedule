
 'use client'
import { userLogin } from "@/lib/userUtil"

export default function page(){

    
    return(<div className="flex flex-col">
        <form action = {async (formData)=>{console.log(await userLogin( formData))}}>
            <input type="text" name="email" placeholder="email" required></input>
            <input type="text" name="password" placeholder="password"></input>
            <button type="submit">Login</button>
        </form>
    </div>)
}


