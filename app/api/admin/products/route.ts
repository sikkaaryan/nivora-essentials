import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase-admin-auth";

export const runtime = "nodejs";
const ranges = ["Essential", "Everyday", "Premium", "Luxury"];
const audiences = ["Men", "Women", "Boy", "Girl"];
const clean = (value: unknown, max = 180) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;
  const { data, error } = await auth.admin.from("products").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load products. Run the latest Supabase schema." }, { status: 502 });
  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const id = clean(body.id, 80).toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const name = clean(body.name);
    const audience = clean(body.audience);
    const type = clean(body.type, 80);
    const range = clean(body.range);
    const price = Number(body.price);
    const sizes = Array.isArray(body.sizes) ? body.sizes.map((size: unknown) => clean(size, 20)).filter(Boolean).slice(0, 30) : [];
    if (!id || !name || !audiences.includes(audience) || !type || !ranges.includes(range) || !Number.isInteger(price) || price < 1 || !sizes.length) {
      return NextResponse.json({ error: "Complete all product fields with a valid audience, range, price and at least one size." }, { status: 400 });
    }
    const wholesalePrice = Math.round(price * 0.7);
    const minQuantity = body.min_quantity === "" || body.min_quantity == null ? 25 : Number(body.min_quantity);
    if (!Number.isInteger(minQuantity) || minQuantity < 1 || minQuantity > 5000) return NextResponse.json({ error: "Minimum quantity must be between 1 and 5,000." }, { status: 400 });
    if (wholesalePrice !== null && (!Number.isInteger(wholesalePrice) || wholesalePrice < 1 || wholesalePrice > price)) return NextResponse.json({ error: "Wholesale price must be a positive amount no higher than retail price." }, { status: 400 });
    const record = { id, name, audience, type, range, price, wholesale_price: wholesalePrice, min_quantity: minQuantity, sizes, tone: clean(body.tone, 60) || "Classic", image_url: clean(body.image_url, 1000) || null, active: body.active !== false, updated_at: new Date().toISOString() };
    const { data, error } = await auth.admin.from("products").upsert(record, { onConflict: "id" }).select().single();
    if (error) return NextResponse.json({ error: "Could not save product. Check the products table schema and unique product ID." }, { status: 502 });
    return NextResponse.json({ product: data });
  } catch { return NextResponse.json({ error: "Invalid product payload." }, { status: 400 }); }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;
  try {
    const { id } = await request.json();
    const productId = clean(id, 80);
    if (!productId) return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    const { error } = await auth.admin.from("products").update({ active: false, updated_at: new Date().toISOString() }).eq("id", productId);
    if (error) return NextResponse.json({ error: "Could not archive product." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
}
