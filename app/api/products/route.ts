import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { products as fallbackProducts } from "@/data/products";
export const revalidate = 60;
export async function GET() {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return NextResponse.json({products:fallbackProducts,source:"preview"});
 const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await supabase.from("products").select("id,name,audience,type,range,price,sizes,tone,wholesale_price,min_quantity,image_url").eq("active",true).order("created_at",{ascending:true});
 if(error){console.error("Catalogue query failed:",error.message);return NextResponse.json({products:fallbackProducts,source:"preview"});}
 return NextResponse.json({products:data??[],source:"supabase"});
}
