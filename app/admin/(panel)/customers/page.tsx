import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Order } from "@/lib/types/orders";

type CustomerRow = {
  email: string;
  name: string;
  phone: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
};

async function getCustomers(): Promise<CustomerRow[]> {
  const { data } = await supabaseAdmin
    .from("orders")
    .select("customer_name, customer_email, customer_phone, total, created_at")
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) return [];

  const map = new Map<string, CustomerRow>();

  for (const o of data as Pick<Order, "customer_name" | "customer_email" | "customer_phone" | "total" | "created_at">[]) {
    const existing = map.get(o.customer_email);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent  += o.total;
    } else {
      map.set(o.customer_email, {
        email:       o.customer_email,
        name:        o.customer_name,
        phone:       o.customer_phone,
        totalOrders: 1,
        totalSpent:  o.total,
        lastOrderAt: o.created_at,
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
  );
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">
          {customers.length} unique customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-[1.5rem] bg-white py-20 text-center text-sm text-gray-400 shadow-sm">
          No customers yet — they&apos;ll appear here once orders come in.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {customers.map((c) => (
              <div key={c.email} className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold">{c.name}</p>
                    <p className="truncate text-xs text-gray-400">{c.email}</p>
                    {c.phone && <p className="text-xs text-gray-400">{c.phone}</p>}
                  </div>
                  <p className="shrink-0 font-bold text-[#13294b]">${c.totalSpent.toFixed(2)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>{c.totalOrders} order{c.totalOrders !== 1 ? "s" : ""}</span>
                    <span>·</span>
                    <span>{new Date(c.lastOrderAt).toLocaleDateString()}</span>
                  </div>
                  <Link
                    href={`/admin/customers/${encodeURIComponent(c.email)}`}
                    className="rounded-full bg-[#13294b] px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-[1.5rem] bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-left">
                    <th className="px-5 py-4 font-semibold text-gray-400">Customer</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Phone</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Orders</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Total Spent</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Last Order</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={c.email} className={`border-b border-black/5 last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                      <td className="px-5 py-4">
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{c.phone ?? "—"}</td>
                      <td className="px-5 py-4 font-semibold">{c.totalOrders}</td>
                      <td className="px-5 py-4 font-semibold text-[#13294b]">${c.totalSpent.toFixed(2)}</td>
                      <td className="px-5 py-4 text-gray-400">{new Date(c.lastOrderAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/customers/${encodeURIComponent(c.email)}`}
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
          </div>
        </>
      )}
    </div>
  );
}
