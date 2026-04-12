"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";

type StitchType = "Regular Stitched Hat" | "3D Puff Stitched Hat";
type HatStyle = "OTTO Hats" | "Performance Rope Hats" | "Richardson 112s" | "New Era Snapbacks";

type HatColor = {
  name: string;
  hex: string;
};

type HatOption = {
  name: HatStyle;
  description: string;
  imageBase: string;
  colors: HatColor[];
};

const stitchTypes: StitchType[] = [
  "Regular Stitched Hat",
  "3D Puff Stitched Hat",
];

const hatOptions: HatOption[] = [
  {
    name: "OTTO Hats",
    description: "Structured premium trucker hats with a clean embroidery surface.",
    imageBase: "🧢",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#f5f5f5" },
      { name: "Navy", hex: "#13294b" },
      { name: "Red", hex: "#b91c1c" },
      { name: "Khaki", hex: "#b59b6a" },
      { name: "Forest", hex: "#1f5f3b" },
    ],
  },
  {
    name: "Performance Rope Hats",
    description: "Modern rope hats with a sporty premium feel.",
    imageBase: "🏌️",
    colors: [
      { name: "White", hex: "#f8f8f8" },
      { name: "Black", hex: "#111111" },
      { name: "Navy", hex: "#183153" },
      { name: "Royal", hex: "#2563eb" },
      { name: "Gray", hex: "#8c939d" },
      { name: "Tan", hex: "#b69d73" },
    ],
  },
  {
    name: "Richardson 112s",
    description: "Classic trucker fit and one of the most popular embroidery hats.",
    imageBase: "🧢",
    colors: [
      { name: "Black / White", hex: "#222222" },
      { name: "Navy / White", hex: "#13294b" },
      { name: "Gray / Black", hex: "#8b8f97" },
      { name: "Red / White", hex: "#b91c1c" },
      { name: "Brown / Khaki", hex: "#6b4f36" },
      { name: "Green / White", hex: "#1f6a43" },
    ],
  },
  {
    name: "New Era Snapbacks",
    description: "Premium fitted streetwear-style snapbacks for bold branding.",
    imageBase: "🧢",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#f4f4f4" },
      { name: "Navy", hex: "#13294b" },
      { name: "Maroon", hex: "#6b1023" },
      { name: "Gray", hex: "#888888" },
      { name: "Cream", hex: "#e9e0cf" },
    ],
  },
];

const quantities = [
  { label: "5 Hats", qty: 5, price: 115 },
  { label: "12 Hats", qty: 12, price: 216 },
  { label: "24 Hats", qty: 24, price: 384 },
  { label: "48 Hats", qty: 48, price: 720 },
  { label: "72 Hats", qty: 72, price: 1008 },
  { label: "100 Hats", qty: 100, price: 1350 },
];

