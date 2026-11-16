import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase-admin-auth";

export const runtime = "nodejs";
const statuses = ["pending_confirmation", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;
  const { data, error } = await auth.admin.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) return NextResponse.json({ error: "Could not load orders." }, { status: 502 });
  return NextResponse.json({ orders: data });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    if (typeof body.id !== "string" || !statuses.includes(body.status)) return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    const { data, error } = await auth.admin.from("orders").update({ status: body.status, updated_at: new Date().toISOString() }).eq("id", body.id).select().single();
    if (error) return NextResponse.json({ error: "Could not update order status." }, { status: 502 });
    return NextResponse.json({ order: data });
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
}
