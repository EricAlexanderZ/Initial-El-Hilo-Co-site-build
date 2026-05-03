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

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    "there";

  // Fetch orders by email
  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, status, total, notes")
    .eq("customer_email", user.email!)
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch all orders for stats
  const { data: allOrders } = await supabase
    .from("orders")
    .select("total")
    .eq("customer_email", user.email!);

  const totalOrders = allOrders?.length ?? 0;
  const totalSpent = allOrders?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0;

  const recentOrders = orders ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s an overview of your account.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Total Orders
          </p>
          <p className="mt-2 text-3xl font-extrabold text-[#13294b]">
            {totalOrders}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Total Spent
          </p>
          <p className="mt-2 text-3xl font-extrabold text-[#13294b]">
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm font-semibold text-[#13294b] hover:underline"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
            <p className="text-gray-500">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const status = (order.status as OrderStatus) ?? "new";
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {STATUS_LABELS[status] ?? order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/products/custom-hats"
            className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:border-[#13294b]/30 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffd84d]/30 text-xl">
              🧢
            </div>
            <p className="font-bold text-gray-900 group-hover:text-[#13294b]">
              Start New Order
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Browse custom embroidery products
            </p>
          </Link>

          <Link
            href="/dashboard/orders"
            className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:border-[#13294b]/30 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#13294b]/10 text-xl">
              📦
            </div>
            <p className="font-bold text-gray-900 group-hover:text-[#13294b]">
              View All Orders
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Track and manage your orders
            </p>
          </Link>

          <Link
            href="/dashboard/profile"
            className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:border-[#13294b]/30 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#13294b]/10 text-xl">
              👤
            </div>
            <p className="font-bold text-gray-900 group-hover:text-[#13294b]">
              Update Profile
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Manage your account details
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
