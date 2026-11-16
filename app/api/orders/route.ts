import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";


export const runtime = "nodejs";

type SubmittedItem = { productId: string; size: string; quantity: number };
type OrderBody = {
  name?: string; phone?: string; email?: string; address?: string; city?: string;
  state?: string; postalCode?: string; notes?: string; businessName?: string; gstin?: string;
  orderType?: "retail" | "wholesale"; items?: SubmittedItem[];
};

const clean = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as OrderBody;
    const name = clean(body.name, 120);
    const phone = clean(body.phone, 20);
    const email = clean(body.email, 254).toLowerCase();
    const address = clean(body.address, 300);
    const city = clean(body.city, 100);
    const state = clean(body.state, 100);
    const postalCode = clean(body.postalCode, 6);
    const businessName = clean(body.businessName, 160);
    const orderType = body.orderType === "wholesale" ? "wholesale" : "retail";
    const items = Array.isArray(body.items) ? body.items : [];

    if (!name || phone.replace(/\D/g, "").length < 10 || !/^\S+@\S+\.\S+$/.test(email) || !address || !city || !state || !/^\d{6}$/.test(postalCode) || (orderType === "wholesale" && !businessName)) {
      return NextResponse.json({ error: "Please complete all required customer and delivery details." }, { status: 400 });
    }
    if (!items.length || items.length > 50) return NextResponse.json({ error: "Your order must contain between 1 and 50 line items." }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: "Checkout is not connected yet. The store owner needs to configure Supabase in the deployment environment." }, { status: 503 });
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const productIds = [...new Set(items.map(item => item.productId))];
    const { data: liveProducts, error: productError } = await supabase.from("products").select("id,name,audience,price,wholesale_price,min_quantity,sizes,active").in("id", productIds).eq("active", true);
    if (productError || !liveProducts) return NextResponse.json({ error: "We couldn't verify the current catalogue. Please try again shortly." }, { status: 502 });
    const validatedItems = [];
    for (const item of items) {
      const product = liveProducts.find(candidate => candidate.id === item.productId);
      const quantity = Number(item.quantity);
      if (!product || !product.sizes.includes(item.size) || !Number.isInteger(quantity) || quantity < 1 || quantity > 500 || (orderType === "wholesale" && quantity < Number(product.min_quantity || 25))) {
        return NextResponse.json({ error: "One or more cart items are invalid. Please refresh your bag and try again." }, { status: 400 });
      }
      validatedItems.push({ product_id: product.id, product_name: product.name, audience: product.audience, size: item.size, quantity, unit_price: orderType === "wholesale" ? (product.wholesale_price || Math.round(product.price * 0.7)) : product.price, line_total: (orderType === "wholesale" ? (product.wholesale_price || Math.round(product.price * 0.7)) : product.price) * quantity, min_quantity: Number(product.min_quantity || 25) });
    }

    const subtotal = validatedItems.reduce((sum, item) => sum + item.line_total, 0);
    const orderNumber = `NIV-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${randomUUID().replaceAll("-","").slice(0,10).toUpperCase()}`;
    const order = {
      order_number: orderNumber, order_type: orderType, status: "pending_confirmation",
      customer_name: name, customer_phone: phone, customer_email: email,
      business_name: businessName || null, gstin: clean(body.gstin, 20) || null,
      delivery_address: address, delivery_city: city, delivery_state: state, delivery_postal_code: postalCode,
      customer_notes: clean(body.notes, 1000) || null, items: validatedItems, subtotal_inr: subtotal,
      currency: "INR", payment_status: "unpaid",
    };

    const { error: insertError } = await supabase.from("orders").insert(order);
    if (insertError) {
      console.error("Order insert failed:", insertError.message);
      return NextResponse.json({ error: "We couldn't save your order just now. Please try again shortly." }, { status: 502 });
    }

    let emailSent = false;
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.ORDER_NOTIFICATION_EMAIL;
    if (resendKey && notifyEmail) {
      const itemLines = validatedItems.map(item => `• ${item.product_name} / ${item.size} × ${item.quantity} — ₹${item.line_total.toLocaleString("en-IN")}`).join("\n");
      const emailText = [
        `NEW NIVORA ${orderType.toUpperCase()} ORDER: ${orderNumber}`,
        `Order reference: ${orderNumber}`, `Order type: ${orderType}`,
        `Customer name: ${name}`, `Customer email: ${email}`, `Customer phone: ${phone}`,
        `Business: ${order.business_name ?? "—"}`, `GSTIN: ${order.gstin ?? "—"}`,
        `Delivery address: ${address}, ${city}, ${state} - ${postalCode}`,
        "", "Items:", itemLines, "", `Estimated subtotal: ₹${subtotal.toLocaleString("en-IN")}`,
        `Notes: ${order.customer_notes ?? "—"}`, "Payment: Pay later — confirmation required.",
      ].join("\n");
      try {
        const mailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || "NIVORA Orders <onboarding@resend.dev>", to: [notifyEmail], subject: `New ${orderType} order ${orderNumber}`, text: emailText }),
        });
        emailSent = mailResponse.ok;
        if (!mailResponse.ok) console.error("Resend notification failed:", await mailResponse.text());
      } catch (mailError) { console.error("Resend request failed:", mailError); }
    }

    return NextResponse.json({ ok: true, orderNumber, emailSent }, { status: 201 });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json({ error: "Something went wrong while placing your order." }, { status: 500 });
  }
}
