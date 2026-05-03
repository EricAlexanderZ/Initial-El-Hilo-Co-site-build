import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const form = await request.formData();
  const file = form.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext  = file.name.split(".").pop() ?? "bin";
  const path = `${id}/${Date.now()}.${ext}`;

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("Proofs")
    .upload(path, buffer, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from("Proofs").getPublicUrl(path);

  // Append URL to proof_urls array and update status to proof_sent
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("proof_urls")
    .eq("id", id)
    .single();

  const existing: string[] = (order as { proof_urls: string[] } | null)?.proof_urls ?? [];

  await supabaseAdmin
    .from("orders")
    .update({ proof_urls: [...existing, publicUrl], status: "proof_sent" })
    .eq("id", id);

  return NextResponse.json({ url: publicUrl });
}
