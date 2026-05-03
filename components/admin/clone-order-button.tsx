"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CloneOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClone() {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}/clone`, { method: "POST" });
    if (res.ok) {
      const { orderId: newId } = await res.json();
      router.push(`/admin/orders/${newId}`);
    } else {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClone}
      disabled={loading}
      className="rounded-full border border-[#13294b] px-3 py-1.5 text-xs font-semibold text-[#13294b] transition hover:bg-[#eef2f7] disabled:opacity-50"
    >
      {loading ? "Creating…" : "Reorder"}
    </button>
  );
}
