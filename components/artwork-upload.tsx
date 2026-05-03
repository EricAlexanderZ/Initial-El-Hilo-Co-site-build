"use client";

import { useRef, useState } from "react";

type Props = {
  title: string;
  subtitle: string;
  buttonLabel?: string;
  helpText?: string;
  onUploaded?: (url: string) => void;
};

export default function ArtworkUpload({
  title,
  subtitle,
  buttonLabel = "Upload artwork",
  helpText = "PNG, JPG, PDF, AI — up to 10 MB",
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus]   = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [error, setError]     = useState("");

  async function handleFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10 MB.");
      return;
    }
    setFileName(file.name);
    setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`);
    setStatus("uploading");
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setStatus("done");
      onUploaded?.(url);
    } catch {
      setStatus("error");
      setError("Upload failed. Please try again.");
    }
  }

  function handleRemove() {
    setStatus("idle");
    setFileName("");
    setFileSize("");
    setError("");
    onUploaded?.("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
      <div className="text-center">
        <p className="text-xl font-bold">{title}</p>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      </div>

      {status === "idle" && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-[#e5b43d] px-8 py-3 text-sm font-bold text-black transition hover:brightness-95"
          >
            {buttonLabel}
          </button>
          <p className="mt-4 text-xs text-gray-400">{helpText}</p>
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf,.ai,.eps,.svg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {status === "uploading" && (
        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#e5b43d] border-t-transparent" />
          <p className="mt-3">Uploading {fileName}…</p>
        </div>
      )}

      {(status === "done" || status === "error") && (
        <div className="mt-6 mx-auto flex max-w-md items-center justify-between gap-4 rounded-2xl bg-[#f8f8f8] px-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {status === "done" && <span className="text-green-500">✓</span>}
              <p className="truncate text-sm font-semibold">{fileName}</p>
            </div>
            <p className="text-xs text-gray-500">{fileSize}</p>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 text-sm font-semibold text-red-500"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
