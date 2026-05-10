import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import OrderStatusBadge from "@/components/admin/order-status-badge";
import UnarchiveButton from "@/components/admin/unarchive-button";
import type { Order } from "@/lib/types/orders";

const DAYS = 365;

async function getArchivedOrders() {
  // Permanently delete orders archived more than 365 days ago
  const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString();
  await supabaseAdmin
    .from("orders")
    .delete()
    .not("archived_at", "is", null)
    .lt("archived_at", cutoff);

  const { data } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(product_type, quantity)")
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false });

  return (data ?? []) as (Order & { archived_at: string })[];
}

function daysRemaining(archivedAt: string) {
  const ms = DAYS * 24 * 60 * 60 * 1000 - (Date.now() - new Date(archivedAt).getTime());
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export default async function ArchivePage() {
  const orders = await getArchivedOrders();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Archive</h1>
        <p className="mt-1 text-sm text-gray-500">
          {orders.length} archived order{orders.length !== 1 ? "s" : ""} — permanently deleted after {DAYS} days.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[1.5rem] bg-white py-20 text-center text-sm text-gray-400 shadow-sm">
          No archived orders yet.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {orders.map((order) => {
              const days = daysRemaining(order.archived_at);
              return (
                <div key={order.id} className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-500">{order.order_items?.[0]?.product_type ?? "—"}</span>
                    <span className="font-bold">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs font-semibold ${days <= 30 ? "text-red-500" : "text-gray-400"}`}>
                      {days}d remaining
                    </span>
                    <div className="flex gap-2">
                      <UnarchiveButton orderId={order.id} />
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="rounded-full bg-[#13294b] px-4 py-1.5 text-xs font-semibold text-white"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-[1.5rem] bg-white shadow-sm md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  <th className="px-5 py-4 font-semibold text-gray-400">Customer</th>
                  <th className="px-5 py-4 font-semibold text-gray-400">Product</th>
                  <th className="px-5 py-4 font-semibold text-gray-400">Total</th>
                  <th className="px-5 py-4 font-semibold text-gray-400">Status</th>
                  <th className="px-5 py-4 font-semibold text-gray-400">Archived</th>
                  <th className="px-5 py-4 font-semibold text-gray-400">Deletes in</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const days = daysRemaining(order.archived_at);
                  return (
                    <tr key={order.id} className={`border-b border-black/5 last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                      <td className="px-5 py-4">
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{order.order_items?.[0]?.product_type ?? "—"}</td>
                      <td className="px-5 py-4 font-semibold">${order.total.toFixed(2)}</td>
                      <td className="px-5 py-4"><OrderStatusBadge status={order.status} /></td>
                      <td className="px-5 py-4 text-gray-400">{new Date(order.archived_at).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className={`font-semibold ${days <= 30 ? "text-red-500" : "text-gray-500"}`}>
                          {days} days
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <UnarchiveButton orderId={order.id} />
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="rounded-full bg-[#13294b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0f1f39]"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
