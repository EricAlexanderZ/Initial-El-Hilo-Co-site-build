import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Order, OrderItem } from "@/lib/types/orders";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: original } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!original) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const order = original as Order;

  const { data: newOrder, error } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_name:    order.customer_name,
      customer_email:   order.customer_email,
      customer_phone:   order.customer_phone,
      shipping_address: order.shipping_address,
      shipping_method:  order.shipping_method,
      shipping_price:   order.shipping_price,
      subtotal:         order.subtotal,
      total:            order.total,
      status:           "new",
      notes:            `Reorder of #${order.id.slice(0, 8).toUpperCase()}`,
    })
    .select("id")
    .single();

  if (error || !newOrder) {
    return NextResponse.json({ error: "Failed to clone order" }, { status: 500 });
  }

  const clonedItems = (order.order_items ?? []).map((item: OrderItem) => ({
    order_id:           newOrder.id,
    product_type:       item.product_type,
    style:              item.style,
    color:              item.color,
    quantity:           item.quantity,
    placement:          item.placement,
    details:            item.details,
    artwork_urls:       [],
    price:              item.price,
    unit_price:         item.unit_price,
    per_piece_upcharge: item.per_piece_upcharge,
    flat_upcharge:      item.flat_upcharge,
  }));

  await supabaseAdmin.from("order_items").insert(clonedItems);

  return NextResponse.json({ orderId: newOrder.id });
}
