"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type Address = {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
};

const emptyForm = {
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
  is_default: false,
};

export default function AddressesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const { data } = await supabase
        .from("saved_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      setAddresses((data ?? []) as Address[]);
      setLoading(false);
    }
    load();
  }, []);

  async function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setFormError(null);
    setSaving(true);

    const supabase = createClient();

    // If setting as default, unset others first
    if (form.is_default) {
      await supabase
        .from("saved_addresses")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    const { error } = await supabase.from("saved_addresses").insert({
      user_id: userId,
      label: form.label || null,
      line1: form.line1,
      line2: form.line2 || null,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      is_default: form.is_default,
    });

    if (error) {
      setFormError(error.message);
      setSaving(false);
      return;
    }

    // Reload
    const { data } = await supabase
      .from("saved_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });

    setAddresses((data ?? []) as Address[]);
    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
  }

  async function deleteAddress(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from("saved_addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setDeletingId(null);
  }

  async function setDefault(id: string) {
    if (!userId) return;
    const supabase = createClient();

    await supabase
      .from("saved_addresses")
      .update({ is_default: false })
      .eq("user_id", userId);

    await supabase
      .from("saved_addresses")
      .update({ is_default: true })
      .eq("id", id);

    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
  }

  const inputCls =
    "w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10";

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#13294b] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Addresses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your saved shipping addresses.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setForm(emptyForm);
              setShowForm(true);
              setFormError(null);
            }}
            className="rounded-full bg-[#13294b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f1f39]"
          >
            + Add New
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-[#13294b]/20 bg-white p-6">
          <h2 className="mb-5 text-base font-bold text-gray-900">
            New Address
          </h2>

          {formError && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={saveAddress} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Label (optional)
              </label>
              <input
                type="text"
                value={form.label}
                onChange={(e) =>
                  setForm((f) => ({ ...f, label: e.target.value }))
                }
                className={inputCls}
                placeholder="e.g. Home, Office"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.line1}
                onChange={(e) =>
                  setForm((f) => ({ ...f, line1: e.target.value }))
                }
                className={inputCls}
                placeholder="123 Main St"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Address Line 2
              </label>
              <input
                type="text"
                value={form.line2}
                onChange={(e) =>
                  setForm((f) => ({ ...f, line2: e.target.value }))
                }
                className={inputCls}
                placeholder="Apt, suite, unit (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={form.state}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      state: e.target.value.toUpperCase(),
                    }))
                  }
                  className={inputCls}
                  placeholder="TX"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  ZIP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.zip}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, zip: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="78701"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_default: e.target.checked }))
                }
                className="h-4 w-4 rounded border-black/15 accent-[#13294b]"
              />
              <span className="text-sm text-gray-600">
                Set as default address
              </span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#13294b] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f1f39] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-black/10 bg-white p-12 text-center">
          <div className="mb-4 text-5xl">📍</div>
          <h2 className="text-lg font-bold text-gray-900">
            No saved addresses
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Add an address to speed up checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {addr.label && (
                      <span className="text-sm font-bold text-gray-900">
                        {addr.label}
                      </span>
                    )}
                    {addr.is_default && (
                      <span className="rounded-full bg-[#13294b] px-2.5 py-0.5 text-[10px] font-bold text-white">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{addr.line1}</p>
                  {addr.line2 && (
                    <p className="text-sm text-gray-700">{addr.line2}</p>
                  )}
                  <p className="text-sm text-gray-700">
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                  <p className="text-sm text-gray-500">{addr.country}</p>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  {!addr.is_default && (
                    <button
                      onClick={() => setDefault(addr.id)}
                      className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    disabled={deletingId === addr.id}
                    className="rounded-full border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {deletingId === addr.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
