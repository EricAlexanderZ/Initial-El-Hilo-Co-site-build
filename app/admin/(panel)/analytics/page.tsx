import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Order, OrderStatus } from "@/lib/types/orders";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new:            "New",
  proof_sent:     "Proof Sent",
  proof_approved: "Approved",
  in_production:  "In Production",
  shipped:        "Shipped",
  complete:       "Complete",
  cancelled:      "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  new:            "bg-blue-400",
  proof_sent:     "bg-purple-400",
  proof_approved: "bg-yellow-400",
  in_production:  "bg-orange-400",
  shipped:        "bg-teal-400",
  complete:       "bg-green-400",
  cancelled:      "bg-red-400",
};

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function weekLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AnalyticsPage() {
  const { data } = await supabaseAdmin
    .from("orders")
    .select("id, total, status, created_at, order_items(product_type)")
    .order("created_at", { ascending: true });

  const orders = (data ?? []) as Order[];

  // ── Revenue by week (last 8 weeks) ────────────────────────────
  const now   = new Date();
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    return startOfWeek(d);
  }).reverse();

  const weeklyRevenue = weeks.map((weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const revenue = orders
      .filter((o) => {
        const d = new Date(o.created_at);
        return d >= weekStart && d < weekEnd;
      })
      .reduce((s, o) => s + o.total, 0);
    return { label: weekLabel(weekStart), revenue };
  });

  const maxWeekRevenue = Math.max(...weeklyRevenue.map((w) => w.revenue), 1);

  // ── Orders by product type ─────────────────────────────────────
  const productCounts: Record<string, number> = {};
  for (const order of orders) {
    for (const item of order.order_items ?? []) {
      productCounts[item.product_type] = (productCounts[item.product_type] ?? 0) + 1;
    }
  }
  const topProducts = Object.entries(productCounts).sort(([, a], [, b]) => b - a);
  const maxProduct  = Math.max(...topProducts.map(([, c]) => c), 1);

  // ── Orders by status ──────────────────────────────────────────
  const statusCounts: Partial<Record<OrderStatus, number>> = {};
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  }

  // ── Totals ────────────────────────────────────────────────────
  const totalRevenue  = orders.reduce((s, o) => s + o.total, 0);
  const completedRevenue = orders.filter((o) => o.status === "complete").reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Revenue and order trends at a glance.</p>
      </div>

      {/* Summary cards */}
      <div className="mb-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: "Total Revenue",     value: `$${totalRevenue.toFixed(2)}` },
          { label: "Completed Revenue", value: `$${completedRevenue.toFixed(2)}` },
          { label: "Total Orders",      value: orders.length },
          { label: "Avg Order Value",   value: `$${avgOrder.toFixed(2)}` },
        ].map((c) => (
          <div key={c.label} className="rounded-[1.5rem] bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{c.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Weekly revenue */}
        <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-bold">Revenue by Week</h2>
          <div className="space-y-3">
            {weeklyRevenue.map((w) => (
              <div key={w.label} className="flex items-center gap-3 text-sm">
                <span className="w-16 shrink-0 text-xs text-gray-400">{w.label}</span>
                <div className="flex-1 rounded-full bg-gray-100">
                  <div
                    className="h-5 rounded-full bg-[#13294b] transition-all"
                    style={{ width: `${(w.revenue / maxWeekRevenue) * 100}%`, minWidth: w.revenue > 0 ? "8px" : "0" }}
                  />
                </div>
                <span className="w-20 text-right font-semibold">
                  {w.revenue > 0 ? `$${w.revenue.toFixed(0)}` : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-bold">Orders by Product</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map(([product, count]) => (
                <div key={product} className="flex items-center gap-3 text-sm">
                  <span className="w-32 shrink-0 truncate text-xs text-gray-600">{product}</span>
                  <div className="flex-1 rounded-full bg-gray-100">
                    <div
                      className="h-5 rounded-full bg-[#ffd84d] transition-all"
                      style={{ width: `${(count / maxProduct) * 100}%`, minWidth: "8px" }}
                    />
                  </div>
                  <span className="w-8 text-right font-semibold">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="rounded-[1.5rem] bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-6 text-lg font-bold">Orders by Status</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => {
              const count = statusCounts[status] ?? 0;
              return (
                <div key={status} className="rounded-2xl bg-[#f6f6f4] p-4 text-center">
                  <div className={`mx-auto h-2 w-2 rounded-full ${STATUS_COLORS[status]}`} />
                  <p className="mt-2 text-2xl font-extrabold">{count}</p>
                  <p className="mt-1 text-xs text-gray-500">{STATUS_LABELS[status]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
