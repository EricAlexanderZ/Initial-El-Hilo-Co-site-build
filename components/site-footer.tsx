import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#13294b]">
                EH
              </div>
              <div>
                <p className="text-xl font-extrabold">El Hilo Co</p>
                <p className="mt-2 text-sm text-white/70">
                  orders@elhiloco.com
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/60">Company</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link href="/about" className="block hover:text-[#ffd84d]">
                About
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/60">Support</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link href="/faq" className="block hover:text-[#ffd84d]">
                FAQ
              </Link>
              <Link href="/contact" className="block hover:text-[#ffd84d]">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/60">Legal</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link href="/privacy" className="block hover:text-[#ffd84d]">
                Privacy
              </Link>
              <Link href="/terms" className="block hover:text-[#ffd84d]">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
          © 2026 El Hilo Co. All rights reserved.
        </div>
      </div>
    </footer>
  );
}