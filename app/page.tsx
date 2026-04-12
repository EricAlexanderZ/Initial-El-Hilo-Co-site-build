import Link from "next/link";

const productLinks = [
  {
    name: "Custom Hats",
    href: "/products/custom-hats",
    icon: "🧢",
    bg: "bg-[#eef2f7]",
  },
  {
    name: "Custom Polos",
    href: "/products/custom-polos",
    icon: "👕",
    bg: "bg-[#f3f6fb]",
  },
  {
    name: "Custom Hoodies",
    href: "/products/custom-hoodies",
    icon: "🧥",
    bg: "bg-[#f5f5f5]",
  },
  {
    name: "Custom Sweaters",
    href: "/products/custom-sweaters",
    icon: "🧶",
    bg: "bg-[#f8f4ee]",
  },
];

const designLinks = [
  {
    name: "Logo Design",
    href: "/designs/logo-design",
    icon: "✍️",
    bg: "bg-[#eef2f7]",
  },
  {
    name: "Artwork Cleanup",
    href: "/designs/artwork-cleanup",
    icon: "🪄",
    bg: "bg-[#f3f6fb]",
  },
  {
    name: "Vector Conversion",
    href: "/designs/vector-conversion",
    icon: "📐",
    bg: "bg-[#f5f5f5]",
  },
  {
    name: "Digitizing",
    href: "/designs/digitizing",
    icon: "🪡",
    bg: "bg-[#f8f4ee]",
  },
];

const categories = [
  {
    name: "Custom Hats",
    href: "/products/custom-hats",
    icon: "🧢",
  },
  {
    name: "Custom Polos",
    href: "/products/custom-polos",
    icon: "👕",
  },
  {
    name: "Custom Hoodies",
    href: "/products/custom-hoodies",
    icon: "🧥",
  },
  {
    name: "Custom Sweaters",
    href: "/products/custom-sweaters",
    icon: "🧶",
  },
  {
    name: "Embroidery Digitizing",
    href: "/collections",
    icon: "🪡",
  },
  {
    name: "Logo Setup",
    href: "/collections",
    icon: "✨",
  },
];

const bestSellers = [
  {
    tag: "BEST SELLER",
    title: "Regular Stitched Hats",
    subtitle: "Clean front embroidery for everyday branded caps.",
    icon: "🧢",
    href: "/products/custom-hats",
  },
  {
    tag: "PREMIUM",
    title: "3D Puff Hats",
    subtitle: "Bold raised embroidery for a standout premium finish.",
    icon: "🎩",
    href: "/products/custom-hats",
  },
  {
    tag: "APPAREL",
    title: "Left Chest Logo Polos",
    subtitle: "Professional polos stitched for teams and businesses.",
    icon: "👕",
    href: "/products/custom-polos",
  },
  {
    tag: "EMBROIDERED",
    title: "Stitched Hoodies",
    subtitle: "Heavyweight hoodies with a clean custom embroidered look.",
    icon: "🧥",
    href: "/products/custom-hoodies",
  },
];

