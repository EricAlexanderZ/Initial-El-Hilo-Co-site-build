import Link from "next/link";
import Image from "next/image";
import { TopBanner, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f4] text-black">
      <TopBanner />
      <SiteHeader />

      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="relative mx-auto h-20 w-20">
          <Image src="/images/home/elhilocologo.png" alt="El Hilo Co" fill className="object-contain" />
        </div>

        <div className="mt-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight">Order Placed!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Thank you for your order. Check your email — we&apos;ll send a confirmation and reach out shortly with your design proof.
        </p>

        <div className="mt-10 rounded-[1.75rem] bg-white p-8 text-left shadow-sm">
          <h2 className="text-lg font-bold">What happens next?</h2>
          <div className="mt-5 space-y-4">
            {[
              { icon: "✉️", title: "Check your email",      text: "A confirmation has been sent to your inbox with your order details." },
              { icon: "🎨", title: "Receive your proof",    text: "Our team will create your design proof and email it for your approval." },
              { icon: "✅", title: "Approve and produce",   text: "Once you approve the proof, we move your order into production." },
              { icon: "📦", title: "Ships to your door",    text: "We pack and ship your finished embroidered items directly to you." },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff3cf] text-xl">
                  {step.icon}
                </div>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-[#13294b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f1f39]"
          >
            Back to home
          </Link>
          <Link
            href="/products/custom-hats"
            className="rounded-full border border-[#13294b] px-6 py-3 text-sm font-semibold text-[#13294b] transition hover:bg-[#eef2f7]"
          >
            Shop more
          </Link>
        </div>

        <p className="mt-10 text-sm text-gray-400">
          Questions? Email us at{" "}
          <a href="mailto:orders@elhiloco.com" className="font-semibold text-[#13294b] hover:underline">
            orders@elhiloco.com
          </a>
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
