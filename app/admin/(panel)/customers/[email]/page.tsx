import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import OrderStatusBadge from "@/components/admin/order-status-badge";
import CloneOrderButton from "@/components/admin/clone-order-button";
import type { Order } from "@/lib/types/orders";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email: encodedEmail } = await params;
  const email = decodeURIComponent(encodedEmail);

  const { data } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(product_type, quantity)")
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) notFound();

  const orders = data as Order[];
  const customer = {
    name:       orders[0].customer_name,
    email:      orders[0].customer_email,
    phone:      orders[0].customer_phone,
    totalSpent: orders.reduce((s, o) => s + o.total, 0),
    firstOrder: orders[orders.length - 1].created_at,
    lastOrder:  orders[0].created_at,
  };

  const productCounts: Record<string, number> = {};
  for (const order of orders) {
    for (const item of order.order_items ?? []) {
      productCounts[item.product_type] = (productCounts[item.product_type] ?? 0) + 1;
    }
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/customers" className="text-sm font-semibold text-gray-400 hover:text-black">
          ← Customers
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold">{customer.name}</h1>
      <p className="mt-1 text-sm text-gray-500">{customer.email}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">

        {/* Left — order history */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Order History</h2>

          {orders.map((order) => (
            <div key={order.id} className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-400">
                    #{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {order.order_items?.map((item) => (
                      <p key={item.id} className="text-sm font-semibold">
                        {item.product_type}
                        <span className="ml-1 font-normal text-gray-500">× {item.quantity}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={order.status} />
                  <p className="font-bold">${order.total.toFixed(2)}</p>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-full bg-[#13294b] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0f1f39]"
                  >
                    View
                  </Link>
                  <CloneOrderButton orderId={order.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — customer profile */}
        <div className="space-y-5 self-start">
          {/* Contact */}
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Contact</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Email:</span> {customer.email}</p>
              <p><span className="font-semibold">Phone:</span> {customer.phone ?? "—"}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Stats</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total orders</span>
                <span className="font-bold">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total spent</span>
                <span className="font-bold text-[#13294b]">${customer.totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">First order</span>
                <span>{new Date(customer.firstOrder).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last order</span>
                <span>{new Date(customer.lastOrder).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Products ordered */}
          {Object.keys(productCounts).length > 0 && (
            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Products Ordered</h2>
              <div className="space-y-2 text-sm">
                {Object.entries(productCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([product, count]) => (
                    <div key={product} className="flex justify-between">
                      <span className="text-gray-600">{product}</span>
                      <span className="font-semibold">{count}×</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
