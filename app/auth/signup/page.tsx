"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { AuthCard } from "@/components/auth/auth-card";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Strip HTML/script tags from a text field before saving.
 * This is a lightweight defence-in-depth measure; Supabase also stores
 * the value as plain text, so injection via the DB is already mitigated.
 */
function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // --- Client-side validation (UX only — Supabase enforces server-side) ---
    const cleanName = stripTags(fullName);
    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    // Supabase Auth has built-in rate limiting on sign-up attempts.
    // The button is disabled while loading to prevent double-submissions.
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: cleanName,
          marketing_opt_in: marketingOptIn,
        },
      },
    });

    if (signUpError) {
      // Return a generic message — never reveal whether the email is already
      // registered, as that would allow user enumeration.
      setError("Unable to create account. Please check your details and try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <AuthCard subtitle="Create your account">
      {success ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl"
          >
            ✓
          </div>
          <h2 className="text-lg font-bold text-gray-900">Check your email!</h2>
          <p className="text-sm text-gray-500">
            We sent a confirmation link to{" "}
            <span className="font-medium text-gray-700">{email}</span>. Click it
            to activate your account.
          </p>
          <Link
            href="/auth/login"
            className="mt-2 text-sm font-semibold text-[#13294b] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <>
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
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
                placeholder="Jane Smith"
              />
            </div>

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

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password
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

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-black/15 accent-[#13294b]"
              />
              <span className="text-sm text-gray-600">
                I&apos;d like to receive updates and promotions from El Hilo Co
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              aria-label="Create your account"
              className="w-full rounded-full bg-[#13294b] py-3 text-sm font-semibold text-white transition hover:bg-[#0f1f39] hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
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
