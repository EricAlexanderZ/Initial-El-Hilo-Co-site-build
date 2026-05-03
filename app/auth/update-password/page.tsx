"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AuthCard } from "@/components/auth/auth-card";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Client-side validation — Supabase enforces the minimum server-side too.
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Supabase Auth has built-in rate limiting on password updates.
    // The button is disabled while loading to prevent double-submissions.
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Unable to update password. Please request a new reset link.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthCard subtitle="Set a new password">
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label
            htmlFor="confirm"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-label="Update your password"
          className="w-full rounded-full bg-[#13294b] py-3 text-sm font-semibold text-white transition hover:bg-[#0f1f39] hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </AuthCard>
  );
}
