import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
const COOKIE = "nivora_admin_session";
export function isAdminSessionValid(request: Request) {
 const token=request.headers.get("cookie")?.split(";").map(v=>v.trim()).find(v=>v.startsWith(COOKIE+"="))?.slice(COOKIE.length+1)||"";
 const [expires,signature]=token.split("."); const secret=process.env.ADMIN_SESSION_SECRET||"";
 if(!secret||!expires||!signature||Number(expires)<Date.now()) return false;
 const expected=createHmac("sha256",secret).update(expires).digest("hex"); const a=Buffer.from(signature),b=Buffer.from(expected);
 return a.length===b.length&&timingSafeEqual(a,b);
}
export async function requireAdmin(request: Request) {
 if(!isAdminSessionValid(request)) return {error:NextResponse.json({error:"Admin sign-in required."},{status:401})};
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key) return {error:NextResponse.json({error:"Admin database connection is not configured."},{status:503})};
 return {admin:createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})};
}
export function createAdminSessionResponse(request: Request) {
 const secret=process.env.ADMIN_SESSION_SECRET||""; const expires=String(Date.now()+8*60*60*1000);
 const signature=createHmac("sha256",secret).update(expires).digest("hex");
 const secure=new URL(request.url).protocol==="https:"?"; Secure":"";
 return new Response(JSON.stringify({ok:true}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":COOKIE+"="+expires+"."+signature+"; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800"+secure}});
}
export function clearAdminSessionResponse() {
 return new Response(JSON.stringify({ok:true}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":COOKIE+"=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"}});
}
