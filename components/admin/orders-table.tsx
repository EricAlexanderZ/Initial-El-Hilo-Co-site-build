"use client";

import { useState } from "react";
import Link from "next/link";
import type { Order, OrderStatus } from "@/lib/types/orders";
import OrderStatusBadge from "./order-status-badge";

type Filter = OrderStatus | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",            label: "All"           },
  { value: "new",            label: "New"           },
  { value: "proof_sent",     label: "Proof Sent"    },
  { value: "proof_approved", label: "Approved"      },
  { value: "in_production",  label: "In Production" },
  { value: "shipped",        label: "Shipped"       },
  { value: "complete",       label: "Complete"      },
  { value: "cancelled",      label: "Cancelled"     },
];

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<Filter>("all");
  const [source, setSource]   = useState("all");

  const sources = Array.from(
    new Set(orders.map((o) => o.tracking_source).filter((s): s is string => !!s))
  ).sort();

  const visible = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q);
    const matchesStatus = filter === "all" || o.status === filter;
    const matchesSource = source === "all" || o.tracking_source === source;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10 sm:w-64"
        />

        {/* Mobile: dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
          className="sm:hidden w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#13294b]"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Desktop: chips */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.value
                  ? "bg-[#13294b] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Source (ad attribution) filter — only shown once tagged orders exist */}
        {sources.length > 0 && (
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#13294b] sm:w-auto"
            title="Filter by ad / order source"
          >
            <option value="all">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>📣 {s}</option>
            ))}
          </select>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-[1.5rem] bg-white py-20 text-center text-sm text-gray-400 shadow-sm">
          {orders.length === 0
            ? "No orders yet — they'll appear here once customers check out."
            : "No orders match your search."}
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {visible.map((order) => {
              const firstItem = order.order_items?.[0];
              const extraItems = (order.order_items?.length ?? 1) - 1;
              return (
                <div key={order.id} className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                      {order.tracking_source && (
                        <span className="mt-1 inline-block rounded-full bg-[#fff8e7] px-2 py-0.5 text-[10px] font-bold text-[#d39a14]">
                          📣 {order.tracking_source}
                        </span>
                      )}
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      {firstItem?.product_type ?? "—"}
                      {extraItems > 0 && <span className="ml-1 text-xs text-gray-400">+{extraItems}</span>}
                      {firstItem?.quantity && <span className="ml-1 text-xs text-gray-400">· qty {firstItem.quantity}</span>}
                    </div>
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                    <Link prefetch={false}
                      href={`/admin/orders/${order.id}`}
                      className="rounded-full bg-[#13294b] px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-[1.5rem] bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-left">
                    <th className="px-5 py-4 font-semibold text-gray-400">Customer</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Product</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Qty</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Total</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Status</th>
                    <th className="px-5 py-4 font-semibold text-gray-400">Date</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((order, i) => {
                    const firstItem = order.order_items?.[0];
                    const extraItems = (order.order_items?.length ?? 1) - 1;
                    return (
                      <tr key={order.id} className={`border-b border-black/5 last:border-0 ${i % 2 === 1 ? "bg-[#fafafa]" : ""}`}>
                        <td className="px-5 py-4">
                          <p className="font-semibold">{order.customer_name}</p>
                          <p className="text-xs text-gray-400">{order.customer_email}</p>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {firstItem?.product_type ?? "—"}
                          {extraItems > 0 && <span className="ml-1 text-xs text-gray-400">+{extraItems}</span>}
                          {order.tracking_source && (
                            <span className="ml-2 inline-block rounded-full bg-[#fff8e7] px-2 py-0.5 text-[10px] font-bold text-[#d39a14]">
                              📣 {order.tracking_source}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-600">{firstItem?.quantity ?? "—"}</td>
                        <td className="px-5 py-4 font-semibold">${order.total.toFixed(2)}</td>
                        <td className="px-5 py-4"><OrderStatusBadge status={order.status} /></td>
                        <td className="px-5 py-4 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <Link prefetch={false} href={`/admin/orders/${order.id}`} className="rounded-full bg-[#13294b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0f1f39]">
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <p className="text-right text-xs text-gray-400">
        Showing {visible.length} of {orders.length} orders
      </p>
    </div>
  );
}
