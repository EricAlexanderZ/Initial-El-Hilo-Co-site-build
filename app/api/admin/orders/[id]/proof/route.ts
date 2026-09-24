import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderStatusUpdate } from "@/lib/email";

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

  // Append URL to proof_urls array and update status to proof_sent.
  // Customer details come along because the notification below needs them, and
  // reading the row once is cheaper than reading it twice.
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("proof_urls, customer_email, customer_name, order_number")
    .eq("id", id)
    .single();

  const existing: string[] = (order as { proof_urls: string[] } | null)?.proof_urls ?? [];

  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ proof_urls: [...existing, publicUrl], status: "proof_sent" })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  /*
   * Tell the customer their proof is ready, with a link straight to it.
   *
   * Sent on every upload, not only the first. A revised proof is exactly the
   * thing a customer needs to be told about, and by the second upload the
   * status is already proof_sent, so keying off a status change would go quiet
   * precisely when it matters.
   *
   * Awaited: Vercel freezes the function on response, so an un-awaited send
   * never reaches SMTP. Caught, because the proof is already uploaded and
   * stored, and failing the request would invite a re-upload and a duplicate.
   */
  let notified = false;
  if (order?.customer_email) {
    try {
      notified = await sendOrderStatusUpdate({
        to: order.customer_email,
        name: order.customer_name,
        orderNumber: order.order_number,
        status: "proof_sent",
        proofUrl: publicUrl,
      });
    } catch (e) {
      console.error("[api/admin/orders/proof] proof email failed:", e);
    }
  }

  return NextResponse.json({
    url: publicUrl,
    notified,
    notifiedEmail: notified ? order?.customer_email ?? null : null,
  });
}
