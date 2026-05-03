"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProofUpload({ orderId }: { orderId: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError]   = useState("");
  const router = useRouter();

  async function handleFile(file: File) {
    setStatus("uploading");
    setError("");

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`/api/admin/orders/${orderId}/proof`, {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      setStatus("done");
      router.refresh();
    } else {
      setStatus("error");
      setError("Upload failed. Please try again.");
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm font-bold">Upload Proof</p>
      <p className="mb-4 text-xs text-gray-500">
        Upload a proof image or PDF. Status will automatically change to &quot;Proof Sent&quot;.
      </p>

      {status === "uploading" && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#13294b] border-t-transparent" />
          Uploading…
        </div>
      )}

      {status === "done" && (
        <p className="text-sm font-semibold text-green-600">✓ Proof uploaded — status updated to Proof Sent</p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {status !== "uploading" && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-2xl border border-dashed border-[#13294b]/30 bg-[#f6f8fc] py-4 text-sm font-semibold text-[#13294b] transition hover:bg-[#eef2f7]"
        >
          {status === "done" ? "Upload Another Proof" : "+ Select Proof File"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
