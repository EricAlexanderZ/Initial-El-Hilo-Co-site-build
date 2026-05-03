import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import StatCard from "@/components/admin/stat-card";
import OrderStatusBadge from "@/components/admin/order-status-badge";
import type { Order, OrderStatus } from "@/lib/types/orders";

const PIPELINE: { status: OrderStatus; label: string; color: string }[] = [
  { status: "new",            label: "New",           color: "bg-blue-500"   },
  { status: "proof_sent",     label: "Proof Sent",    color: "bg-purple-500" },
  { status: "proof_approved", label: "Approved",      color: "bg-yellow-500" },
  { status: "in_production",  label: "In Production", color: "bg-orange-500" },
  { status: "shipped",        label: "Shipped",       color: "bg-teal-500"   },
  { status: "complete",       label: "Complete",      color: "bg-green-500"  },
];

async function getDashboardData() {
  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("id, customer_name, customer_email, total, status, created_at, order_items(product_type, quantity)")
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return { stats: { total: 0, revenue: 0, needsAction: 0, thisWeek: 0 }, pipeline: {}, recent: [] };
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const stats = {
    total:       orders.length,
    revenue:     orders.reduce((s, o) => s + o.total, 0),
    needsAction: orders.filter((o) => o.status === "new" || o.status === "proof_sent").length,
    thisWeek:    orders.filter((o) => new Date(o.created_at) >= weekAgo).length,
  };

  const pipeline: Record<string, number> = {};
  for (const o of orders) {
    pipeline[o.status] = (pipeline[o.status] ?? 0) + 1;
  }

  return { stats, pipeline, recent: orders.slice(0, 6) as Order[] };
}

export default async function AdminDashboard() {
  const { stats, pipeline, recent } = await getDashboardData();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back — here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard label="Total Orders"  value={stats.total}                             accent />
        <StatCard label="Total Revenue" value={`$${stats.revenue.toFixed(2)}`}                  />
        <StatCard label="Needs Action"  value={stats.needsAction} sub="New + Proof Sent"        />
        <StatCard label="This Week"     value={stats.thisWeek}    sub="orders placed"           />
      </div>

      {/* Order Pipeline */}
      <div className="mt-10">
        <h2 className="mb-5 text-xl font-bold">Order Pipeline</h2>
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
          {PIPELINE.map((stage) => {
            const count = pipeline[stage.status] ?? 0;
            return (
              <Link
                key={stage.status}
                href={`/admin/orders?status=${stage.status}`}
                className="group rounded-[1.25rem] bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className={`h-1.5 w-10 rounded-full ${stage.color} mb-3 transition group-hover:w-full`} />
                <p className="text-2xl font-extrabold">{count}</p>
                <p className="mt-1 text-xs font-semibold text-gray-500">{stage.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-[#13294b] hover:underline">
            View all →
          </Link>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm">
          {recent.length === 0 ? (
            <div className="py-20 text-center text-sm text-gray-400">
              No orders yet — they&apos;ll show up here once customers check out.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-left">
                    <th className="px-5 py-4 font-semibold text-gray-400">Customer</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Product</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Total</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Status</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Date</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((order) => (
                    <tr key={order.id} className="border-b border-black/5 last:border-0">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {order.order_items?.[0]?.product_type ?? "—"}
                      </td>
                      <td className="px-5 py-4 font-semibold">${order.total.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="rounded-full bg-[#13294b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0f1f39]"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
