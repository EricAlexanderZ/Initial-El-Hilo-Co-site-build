"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { AuthCard } from "@/components/auth/auth-card";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Supabase Auth has built-in rate limiting on password-reset requests.
    // The button is disabled while loading to prevent double-submissions.
    const supabase = createClient();

    // `window.location.origin` is used for redirectTo so this works
    // automatically in both development (localhost) and production without
    // any hard-coded URL.  Supabase appends the token and redirects the user
    // to /auth/update-password after they click the email link.
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + "/auth/update-password",
    });

    // SECURITY: Always show the success screen regardless of whether the
    // email exists.  Showing a different message for unknown emails would
    // allow user enumeration.
    setSuccess(true);
    setLoading(false);
  }

  return (
    <AuthCard subtitle="Reset your password">
      {success ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd84d]/30 text-2xl"
          >
            ✉
          </div>
          <h2 className="text-lg font-bold text-gray-900">Check your email!</h2>
          <p className="text-sm text-gray-500">
            If that email exists in our system, you&apos;ll receive a password
            reset link shortly.
          </p>
          <Link prefetch={false}
            href="/auth/login"
            className="mt-2 text-sm font-semibold text-[#13294b] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-gray-500">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>

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
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-label="Send password reset link"
              className="w-full rounded-full bg-[#13294b] py-3 text-sm font-semibold text-white transition hover:bg-[#0f1f39] hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link prefetch={false}
              href="/auth/login"
              className="font-semibold text-[#13294b] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