const logos = [
  "Summit Supply",
  "Blue River Co.",
  "Prime Field",
  "Oak & Iron",
  "Northline",
  "Crown Build",
  "Vertex Crew",
  "Atlas Wear",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f6f4] text-black">
      <TopBanner />
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto grid min-h-[560px] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight text-white md:text-7xl">
              Order custom
              <br />
              embroidered hats
              <br />
              and apparel.
            </h1>

            <p className="mt-8 max-w-lg text-lg font-medium text-white/90">
              Fast ordering, clean proofs, premium stitching, and a practical
              process built for brands, teams, and businesses.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products/custom-hats"
                className="rounded-full bg-[#13294b] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:bg-[#0f1f39]"
              >
                Shop Hats
              </Link>

              <Link
                href="/collections"
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:bg-white/20"
              >
                Shop all categories
              </Link>
            </div>

            <div className="mt-10 flex gap-10 text-white">
              <div>
                <p className="text-3xl font-extrabold">500+</p>
                <p className="text-sm text-white/80">Orders completed</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">5/5</p>
                <p className="text-sm text-white/80">Customer experience</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex h-[320px] w-[320px] items-center justify-center rounded-[1.5rem] bg-white/90 p-8 shadow-xl md:h-[400px] md:w-[400px]">
                <div className="text-center">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-black text-4xl font-extrabold text-[#13294b] md:h-40 md:w-40 md:text-5xl">
                    EH
                  </div>
                  <p className="mt-6 text-4xl font-extrabold tracking-[0.3em] text-black">
                    EL HILO
                  </p>
                  <p className="mt-3 text-lg font-medium text-[#13294b]">
                    Custom Embroidery Co.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-center text-4xl font-extrabold tracking-tight">
          Shop by Category
        </h2>

        <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex flex-col items-center justify-center rounded-2xl p-4 text-center transition duration-300 hover:scale-110"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#eef2f7] text-5xl shadow-sm transition duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  {category.icon}
                </div>
                <span className="mt-4 text-sm font-semibold transition duration-300 group-hover:text-[#13294b]">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-center text-4xl font-extrabold tracking-tight">
          Best Selling Products
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {bestSellers.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="inline-flex rounded-full border border-[#d9dce3] bg-[#f8f9fb] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#5b6473]">
                {item.tag}
              </div>

              <div className="mt-6 flex min-h-[240px] flex-col items-center justify-center rounded-[1.5rem] bg-[#f4f5f7] p-8 text-center">
                <div className="text-7xl transition duration-300 group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="mt-6 text-2xl font-extrabold">{item.title}</h3>
                <p className="mt-3 max-w-sm text-sm text-gray-600">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 bg-[#ffd84d] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-extrabold tracking-tight text-black md:text-6xl">
            Upload. Approve. Receive.
          </h2>

          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-lg md:p-12">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#f4f5f7] text-5xl">
                  📤
                </div>
                <div className="mx-auto mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#e5b43d] text-sm font-extrabold text-black">
                  1
                </div>
                <h3 className="mt-6 text-2xl font-bold">Upload your artwork</h3>
                <p className="mt-3 text-sm text-gray-600">
                  Send us your logo, design, or concept and we will prepare it
                  for embroidery.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#f4f5f7] text-5xl">
                  🖥️
                </div>
                <div className="mx-auto mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#e5b43d] text-sm font-extrabold text-black">
                  2
                </div>
                <h3 className="mt-6 text-2xl font-bold">Review and Approve</h3>
                <p className="mt-3 text-sm text-gray-600">
                  We send a proof, make any needed adjustments, and get approval
                  before production begins.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#f4f5f7] text-5xl">
                  📦
                </div>
                <div className="mx-auto mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#e5b43d] text-sm font-extrabold text-black">
                  3
                </div>
                <h3 className="mt-6 text-2xl font-bold">Receive your Order</h3>
                <p className="mt-3 text-sm text-gray-600">
                  We stitch, pack, and ship your order with a clean turnaround
                  and premium finish.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f6f4] py-16">
        <div className="mx-auto max-w-7xl overflow-hidden px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.45em] text-[#5f6675]">
            Trusted by brands big and small
          </p>

          <div className="mt-10 overflow-hidden">
            <div className="brand-track flex min-w-max gap-6">
              {[...logos, ...logos].map((logo, index) => (
                <div
                  key={`${logo}-${index}`}
                  className="flex h-24 min-w-[220px] items-center justify-center rounded-2xl border border-black/10 bg-white px-6 shadow-sm"
                >
                  <span className="text-xl font-extrabold tracking-wide text-[#13294b]">
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-[2rem] border border-[#ebcf8d] bg-white p-10 text-center shadow-sm">
            <h3 className="text-4xl font-extrabold">Have any questions for us?</h3>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-[#13294b] px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#0f1f39]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function TopBanner() {
  return (
    <div className="bg-[#ffd84d] px-4 py-2 text-center text-sm font-semibold text-black">
      Premium custom embroidery with fast turnaround.
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-extrabold text-[#13294b]">
            EH
          </div>
          <span className="text-lg font-extrabold tracking-wide">EL HILO CO</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <div className="group relative">
  <button className="flex items-center gap-1 text-sm font-medium hover:text-[#13294b]">
    Products
    <span>▾</span>
  </button>

  <div className="invisible absolute left-0 top-full mt-3 w-[320px] rounded-[1.75rem] border border-black/10 bg-white p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
    <div className="space-y-2">
      {productLinks.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="group/item flex items-center gap-4 rounded-2xl p-3 transition duration-200 hover:bg-[#f7f9fc]"
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} text-3xl shadow-sm transition duration-200 group-hover/item:scale-105`}
          >
            {item.icon}
          </div>

          <div>
            <p className="text-base font-bold text-black transition group-hover/item:text-[#13294b]">
              {item.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</div>

         <div className="group relative">
  <button className="flex items-center gap-1 text-sm font-medium hover:text-[#13294b]">
    Designs
    <span>▾</span>
  </button>

  <div className="invisible absolute left-0 top-full mt-3 w-[320px] rounded-[1.75rem] border border-black/10 bg-white p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
    <div className="space-y-2">
      {designLinks.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="group/item flex items-center gap-4 rounded-2xl p-3 transition duration-200 hover:bg-[#f7f9fc]"
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} text-3xl shadow-sm transition duration-200 group-hover/item:scale-105`}
          >
            {item.icon}
          </div>

          <div>
            <p className="text-base font-bold text-black transition group-hover/item:text-[#13294b]">
              {item.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</div>
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/cart" className="text-sm font-medium hover:text-[#13294b]">
            Cart
          </Link>
          <Link href="/login" className="text-sm font-medium hover:text-[#13294b]">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#13294b] px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:bg-[#0f1f39]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#13294b]">
                EH
              </div>
              <div>
                <p className="text-xl font-extrabold">El Hilo Co</p>
                <p className="mt-2 text-sm text-white/70">orders@elhiloco.com</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/60">Company</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link href="/about" className="block hover:text-[#ffd84d]">
                About
              </Link>
              <Link href="/contact" className="block hover:text-[#ffd84d]">
                Contact
              </Link>
              <Link href="/faq" className="block hover:text-[#ffd84d]">
                FAQ
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/60">Support</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link href="/returns" className="block hover:text-[#ffd84d]">
                Returns
              </Link>
              <Link href="/help" className="block hover:text-[#ffd84d]">
                Help
              </Link>
              <Link href="/order-lookup" className="block hover:text-[#ffd84d]">
                Order Lookup
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