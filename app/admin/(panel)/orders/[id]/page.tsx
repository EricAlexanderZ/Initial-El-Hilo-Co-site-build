import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import OrderStatusBadge from "@/components/admin/order-status-badge";
import OrderControls from "@/components/admin/order-controls";
import ProofUpload from "@/components/admin/proof-upload";
import type { Order } from "@/lib/types/orders";

type OrderWithProofs = Order & { proof_urls: string[] };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const order = data as OrderWithProofs;

  const placedAt = new Date(order.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href="/admin/orders" className="text-sm font-semibold text-gray-400 hover:text-black">
          ← Orders
        </Link>
        <span className="text-gray-300">|</span>
        <OrderStatusBadge status={order.status} />
      </div>

      <h1 className="text-3xl font-extrabold">{order.customer_name}</h1>
      <p className="mt-1 text-sm text-gray-500">
        <span className="font-mono font-bold text-[#13294b]">
          {order.order_number ?? `#${order.id.slice(0, 8).toUpperCase()}`}
        </span>
        {" · "}Placed {placedAt}
      </p>

      {/* Body */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">

        {/* Right — controls (first on mobile, second on desktop) */}
        <div className="order-1 space-y-5 self-start lg:order-2">
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold">Manage Order</h2>
            <OrderControls
              orderId={order.id}
              currentStatus={order.status}
              currentNotes={order.notes}
              isArchived={!!order.archived_at}
            />
          </div>

          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <ProofUpload orderId={order.id} />
            {order.proof_urls?.length > 0 && (
              <div className="mt-5 border-t border-black/5 pt-4">
                <p className="mb-3 text-sm font-bold">Uploaded Proofs</p>
                <div className="flex flex-wrap gap-2">
                  {order.proof_urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#13294b] px-4 py-1.5 text-xs font-semibold text-[#13294b] transition hover:bg-[#eef2f7]"
                    >
                      View Proof {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Left — order details (second on mobile, first on desktop) */}
        <div className="order-2 space-y-6 lg:order-1">

          {/* Customer */}
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Customer Info</h2>
            <div className="space-y-2 text-sm">
              <InfoRow label="Name"  value={order.customer_name} />
              <InfoRow label="Email" value={order.customer_email} />
              {order.customer_phone && <InfoRow label="Phone" value={order.customer_phone} />}
            </div>
            {order.shipping_address && (
              <div className="mt-4 border-t border-black/5 pt-4 text-sm">
                <p className="font-semibold">Ship to</p>
                <p className="mt-1 text-gray-600">
                  {order.shipping_address.line1}
                  {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                </p>
              </div>
            )}
            {order.tracking_source && (
              <div className="mt-4 border-t border-black/5 pt-4 text-sm">
                <p className="font-semibold">Order Source</p>
                <span className="mt-1 inline-block rounded-full bg-[#fff8e7] px-3 py-1 text-xs font-bold text-[#d39a14]">
                  📣 {order.tracking_source}
                </span>
              </div>
            )}
          </div>

          {/* Items */}
          {order.order_items?.map((item, i) => (
            <div key={item.id} className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">
                Item {i + 1} — {item.product_type}
              </h2>

              <div className="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2 sm:gap-x-8">
                {item.style    && <InfoRow label="Style"     value={item.style} />}
                {item.color    && <InfoRow label="Color"     value={item.color} />}
                <InfoRow label="Quantity"  value={String(item.quantity)} />
                {item.placement?.length > 0 && (
                  <InfoRow label="Placement" value={item.placement.join(", ")} />
                )}
                {Object.entries(item.details ?? {})
                  .filter(([k]) => k !== "Instructions")
                  .map(([k, v]) => (
                    <InfoRow key={k} label={k} value={v} />
                  ))}
              </div>
              {item.details?.Instructions && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">Customer Instructions</p>
                  <p className="text-sm text-amber-900 whitespace-pre-wrap">{item.details.Instructions}</p>
                </div>
              )}

              <div className="mt-4 flex gap-6 border-t border-black/5 pt-4 text-sm">
                <InfoRow label="Total"    value={`$${item.price.toFixed(2)}`} />
                <InfoRow label="Per unit" value={`$${item.unit_price.toFixed(2)}`} />
              </div>

              {/* Artwork files */}
              {item.artwork_urls?.length > 0 && (
                <div className="mt-5 border-t border-black/5 pt-4">
                  <p className="mb-3 text-sm font-bold">Artwork Files</p>
                  <div className="flex flex-wrap gap-2">
                    {item.artwork_urls.map((url, j) => (
                      <a
                        key={j}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#13294b] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0f1f39]"
                      >
                        ↓ Artwork {j + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Order total */}
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping ({order.shipping_method ?? "TBD"})</span>
                <span>${order.shipping_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-black/5 pt-3 text-base font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold">{label}:</span>{" "}
      <span className="text-gray-600">{value}</span>
    </p>
  );
}
