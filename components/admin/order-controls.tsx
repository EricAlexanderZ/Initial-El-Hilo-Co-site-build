"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/lib/types/orders";
import OrderStatusBadge from "./order-status-badge";

/**
 * Statuses that email the customer on save. Mirrors STATUS_EMAILS in
 * lib/email.ts, which is the authority; this copy exists only so the UI can
 * warn before the request is sent rather than after.
 */
const NOTIFIES = new Set<OrderStatus>([
  "proof_sent",
  "in_production",
  "shipped",
  "complete",
  "cancelled",
]);

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
  customerEmail,
  isArchived = false,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  currentNotes: string | null;
  customerEmail: string;
  isArchived?: boolean;
}) {
  const [status, setStatus]     = useState<OrderStatus>(currentStatus);
  const [notes, setNotes]       = useState(currentNotes ?? "");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [result, setResult]     = useState<{ ok: boolean; message: string } | null>(null);
  const router = useRouter();

  const statusChanging = status !== currentStatus;
  const willNotify     = statusChanging && NOTIFIES.has(status);

  async function handleArchive() {
    setArchiving(true);
    const method = isArchived ? "DELETE" : "POST";
    const res = await fetch(`/api/admin/orders/${orderId}/archive`, { method });
    // The admin API answers 401 rather than redirecting, because a fetch cannot
    // act on an HTML login page.
    if (res.status === 401) { router.push("/admin/login"); return; }
    router.refresh();
    setArchiving(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });

      if (res.status === 401) { router.push("/admin/login"); return; }

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setResult({ ok: false, message: body.error ?? "Could not save. Please try again." });
        return;
      }

      // Report what actually happened. The server tells us whether mail was
      // handed to SMTP, so an unconfigured deployment cannot look like a send.
      setResult({
        ok: true,
        message: body.notified
          ? `Saved. ${body.notifiedEmail ?? customerEmail} was emailed.`
          : "Saved.",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } catch {
      setResult({ ok: false, message: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
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

      {/* Sending mail on the owner's behalf should never be a surprise. */}
      {willNotify && (
        <p className="rounded-2xl bg-[#f6f8fc] px-4 py-3 text-xs leading-relaxed text-[#13294b]">
          Saving will email <strong className="font-bold">{customerEmail}</strong> to say the order
          is now <strong className="font-bold">{status.replace(/_/g, " ")}</strong>.
        </p>
      )}
      {statusChanging && !willNotify && (
        <p className="text-xs text-gray-400">No customer email is sent for this status.</p>
      )}

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

      {result && (
        <p
          role="status"
          className={`text-center text-xs font-semibold ${result.ok ? "text-green-600" : "text-red-500"}`}
        >
          {result.message}
        </p>
      )}

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
