"use client";

import { useState } from "react";
import { TopBanner, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <main className="min-h-screen bg-[#f6f6f4] text-black">
      <TopBanner />
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Get in Touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
            Have a question about your order, a custom request, or just want to say hello?
            We&apos;re here and happy to help.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">

          {/* Form */}
          <div className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
                <h2 className="mt-5 text-2xl font-bold">Message Sent!</h2>
                <p className="mt-3 max-w-sm text-sm text-gray-500">
                  Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
                </p>
                <button
                  type="button"
                  onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setStatus("idle"); }}
                  className="mt-6 rounded-full border border-black/10 px-6 py-2 text-sm font-semibold transition hover:bg-gray-50"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full rounded-2xl border border-black/10 bg-[#f6f6f4] px-4 py-3 text-sm outline-none focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-2xl border border-black/10 bg-[#f6f6f4] px-4 py-3 text-sm outline-none focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    placeholder="Order inquiry, custom request, etc."
                    className="w-full rounded-2xl border border-black/10 bg-[#f6f6f4] px-4 py-3 text-sm outline-none focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Message <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us how we can help you..."
                    className="w-full resize-none rounded-2xl border border-black/10 bg-[#f6f6f4] px-4 py-3 text-sm outline-none focus:border-[#13294b] focus:ring-2 focus:ring-[#13294b]/10"
                  />
                </div>

                {status === "error" && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    Something went wrong. Please email us directly at orders@elhiloco.com.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-2xl bg-[#13294b] py-3 text-sm font-bold text-white transition hover:bg-[#0f1f39] disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div className="space-y-5">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Contact Info</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#13294b]">✉</span>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:orders@elhiloco.com" className="text-gray-600 hover:text-[#13294b]">
                      orders@elhiloco.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#13294b]">📍</span>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-600">Alton, TX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#13294b]">🕐</span>
                  <div>
                    <p className="font-semibold">Response Time</p>
                    <p className="text-gray-600">Within 1–2 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Follow Along</h2>
              <div className="mt-4 space-y-3">
                <a
                  href="https://www.instagram.com/elhiloco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold transition hover:bg-[#f6f6f4]"
                >
                  Instagram — @elhiloco
                </a>
                <a
                  href="https://www.tiktok.com/@el.hilo.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold transition hover:bg-[#f6f6f4]"
                >
                  TikTok — @el.hilo.co
                </a>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[#ffd84d] p-6">
              <p className="text-sm font-bold">Looking for quick answers?</p>
              <p className="mt-1 text-sm text-black/70">Check our FAQ page for answers to common questions about ordering, artwork, and shipping.</p>
              <a href="/faq" className="mt-4 inline-block rounded-full bg-[#13294b] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0f1f39]">
                View FAQ
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
