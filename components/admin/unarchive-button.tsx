"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UnarchiveButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUnarchive() {
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}/archive`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleUnarchive}
      disabled={loading}
      className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
    >
      {loading ? "…" : "Unarchive"}
    </button>
  );
}
