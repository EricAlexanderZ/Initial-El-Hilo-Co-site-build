"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Profile = {
  id: string;
  full_name: string | null;
  business_name: string | null;
  phone: string | null;
  marketing_opt_in: boolean;
};

type Message = { type: "success" | "error"; text: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip HTML/script tags from free-text fields before saving. */
function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

/**
 * Validate phone: allow digits, spaces, hyphens, parentheses, and leading +.
 * Empty string is valid (field is optional).
 */
function isValidPhone(value: string): boolean {
  if (!value) return true;
  return /^[+\d\s\-()\d]+$/.test(value);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<Message | null>(null);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      setUser({ id: authUser.id, email: authUser.email ?? "" });

      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, business_name, phone, marketing_opt_in")
        .eq("id", authUser.id)
        .single();

      if (data) {
        setProfile(data as Profile);
        setFullName(data.full_name ?? "");
        setBusinessName(data.business_name ?? "");
        setPhone(data.phone ?? "");
        setMarketingOptIn(data.marketing_opt_in ?? false);
      } else {
        // Pre-fill from auth metadata when no profile row exists yet.
        setFullName(
          (authUser.user_metadata?.full_name as string | undefined) ?? ""
        );
        setMarketingOptIn(
          (authUser.user_metadata?.marketing_opt_in as boolean | undefined) ??
            false
        );
      }

      setLoading(false);
    }

    load();
  }, []);

  async function saveProfile(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    setProfileMessage(null);

    // --- Client-side validation ---
    const cleanName = stripTags(fullName);
    const cleanBusiness = stripTags(businessName);
    const trimmedPhone = phone.trim();

    if (!isValidPhone(trimmedPhone)) {
      setProfileMessage({
        type: "error",
        text: "Phone number may only contain digits, spaces, hyphens, parentheses, and a leading +.",
      });
      return;
    }

    setProfileSaving(true);

    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: cleanName || null,
      business_name: cleanBusiness || null,
      phone: trimmedPhone || null,
      marketing_opt_in: marketingOptIn,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setProfileMessage({ type: "error", text: "Failed to save profile. Please try again." });
    } else {
      setProfileMessage({ type: "success", text: "Profile saved successfully." });
      // Keep local state in sync with what was actually saved.
      setFullName(cleanName);
      setBusinessName(cleanBusiness);
      setPhone(trimmedPhone);
    }

    setProfileSaving(false);
  }

  async function changePassword(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setPasswordSaving(true);

    // Supabase Auth has built-in rate limiting on password updates.
    // The button is disabled while loading to prevent double-submissions.
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMessage({ type: "error", text: "Failed to update password. Please try again." });
    } else {
      setPasswordMessage({ type: "success", text: "Password updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
    }

    setPasswordSaving(false);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#13294b] border-t-transparent" />
      </div>
    );
  }

  // Kept outside JSX to avoid repetition
  void profile; // profile state is used for pre-fill only; suppress unused warning

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information.
        </p>
      </div>

      {/* Profile form */}
      <div className="mb-6 rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-base font-bold text-gray-900">
          Account Details
        </h2>

        {profileMessage && (
          <div
            role="alert"
            className={`mb-5 rounded-xl px-4 py-3 text-sm ${
              profileMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {profileMessage.text}
          </div>
        )}

        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
              />
            </div>

            <div>
              <label
                htmlFor="businessName"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Business Name
              </label>
              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
              placeholder="Optional — digits, spaces, hyphens, +, ( ) allowed"
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
              value={user?.email ?? ""}
              readOnly
              className="w-full cursor-not-allowed rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              Email cannot be changed here.
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="h-4 w-4 rounded border-black/15 accent-[#13294b]"
            />
            <span className="text-sm text-gray-600">
              Receive updates and promotions from El Hilo Co
            </span>
          </label>

          <button
            type="submit"
            disabled={profileSaving}
            aria-label="Save profile changes"
            className="rounded-full bg-[#13294b] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f1f39] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {profileSaving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password change */}
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-base font-bold text-gray-900">
          Change Password
        </h2>

        {passwordMessage && (
          <div
            role="alert"
            className={`mb-5 rounded-xl px-4 py-3 text-sm ${
              passwordMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {passwordMessage.text}
          </div>
        )}

        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            aria-label="Update your password"
            className="rounded-full bg-[#13294b] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f1f39] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {passwordSaving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
