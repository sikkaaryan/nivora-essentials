import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminSessionResponse, clearAdminSessionResponse, isAdminSessionValid } from "@/lib/supabase-admin-auth";
export const runtime = "nodejs";
function same(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
export async function GET(request:Request){const ok=isAdminSessionValid(request);return NextResponse.json({authenticated:ok},{status:ok?200:401});}
export async function POST(request:Request){
 const idExpected=process.env.ADMIN_ID||"",passExpected=process.env.ADMIN_PASSWORD||"",secret=process.env.ADMIN_SESSION_SECRET||"";
 if(!idExpected||!passExpected||secret.length<32)return NextResponse.json({error:"Admin credentials or session secret are not configured."},{status:503});
 try{const body=await request.json();const id=typeof body.id==="string"?body.id:"";const password=typeof body.password==="string"?body.password:"";
 if(!same(id,idExpected)||!same(password,passExpected))return NextResponse.json({error:"Incorrect admin ID or password."},{status:401});
 return createAdminSessionResponse(request);
 }catch{return NextResponse.json({error:"Invalid sign-in request."},{status:400});}
}
export async function DELETE(){return clearAdminSessionResponse();}
