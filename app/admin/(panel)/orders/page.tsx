import { supabaseAdmin } from "@/lib/supabase-admin";
import OrdersTable from "@/components/admin/orders-table";
import type { Order } from "@/lib/types/orders";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const { data } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(product_type, quantity)")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          {orders.length} total order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
