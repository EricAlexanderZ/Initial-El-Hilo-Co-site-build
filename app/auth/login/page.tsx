"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AuthCard } from "@/components/auth/auth-card";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Validate email format client-side (server always re-validates). */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Sanitise the post-login redirect target so we never forward the user to an
 * external URL.  Rules:
 *   - Must start with "/"
 *   - Must NOT start with "//" (protocol-relative URL → off-site redirect)
 *   - Must NOT contain ":" early in the path (e.g. "javascript:")
 */
function sanitizeRedirect(raw: string | null): string {
  if (!raw) return "/dashboard";
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return "/dashboard";
  if (trimmed.startsWith("//")) return "/dashboard";
  if (/^\/[^/]*:/.test(trimmed)) return "/dashboard"; // e.g. /javascript:…
  return trimmed;
}

// ---------------------------------------------------------------------------
// Form component (needs Suspense because it calls useSearchParams)
// ---------------------------------------------------------------------------

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Validate the redirect param on the client to prevent open-redirect attacks.
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "callback") {
      setError("Authentication failed. Please try again.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // --- Client-side validation (UX only — Supabase enforces server-side) ---
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    // Supabase Auth has built-in rate limiting on sign-in attempts.
    // The button is disabled while loading to prevent double-submissions.
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      // SECURITY: Never reveal whether the email exists or whether the
      // password was wrong.  Always return a generic message.
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
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
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-[#13294b] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-label="Sign in to your account"
          className="w-full rounded-full bg-[#13294b] py-3 text-sm font-semibold text-white transition hover:bg-[#0f1f39] hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-[#13294b] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LoginPage() {
  return (
    <AuthCard subtitle="Sign in to your account">
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-xl bg-gray-50" />
        }
      >
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
