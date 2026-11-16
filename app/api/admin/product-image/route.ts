import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase-admin-auth";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;

  try {
    const form = await request.formData();
    const file = form.get("file");
    const productId = String(form.get("productId") || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!(file instanceof File) || !productId) return NextResponse.json({ error: "Choose a product and image file." }, { status: 400 });
    if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Use a JPG, PNG or WebP image." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });

    const path = `${productId}/${Date.now()}.${extensions[file.type]}`;
    const { error: uploadError } = await auth.admin.storage.from("product-images").upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (uploadError) return NextResponse.json({ error: "Image upload failed. Check the product-images storage bucket." }, { status: 502 });

    const { data } = auth.admin.storage.from("product-images").getPublicUrl(path);
    return NextResponse.json({ image_url: data.publicUrl });
  } catch {
    return NextResponse.json({ error: "Could not process image upload." }, { status: 400 });
  }
}
