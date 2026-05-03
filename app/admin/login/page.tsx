"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      // Reset loading in case navigation redirects back (e.g. cookie not set over HTTP)
      setTimeout(() => setLoading(false), 3000);
    } else {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f6f4]">
      <div className="w-full max-w-sm px-4">
        <div className="mb-8 text-center">
          <div className="relative mx-auto h-14 w-14">
            <Image src="/images/home/elhilocologo.png" alt="El Hilo Co" fill className="object-contain" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-500">El Hilo Co — Internal Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[1.75rem] bg-white p-8 shadow-sm">
          <label className="block text-sm font-bold text-black">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            autoFocus
            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
          />

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[#13294b] py-3 text-sm font-bold text-white transition hover:bg-[#0f1f39] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
