import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderConfirmation, sendAdminNewOrderAlert } from "@/lib/email";
import {
  buildLineItems,
  computeOrderAmounts,
  type PromoCheckoutRequest,
} from "@/lib/promo/everyday-polo";

// Persists a paid "Everyday Work Polo" promo order into the shared orders /
// order_items tables (so it surfaces in the existing admin panel). Totals are
// recomputed authoritatively here — the client-sent amounts are never trusted.
export async function POST(request: NextRequest) {
  const body = (await request.json()) as PromoCheckoutRequest;
  const { config, fulfillment, customer } = body;

  // ── Validate + recompute the authoritative amounts ───────────────────────
  const amounts = computeOrderAmounts(config, fulfillment);
  if ("error" in amounts) {
    return NextResponse.json({ error: amounts.error }, { status: 400 });
  }

  if (!customer?.name?.trim() || !customer?.email?.trim()) {
    return NextResponse.json({ error: "Customer name and email are required." }, { status: 400 });
  }

  // ── Generate readable order number: ELHILOCO4501, 4502, … ────────────────
  const { count } = await supabaseAdmin
    .from("orders")
    .select("*", { count: "exact", head: true });

  const orderNumber = `ELHILOCO${4501 + (count ?? 0)}`;

  const trackingSource = body.trackingSource?.trim() || null;

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: customer.name.trim(),
      customer_email: customer.email.trim(),
      customer_phone: customer.phone?.trim() || null,
      shipping_address: fulfillment.address,
      shipping_method: fulfillment.method,
      shipping_price: amounts.shippingPrice,
      subtotal: amounts.subtotal,
      total: amounts.total,
      status: "new",
      tracking_source: trackingSource,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("[api/promo/everyday-polo] insert order error:", orderError);
    return NextResponse.json({ error: "Failed to save order." }, { status: 500 });
  }

  // ── Build the line items (authoritative pricing) ─────────────────────────
  const artworkUrls = Array.isArray(body.artworkUrls) ? body.artworkUrls.filter(Boolean) : [];
  const artworkPlacements = Array.isArray(body.artworkPlacements)
    ? body.artworkPlacements.filter(Boolean)
    : [];
  const instructions = body.instructions?.trim();

  const lineItems = buildLineItems(config).map((item) => ({
    order_id: order.id,
    product_type: item.product_type,
    style: item.style,
    color: item.color,
    quantity: item.quantity,
    placement: item.placement,
    details: {
      ...item.details,
      ...(artworkPlacements.length ? { "Logo Files": artworkPlacements.join(", ") } : {}),
      ...(instructions ? { Instructions: instructions } : {}),
    },
    artwork_urls: artworkUrls,
    price: item.price,
    unit_price: item.unit_price,
    per_piece_upcharge: item.per_piece_upcharge,
    flat_upcharge: item.flat_upcharge,
  }));

  const { error: itemsError } = await supabaseAdmin.from("order_items").insert(lineItems);

  if (itemsError) {
    console.error("[api/promo/everyday-polo] insert items error:", itemsError);
    return NextResponse.json({ error: "Failed to save order items." }, { status: 500 });
  }

  // ── Send emails (non-blocking) ───────────────────────────────────────────
  const emailItems = lineItems.map((i) => ({
    productType: i.product_type,
    quantity: i.quantity,
    price: i.price,
  }));

  // These MUST be awaited. Vercel freezes a serverless function the moment it
  // returns a response, so an un-awaited promise is killed mid-flight and the
  // email silently never sends. It works locally only because the dev server
  // keeps running long enough for the request to finish.
  //
  // allSettled, not all: the order is already saved, so a failed email must not
  // turn a successful order into an error for the customer.
  const emailResults = await Promise.allSettled([
    sendOrderConfirmation({
      to: customer.email.trim(),
      name: customer.name.trim(),
      orderId: order.id,
      items: emailItems,
      total: amounts.total,
    }),
    sendAdminNewOrderAlert({
      orderId: order.id,
      customerName: customer.name.trim(),
      customerEmail: customer.email.trim(),
      items: emailItems,
      total: amounts.total,
    }),
  ]);

  // Without this a rejected send is invisible, which is exactly how an email
  // outage goes unnoticed for weeks.
  emailResults.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `[api/promo-order] ${i === 0 ? "customer confirmation" : "admin alert"} failed:`,
        r.reason
      );
    }
  });

  return NextResponse.json({ orderId: order.id, orderNumber: order.order_number });
}
