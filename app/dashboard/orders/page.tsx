import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

type OrderStatus =
  | "new"
  | "proof_sent"
  | "proof_approved"
  | "in_production"
  | "shipped"
  | "complete"
  | "cancelled";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Pending",
  proof_sent: "Proof Sent",
  proof_approved: "Proof Approved",
  in_production: "In Production",
  shipped: "Shipped",
  complete: "Complete",
  cancelled: "Cancelled",
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  new: "bg-yellow-100 text-yellow-800",
  proof_sent: "bg-blue-100 text-blue-800",
  proof_approved: "bg-blue-100 text-blue-800",
  in_production: "bg-blue-100 text-blue-800",
  shipped: "bg-green-100 text-green-800",
  complete: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

type OrderItem = {
  id: string;
  product_type: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  subtotal: number;
  shipping_price: number;
  order_items: OrderItem[];
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, status, total, subtotal, shipping_price, order_items(id, product_type, quantity, price)"
    )
    .eq("customer_email", user.email!)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Orders fetch error:", error);
  }

  const orderList = (orders ?? []) as Order[];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          All of your El Hilo Co orders in one place.
        </p>
      </div>

      {orderList.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-12 text-center">
          <div className="mb-4 text-5xl">📦</div>
          <h2 className="text-lg font-bold text-gray-900">No orders yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Start your first order and it will appear here.
          </p>
          <Link
            href="/products/custom-hats"
            className="mt-6 inline-block rounded-full bg-[#13294b] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f1f39]"
          >
            Start New Order
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orderList.map((order) => {
            const status = (order.status as OrderStatus) ?? "new";
            const items = order.order_items ?? [];
            const productSummary = items
              .map((i) => `${i.quantity}x ${i.product_type}`)
              .join(", ");

            return (
              <details
                key={order.id}
                className="group rounded-2xl border border-black/10 bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-gray-900">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(order.created_at)}
                    </span>
                    {productSummary && (
                      <span className="mt-0.5 text-xs text-gray-500">
                        {productSummary}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                        STATUS_CLASSES[status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {STATUS_LABELS[status] ?? order.status}
                    </span>
                    <span className="mt-1 text-[10px] text-gray-400 group-open:hidden">
                      View Details ▸
                    </span>
                    <span className="mt-1 hidden text-[10px] text-gray-400 group-open:block">
                      Hide Details ▴
                    </span>
                  </div>
                </summary>

                {/* Expanded detail */}
                <div className="border-t border-black/10 px-5 py-4">
                  {items.length > 0 ? (
                    <div className="space-y-2">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Items
                      </p>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.quantity}x {item.product_type}
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No item details available.</p>
                  )}

                  <div className="mt-4 space-y-1.5 border-t border-black/10 pt-4 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span>{formatCurrency(order.shipping_price)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
