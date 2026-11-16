import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function requireAdmin(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map(email => email.trim().toLowerCase()).filter(Boolean);
  if (!url || !anonKey || !serviceKey || !allowed.length) {
    return { error: NextResponse.json({ error: "Admin access is not configured. Add Supabase keys and ADMIN_EMAILS in the deployment environment." }, { status: 503 }) };
  }

  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user?.email || !allowed.includes(data.user.email.toLowerCase())) {
    return { error: NextResponse.json({ error: "You do not have permission to access the admin area." }, { status: 403 }) };
  }

  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return { admin: adminClient, user: data.user };
}