export default function CustomHatsPage() {
  const [stitchType, setStitchType] = useState<StitchType>("Regular Stitched Hat");
  const [selectedStyle, setSelectedStyle] = useState<HatStyle>("OTTO Hats");
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [selectedQuantity, setSelectedQuantity] = useState<string>("5 Hats");
  const [isCustomQuantity, setIsCustomQuantity] = useState(false);
  const [customQuantity, setCustomQuantity] = useState("");
  const [customQuantityError, setCustomQuantityError] = useState("");

  const currentHat = useMemo(
    () => hatOptions.find((hat) => hat.name === selectedStyle)!,
    [selectedStyle]
  );

  const currentColors = currentHat.colors;

 const currentQuantity = useMemo(
  () => quantities.find((q) => q.label === selectedQuantity) ?? quantities[0],
  [selectedQuantity]
);

const puffUpcharge = stitchType === "3D Puff Stitched Hat" ? 72 : 0;

function getUnitPrice(qty: number) {
  if (qty >= 100) return 13.5;
  if (qty >= 72) return 14;
  if (qty >= 48) return 15;
  if (qty >= 24) return 16;
  if (qty >= 12) return 18;
  return 23;
}

const parsedCustomQty = Number(customQuantity);

const customQtyIsValid =
  customQuantity.trim() !== "" &&
  Number.isFinite(parsedCustomQty) &&
  Number.isInteger(parsedCustomQty) &&
  parsedCustomQty >= 5;

const presetQty = currentQuantity.qty;

const activeQty =
  isCustomQuantity && customQtyIsValid ? parsedCustomQty : presetQty;

const total =
  isCustomQuantity && customQtyIsValid
    ? parsedCustomQty * getUnitPrice(parsedCustomQty) + puffUpcharge
    : currentQuantity.price + puffUpcharge;

const perHat =
  activeQty > 0 ? total / activeQty : 0;

  function handleStyleChange(style: HatStyle) {
    setSelectedStyle(style);
    const found = hatOptions.find((hat) => hat.name === style);
    if (found) {
      setSelectedColor(found.colors[0].name);
    }
  }
  function handlePresetQuantity(label: string) {
  setIsCustomQuantity(false);
  setSelectedQuantity(label);
  setCustomQuantity("");
  setCustomQuantityError("");
}

function handleCustomQuantityChange(e: ChangeEvent<HTMLInputElement>) {
  const value = e.target.value;

  if (value === "") {
    setCustomQuantity("");
    setCustomQuantityError("Please enter a quantity.");
    return;
  }

  if (!/^\d+$/.test(value)) {
    setCustomQuantity(value);
    setCustomQuantityError("Please enter numbers only.");
    return;
  }

  const qty = Number.parseInt(value, 10);

  setCustomQuantity(value);

  if (qty < 5) {
    setCustomQuantityError("Minimum order is 5 hats.");
    return;
  }

  setCustomQuantityError("");
}

  return (
    <main className="min-h-screen bg-[#f6f6f4] text-black">
      <TopBanner />
      <Navbar />

      <section className="border-b border-black/5 bg-[#f6f6f4]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Custom Hats
            </h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span className="text-[#f0b100]">★★★★★</span>
              <span>5.0 average</span>
              <span>·</span>
              <span>Custom embroidery ordering</span>
            </div>

            <p className="mt-6 text-base leading-7 text-gray-600">
              Order premium custom hats with a guided process. Choose your
              stitch type, hat style, hat color, and quantity. We keep the
              ordering clean, practical, and easy for brands, teams, and
              businesses.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {hatOptions.map((hat) => (
                <div
                  key={hat.name}
                  className="flex h-32 w-32 items-center justify-center rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm"
                >
                  <HatMockup
                    label={hat.name}
                    colorHex={hat.colors[0].hex}
                    emoji={hat.imageBase}
                    active={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ececeb] py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-[1.2fr_1.2fr_1.4fr_1fr]">
          <div>
            <Label>Stitch Type</Label>

            <div className="space-y-3">
              {stitchTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStitchType(item)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                    stitchType === item
                      ? "border-[#e3b33d] bg-[#fff8e7] shadow-sm"
                      : "border-black/10 bg-white hover:border-[#d9d9d9]"
                  }`}
                >
                  <span>{item}</span>
                  {stitchType === item ? <span className="text-[#d39a14]">★</span> : null}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Label>Hat Style</Label>

              <div className="grid grid-cols-2 gap-3">
                {hatOptions.map((hat) => {
                  const active = selectedStyle === hat.name;
                  const previewColor =
                    active
                      ? hat.colors.find((c) => c.name === selectedColor)?.hex ?? hat.colors[0].hex
                      : hat.colors[0].hex;

                  return (
                    <button
                      key={hat.name}
                      type="button"
                      onClick={() => handleStyleChange(hat.name)}
                      className={`rounded-[1.35rem] border p-3 text-center transition ${
                        active
                          ? "border-[#e3b33d] bg-[#fff8e7] shadow-sm"
                          : "border-black/10 bg-white hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-center rounded-2xl bg-[#f5f5f5] p-3">
                        <HatMockup
                          label={hat.name}
                          colorHex={previewColor}
                          emoji={hat.imageBase}
                          active={active}
                        />
                      </div>

                      <p className="mt-3 text-sm font-bold leading-tight">{hat.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <Label>Color</Label>

            <div className="rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm">
              <p className="mb-4 text-sm font-medium text-gray-600">
                Color: <span className="font-bold text-black">{selectedColor}</span>
              </p>

              <div className="grid grid-cols-6 gap-3">
                {currentColors.map((color) => {
                  const isActive = selectedColor === color.name;

                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={`relative h-12 w-12 rounded-full border-2 transition hover:scale-105 ${
                        isActive
                          ? "border-[#13294b] ring-2 ring-[#13294b]/20"
                          : "border-white shadow"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Selected Hat Preview</p>

              <div className="mt-4 flex items-center justify-center rounded-[1.5rem] bg-[#f4f5f7] p-8">
                <HatMockup
                  label={selectedStyle}
                  colorHex={
                    currentColors.find((c) => c.name === selectedColor)?.hex ?? currentColors[0].hex
                  }
                  emoji="🧢"
                  active
                  large
                />
              </div>

              <p className="mt-4 text-center text-sm font-semibold">
                {selectedStyle} · {selectedColor}
              </p>
            </div>
          </div>

          <div>
            <Label>Quantity</Label>

            <div className="space-y-3">
              {quantities.map((quantity) => {
                const isActive = !isCustomQuantity && selectedQuantity === quantity.label;
                const adjustedPrice =
                  quantity.price + (stitchType === "3D Puff Stitched Hat" ? 72 : 0);

                return (
                  <button
                    key={quantity.label}
                    type="button"
                    onClick={() => handlePresetQuantity(quantity.label)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                      isActive
                        ? "border-[#e3b33d] bg-[#fff8e7] shadow-sm"
                        : "border-black/10 bg-white hover:border-[#d9d9d9]"
                    }`}
                  >
                    <span>{quantity.label}</span>
                    <span>${adjustedPrice.toFixed(2)}</span>
                  </button>
                );
              })}

<div
  className={`rounded-2xl border px-4 py-4 transition ${
    isCustomQuantity
      ? "border-[#e3b33d] bg-white shadow-sm"
      : "border-black/10 bg-white"
  }`}
>
  <div className="flex items-center justify-between gap-4">
    <button
      type="button"
      onClick={() => {
        setIsCustomQuantity(true);
        if (!customQuantity) {
          setCustomQuantityError("Please enter a quantity.");
        }
      }}
      className="text-left text-sm font-semibold"
    >
      Custom quantity
    </button>

    <div className="flex items-center gap-4">
      <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={isCustomQuantity ? customQuantity : ""}
  onChange={handleCustomQuantityChange}
  onFocus={() => setIsCustomQuantity(true)}
  placeholder="Enter"
  className="w-24 rounded-2xl border border-[#e3b33d] px-4 py-3 text-center text-sm font-medium outline-none"
/>

      {isCustomQuantity && customQtyIsValid ? (
        <div className="min-w-[92px] text-right">
          <p className="text-xl font-bold">${total.toFixed(2)}</p>
          <p className="text-xs text-gray-500">${perHat.toFixed(2)} each</p>
        </div>
      ) : null}
    </div>
  </div>

  {isCustomQuantity && customQuantityError ? (
    <p className="mt-3 text-sm text-red-500">{customQuantityError}</p>
  ) : null}
</div>
            </div>
          </div>

          <div>
            <div className="rounded-[1.75rem] border border-black/10 bg-white p-6 text-center shadow-sm">
             <p className="text-4xl font-extrabold">
  {isCustomQuantity && !customQtyIsValid ? "—" : `$${total.toFixed(2)}`}
</p>
<p className="mt-2 text-sm text-gray-600">
  {isCustomQuantity && !customQtyIsValid ? "—" : `$${perHat.toFixed(2)} / hat`}
</p>
            </div>

            <button
  type="button"
  disabled={isCustomQuantity && !customQtyIsValid}
  className={`mt-5 w-full rounded-2xl px-6 py-4 text-sm font-bold text-white transition ${
    isCustomQuantity && !customQtyIsValid
      ? "cursor-not-allowed bg-gray-400"
      : "bg-[#13294b] hover:scale-[1.02] hover:bg-[#0f1f39]"
  }`}
>
  Continue to Upload
</button>

            <div className="mt-5 rounded-[1.5rem] border border-black/10 bg-white p-5 text-left shadow-sm">
              <p className="text-sm font-bold">Your Selection</p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-black">Stitch Type:</span>{" "}
                  {stitchType}
                </p>
                <p>
                  <span className="font-semibold text-black">Hat Style:</span>{" "}
                  {selectedStyle}
                </p>
                <p>
                  <span className="font-semibold text-black">Color:</span>{" "}
                  {selectedColor}
                </p>
                <p>
  <span className="font-semibold text-black">Quantity:</span>{" "}
  {isCustomQuantity && customQtyIsValid ? `${parsedCustomQty} Hats` : selectedQuantity}
</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-3">
          <Feature icon="⏱️" title="Fast turnaround" text="We keep the ordering and production process clean and efficient." />
          <Feature icon="✅" title="Free online proof" text="We confirm artwork before production so your order feels dialed in." />
          <Feature icon="🧵" title="Premium embroidery" text="Clean stitching for hats built for brands, events, and teams." />
        </div>
      </section>
    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-sm font-bold text-black">{children}</p>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3cf] text-3xl">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}

function HatMockup({
  label,
  colorHex,
  emoji,
  active,
  large = false,
}: {
  label: string;
  colorHex: string;
  emoji: string;
  active: boolean;
  large?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center justify-center ${large ? "scale-125" : ""}`}>
      <div
        className={`relative flex items-center justify-center rounded-[1.4rem] border border-black/10 shadow-sm ${
          large ? "h-24 w-24" : "h-20 w-20"
        }`}
        style={{ backgroundColor: colorHex }}
      >
        <span className={`${large ? "text-4xl" : "text-3xl"}`}>{emoji}</span>
        {active ? (
          <div className="absolute -bottom-2 rounded-full bg-[#13294b] px-2 py-0.5 text-[10px] font-bold text-white">
            Selected
          </div>
        ) : null}
      </div>
      {!large ? (
        <p className="mt-2 max-w-[90px] text-center text-[10px] font-semibold leading-tight text-gray-600">
          {label}
        </p>
      ) : null}
    </div>
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
          <Link href="/products/custom-hats" className="text-sm font-medium hover:text-[#13294b]">
            Products
          </Link>
          <Link href="/designs/logo-design" className="text-sm font-medium hover:text-[#13294b]">
            Designs
          </Link>
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