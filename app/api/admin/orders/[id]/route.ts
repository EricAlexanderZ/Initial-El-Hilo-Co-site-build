import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderStatusUpdate, statusNotifiesCustomer } from "@/lib/email";
import type { OrderStatus } from "@/lib/types/orders";

/**
 * Statuses the database will accept.
 *
 * orders.status carries a CHECK constraint, so an unrecognised value fails at
 * Postgres and surfaces as an opaque 500. Validating here turns that into a
 * useful 400, and stops a typo from silently emailing nobody.
 */
const ORDER_STATUSES: readonly OrderStatus[] = [
  "new",
  "proof_sent",
  "proof_approved",
  "in_production",
  "shipped",
  "complete",
  "cancelled",
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MAX_NOTES_LEN = 5000;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Postgres errors on a malformed uuid cast, which would otherwise be a 500
  // whose message leaks the query shape.
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: { status?: unknown; notes?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    body.status !== undefined &&
    !(ORDER_STATUSES as readonly unknown[]).includes(body.status)
  ) {
    return NextResponse.json({ error: "Unknown order status." }, { status: 400 });
  }
  if (body.notes !== undefined && typeof body.notes !== "string") {
    return NextResponse.json({ error: "Notes must be text." }, { status: 400 });
  }

  const notes = typeof body.notes === "string" ? body.notes.trim() : undefined;
  if (notes !== undefined && notes.length > MAX_NOTES_LEN) {
    return NextResponse.json(
      { error: `Notes must be under ${MAX_NOTES_LEN} characters.` },
      { status: 400 }
    );
  }

  // Read first. The previous status is what tells us whether this is a real
  // transition worth emailing about, and the row carries the customer details
  // rather than us trusting the client to supply them.
  const { data: current, error: readError } = await supabaseAdmin
    .from("orders")
    .select("status, customer_email, customer_name, order_number")
    .eq("id", id)
    .single();

  if (readError || !current) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const nextStatus = body.status as OrderStatus | undefined;
  const statusChanged = !!nextStatus && nextStatus !== current.status;

  const update: Record<string, unknown> = {};
  if (nextStatus !== undefined) update.status = nextStatus;
  if (notes !== undefined) update.notes = notes;

  if (Object.keys(update).length > 0) {
    const { error } = await supabaseAdmin.from("orders").update(update).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  /*
   * Notify the customer, but only on a genuine transition.
   *
   * Awaited deliberately. Vercel freezes the function the moment it responds,
   * so a fire-and-forget send is killed before it reaches SMTP and the customer
   * is never told, with nothing in the logs to show for it. That exact bug has
   * bitten this codebase before.
   *
   * Failure is caught rather than thrown: the status change is already saved,
   * and reporting the whole update as failed would invite the owner to click
   * again, emailing the customer twice.
   */
  let notified = false;
  if (statusChanged && statusNotifiesCustomer(nextStatus!)) {
    try {
      notified = await sendOrderStatusUpdate({
        to: current.customer_email,
        name: current.customer_name,
        orderNumber: current.order_number,
        status: nextStatus!,
      });
    } catch (e) {
      console.error("[api/admin/orders] status email failed:", e);
    }
  }

  return NextResponse.json({
    ok: true,
    statusChanged,
    notified,
    // So the UI can name the address it mailed rather than guess at it.
    notifiedEmail: notified ? current.customer_email : null,
  });
}
