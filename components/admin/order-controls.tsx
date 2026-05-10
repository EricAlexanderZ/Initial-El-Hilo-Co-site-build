"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/lib/types/orders";
import OrderStatusBadge from "./order-status-badge";

const STATUSES: OrderStatus[] = [
  "new",
  "proof_sent",
  "proof_approved",
  "in_production",
  "shipped",
  "complete",
  "cancelled",
];

export default function OrderControls({
  orderId,
  currentStatus,
  currentNotes,
  isArchived = false,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  currentNotes: string | null;
  isArchived?: boolean;
}) {
  const [status, setStatus]     = useState<OrderStatus>(currentStatus);
  const [notes, setNotes]       = useState(currentNotes ?? "");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [archiving, setArchiving] = useState(false);
  const router = useRouter();

  async function handleArchive() {
    setArchiving(true);
    const method = isArchived ? "DELETE" : "POST";
    await fetch(`/api/admin/orders/${orderId}/archive`, { method });
    router.refresh();
    setArchiving(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-bold">Order Status</p>
        <div className="grid grid-cols-1 gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                status === s
                  ? "border-[#e3b33d] bg-[#fff8e7]"
                  : "border-black/10 bg-white hover:border-[#d9d9d9]"
              }`}
            >
              <OrderStatusBadge status={s} />
              {status === s && <span className="ml-auto text-xs text-[#d39a14]">✓ Current</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold">Internal Notes</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add notes about this order…"
          className="w-full resize-none rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={`w-full rounded-2xl py-3 text-sm font-bold text-white transition ${
          saved
            ? "bg-green-600"
            : "bg-[#13294b] hover:bg-[#0f1f39] disabled:opacity-60"
        }`}
      >
        {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
      </button>

      <button
        type="button"
        onClick={handleArchive}
        disabled={archiving}
        className="w-full rounded-2xl border border-black/10 py-3 text-sm font-bold text-gray-500 transition hover:bg-gray-50 disabled:opacity-60"
      >
        {archiving ? "…" : isArchived ? "Unarchive Order" : "Archive Order"}
      </button>
    </div>
  );
}
