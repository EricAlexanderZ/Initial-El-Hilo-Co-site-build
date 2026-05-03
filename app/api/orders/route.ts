import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderConfirmation, sendAdminNewOrderAlert } from "@/lib/email";
import type { CartItem } from "@/types/cart";

type OrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  shippingMethod: string;
  shippingPrice: number;
  subtotal: number;
  total: number;
  items: CartItem[];
};

export async function POST(request: NextRequest) {
  const body: OrderPayload = await request.json();

  // ── Generate readable order number: ELHILOCO4501, 4502, … ────
  const { count } = await supabaseAdmin
    .from("orders")
    .select("*", { count: "exact", head: true });

  const orderNumber = `ELHILOCO${4501 + (count ?? 0)}`;

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number:     orderNumber,
      customer_name:    body.customerName,
      customer_email:   body.customerEmail,
      customer_phone:   body.customerPhone || null,
      shipping_address: body.shippingAddress,
      shipping_method:  body.shippingMethod,
      shipping_price:   body.shippingPrice,
      subtotal:         body.subtotal,
      total:            body.total,
      status:           "new",
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("[api/orders] insert order error:", orderError);
    return NextResponse.json({ error: "Failed to save order." }, { status: 500 });
  }

  const orderItems = body.items.map((item) => ({
    order_id:           order.id,
    product_type:       item.productType,
    style:              item.style,
    color:              item.color,
    quantity:           item.quantity,
    placement:          item.placement,
    details:            item.details,
    artwork_urls:       item.artworkUrls ?? [],
    price:              item.price,
    unit_price:         item.unitPrice,
    per_piece_upcharge: item.perPieceUpcharge,
    flat_upcharge:      item.flatUpcharge,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("[api/orders] insert items error:", itemsError);
    return NextResponse.json({ error: "Failed to save order items." }, { status: 500 });
  }

  // ── Send emails (non-blocking) ────────────────────────────────
  const emailItems = body.items.map((i) => ({
    productType: i.productType,
    quantity:    i.quantity,
    price:       i.price,
  }));

  Promise.allSettled([
    sendOrderConfirmation({
      to:      body.customerEmail,
      name:    body.customerName,
      orderId: order.id,
      items:   emailItems,
      total:   body.total,
    }),
    sendAdminNewOrderAlert({
      orderId:       order.id,
      customerName:  body.customerName,
      customerEmail: body.customerEmail,
      items:         emailItems,
      total:         body.total,
    }),
  ]);

  return NextResponse.json({ orderId: order.id, orderNumber: order.order_number });
}
