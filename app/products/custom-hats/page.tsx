"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Image from "next/image";
import { SiteHeader, TopBanner } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProcessSteps } from "@/components/process-steps";
import { useRouter } from "next/navigation";
import { PRODUCT_FEATURES } from "@/lib/products/features";
import { Feature } from "@/components/products/product-ui";

type StitchType = "Regular Stitched Hat" | "3D Puff Stitched Hat";
type HatStyle = "OTTO Mid Profile Hats" | "Performance Rope Hats" | "Flex Fit 110s Low Profile";

type HatColor = {
  name: string;
  hex: string;
  hex2?: string;
  image?: string;
  sideImage?: string;
};

type HatOption = {
  name: HatStyle;
  description: string;
  imageBase: string;
  previewImage?: string;
  colors: HatColor[];
};

const stitchTypes: StitchType[] = [
  "Regular Stitched Hat",
  "3D Puff Stitched Hat",
];

const hatOptions: HatOption[] = [
  {
    name: "OTTO Mid Profile Hats",
    description: "Structured premium trucker hats with a clean embroidery surface.",
    imageBase: "🧢",
    previewImage: "/images/home/OTTO%20Mid%20Profile%20Hats/Natural_Crown_Black_Bill_Side.jpg",
    colors: (() => {
      const BASE = "/images/home/OTTO%20Mid%20Profile%20Hats/";
      return [
        { name: "Black",                  hex: "#111111", image: BASE + "Black_Front.jpg",                    sideImage: BASE + "Black_Side.jpg"                    },
        { name: "Black / Blue Bill",      hex: "#111111", hex2: "#2244aa", image: BASE + "Black_Blue_Bill_Front.jpg",            sideImage: BASE + "Black_Blue_Bill_Side.jpg"           },
        { name: "Blue",                   hex: "#3d72b0", image: BASE + "Blue_Front.jpg",                      sideImage: BASE + "Blue_Side.jpg"                     },
        { name: "Charcoal Gray",          hex: "#555555", image: BASE + "Charcoal_Gray_Front.jpg",              sideImage: BASE + "Charcoal_Gray_Side.jpg"             },
        { name: "Gray",                   hex: "#8c939d", image: BASE + "Gray_Front.jpg",                      sideImage: BASE + "Gray_Side.jpg"                     },
        { name: "Green",                  hex: "#1f5f3b", image: BASE + "Green_Front.jpg",                     sideImage: BASE + "Green_Side.jpg"                    },
        { name: "Khaki",                  hex: "#b59b6a", image: BASE + "Khaki_Front.jpg",                    sideImage: BASE + "Khaki_Side.jpg"                    },
        { name: "Natural / Black Bill",   hex: "#d4c8a8", hex2: "#111111", image: BASE + "Natural_Crown_Black_Bill_Front.jpg",   sideImage: BASE + "Natural_Crown_Black_Bill_Side.jpg"  },
        { name: "Navy",                   hex: "#13294b", image: BASE + "Navy_Front.jpg",                      sideImage: BASE + "Navy_Side.jpg"                     },
        { name: "Red",                    hex: "#b91c1c", image: BASE + "Red_Front.jpg",                       sideImage: BASE + "Red_Side.jpg"                      },
        { name: "White",                  hex: "#f5f5f5", image: BASE + "White_Front.jpg",                     sideImage: BASE + "White_Side.jpg"                    },
      ];
    })(),
  },
  {
    name: "Performance Rope Hats",
    description: "Modern rope hats with a sporty premium feel.",
    imageBase: "🏌️",
    previewImage: "/images/home/Rope%20Hats/Khaki_Crown_Black_Bill_Khaki%26Black_Rope_Side.jpg",
    colors: (() => {
      const BASE = "/images/home/Rope%20Hats/";
      return [
        { name: "Black / White & Black Rope",                       hex: "#111111", hex2: "#f5f5f5", image: BASE + "Black_Hat_White%26Black_Rope_Front.jpg",                          sideImage: BASE + "Black_Hat_White%26Black_Rope_Side.jpg"                          },
        { name: "Dark Gray / Light Gray & Black Rope",              hex: "#555555", hex2: "#9e9e9e", image: BASE + "Dark_Gray_Hat_Light_Gray%26Black_Rope_Front.jpg",                 sideImage: BASE + "Dark_Gray_Hat_Light_Gray%26Black_Rope_Side.jpg"                 },
        { name: "Deep Blue / White Rope",                           hex: "#1a2f6a",                  image: BASE + "Deep_Blue_Hat_White_Rope_Front.jpg",                              sideImage: BASE + "Deep_Blue_Hat_White_Rope_Side.jpg"                              },
        { name: "Khaki & Black / Khaki Bill / Black Rope",          hex: "#b59b6a", hex2: "#111111", image: BASE + "Khaki%26Black_Crown_Khaki_Bill_Black_Rope_Front.jpg",             sideImage: BASE + "Khaki%26Black_Crown_Khaki_Bill_Black_Rope_Side.jpg"             },
        { name: "Khaki / Black Bill / Khaki & Black Rope",          hex: "#b59b6a", hex2: "#111111", image: BASE + "Khaki_Crown_Black_Bill_Khaki%26Black_Rope_Front.jpg",             sideImage: BASE + "Khaki_Crown_Black_Bill_Khaki%26Black_Rope_Side.jpg"             },
        { name: "Light Gray & Black / Gray Bill / Black Rope",      hex: "#9e9e9e", hex2: "#111111", image: BASE + "Light_Gray%26Black_Crown_Light_Gray_Bill_Black_Rope_Front.jpg",   sideImage: BASE + "Light_Gray%26Black_Crown_Light_Gray_Bill_Black_Rope_Side.jpg"   },
        { name: "Light Gray / Black & Gray Rope",                   hex: "#9e9e9e", hex2: "#111111", image: BASE + "Light_Gray_Hat_Black%26Gray_Rope_Front.jpg",                      sideImage: BASE + "Light_Gray_Hat_Black%26Gray_Rope_Side.jpg"                      },
        { name: "White / Black & White Rope",                       hex: "#f5f5f5", hex2: "#111111", image: BASE + "White_Hat_Black%26White_Rope_Front.jpg",                          sideImage: BASE + "White_Hat_Black%26White_Rope_Side.jpg"                          },
      ];
    })(),
  },
  {
    name: "Flex Fit 110s Low Profile",
    description: "Low-profile flex fit with a clean structured look.",
    imageBase: "🧢",
    previewImage: "/images/home/Flex%20Fit/110_Brown_%26_Khaki_Side.jpg",
    colors: (() => {
      const BASE = "/images/home/Flex%20Fit/";
      return [
        { name: "Black",                   hex: "#111111", image: BASE + "110_Black_Front.jpg",                       sideImage: BASE + "110_Black_Side.jpg"                       },
        { name: "Black & White",           hex: "#111111", hex2: "#f5f5f5", image: BASE + "110_Black_%26_White_Front.jpg",              sideImage: BASE + "110_Black_%26_White_Side.jpg"              },
        { name: "Brown & Khaki",           hex: "#6b4f36", hex2: "#b59b6a", image: BASE + "110_Brown_%26_Khaki_Front.jpg",              sideImage: BASE + "110_Brown_%26_Khaki_Side.jpg"              },
        { name: "Caramel & Khaki",         hex: "#8b6914", hex2: "#b59b6a", image: BASE + "110_Caramel_%26_Khaki_Front.jpg",            sideImage: BASE + "110_Caramel_%26_Khaki_Side.jpg"            },
        { name: "Charcoal",                hex: "#4a4a4a", image: BASE + "110_Charcoal_Front.jpg",                     sideImage: BASE + "110_Charcoal_Side.jpg"                     },
        { name: "Charcoal & Black",        hex: "#4a4a4a", hex2: "#111111", image: BASE + "110_Charcoal_%26_Black_Front.jpg",           sideImage: BASE + "110_Charcoal_%26_Black_Side.jpg"           },
        { name: "Charcoal & White",        hex: "#555555", hex2: "#f5f5f5", image: BASE + "110_Charcoal_%26_White_Front.jpg",           sideImage: BASE + "110_Charcoal_%26_White_Side.jpg"           },
        { name: "Coyote Brown & Black",    hex: "#7a5c3a", hex2: "#111111", image: BASE + "110_Coyote_Brown_%26_Black_Front.jpg",       sideImage: BASE + "110_Coyote_Brown_%26_Black_Side.jpg"       },
        { name: "Coyote Brown & Khaki",    hex: "#7a5c3a", hex2: "#b59b6a", image: BASE + "110_Coyote_Brown_%26_Khaki_Front.jpg",       sideImage: BASE + "110_Coyote_Brown_%26_Khaki_Side.jpg"       },
        { name: "Heather Grey & Black",    hex: "#9e9e9e", hex2: "#111111", image: BASE + "110_Heather_Grey_%26_Black_Front.jpg",       sideImage: BASE + "110_Heather_Grey_%26_Black_Side.jpg"       },
        { name: "Heather Grey & White",    hex: "#9e9e9e", hex2: "#f5f5f5", image: BASE + "110_Heather_Grey_%26_White_Front.jpg",       sideImage: BASE + "110_Heather_Grey_%26_White_Side.jpg"       },
        { name: "Melange Charcoal & Black",hex: "#555555", hex2: "#111111", image: BASE + "110_Melange_Charcoal_%26_Black_Front.jpg",   sideImage: BASE + "110_Melange_Charcoal_%26_Black_Side.jpg"   },
        { name: "Melange Silver & White",  hex: "#c0c0c0", hex2: "#f5f5f5", image: BASE + "110_Melange_Silver_%26_White_Front.jpg",     sideImage: BASE + "110_Melange_Silver_%26_White_Side.jpg"     },
        { name: "Navy",                    hex: "#13294b", image: BASE + "110_Navy_Front.jpg",                         sideImage: BASE + "110_Navy_Side.jpg"                         },
        { name: "Navy & White",            hex: "#13294b", hex2: "#f5f5f5", image: BASE + "110_Navy_%26_White_Front.jpg",               sideImage: BASE + "110_Navy_%26_White_Side.jpg"               },
        { name: "Olive & Khaki",           hex: "#6b6b2a", hex2: "#b59b6a", image: BASE + "110_Olive_%26_Khaki_Front.jpg",              sideImage: BASE + "110_Olive_%26_Khaki_Side.jpg"              },
        { name: "Red",                     hex: "#cc2222", image: BASE + "110_Red_Front.jpg",                          sideImage: BASE + "110_Red_Side.jpg"                          },
        { name: "Red & White",             hex: "#cc2222", hex2: "#f5f5f5", image: BASE + "110_Red_%26_White_Front.jpg",                sideImage: BASE + "110_Red_%26_White_Side.jpg"                },
        { name: "Royal & White",           hex: "#2355b8", hex2: "#f5f5f5", image: BASE + "110_Royal_%26_White_Front.jpg",              sideImage: BASE + "110_Royal_%26_White_Side.jpg"              },
        { name: "White",                   hex: "#f5f5f5", image: BASE + "110_White_Front.jpg",                        sideImage: BASE + "110_White_Side.jpg"                        },
      ];
    })(),
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



const reviews = [
  {
    initials: "EA",
    title: "Exactly what we needed",
    date: "04/12/2026",
    text: "The hats came out clean, the embroidery looked premium, and the process was easy from start to finish.",
  },
  {
    initials: "MR",
    title: "Great quality",
    date: "04/09/2026",
    text: "We ordered hats for our brand and the stitch quality was solid. Definitely ordering again.",
  },
  {
    initials: "JL",
    title: "Fast and professional",
    date: "04/05/2026",
    text: "Proof was quick, communication was clear, and the finished hats looked even better in person.",
  },
  {
    initials: "CP",
    title: "Love the puff embroidery",
    date: "04/01/2026",
    text: "The 3D puff hats came out bold and clean. Really happy with the final result.",
  },
];

export default function CustomHatsPage() {
  const [stitchType, setStitchType] = useState<StitchType>("Regular Stitched Hat");
  const [selectedStyle, setSelectedStyle] = useState<HatStyle>("OTTO Mid Profile Hats");
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [selectedQuantity, setSelectedQuantity] = useState<string>("5 Hats");
  const [isCustomQuantity, setIsCustomQuantity] = useState(false);
  const [customQuantity, setCustomQuantity] = useState("");
  const [customQuantityError, setCustomQuantityError] = useState("");
  const [frontPlacement, setFrontPlacement] = useState(true);
  const [leftPlacement, setLeftPlacement] = useState(false);
  const [rightPlacement, setRightPlacement] = useState(false);
  const [previewAngle, setPreviewAngle] = useState<"front" | "side">("front");
  const router = useRouter();

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

const activePlacementCount = [frontPlacement, leftPlacement, rightPlacement].filter(Boolean).length;
const perHatPlacementUpcharge = Math.max(0, activePlacementCount - 1) * 5;

function goToUploadPage() {
  const placementList = [
    frontPlacement ? "Front of Cap" : null,
    leftPlacement  ? "Left Side"   : null,
    rightPlacement ? "Right Side"  : null,
  ].filter(Boolean).join(",");

  const params = new URLSearchParams({
    productType:  "Custom Hats",
    style:        selectedStyle,
    color:        selectedColor,
    quantity:     isCustomQuantity && customQtyIsValid ? String(parsedCustomQty) : selectedQuantity,
    placement:    placementList,
    stitchType,
    total:        String(total),
    perUnit:      String(perHat),
    minQty:       "5",
    flatUpcharge:      String(puffUpcharge),
    perPieceUpcharge:  String(perHatPlacementUpcharge),
  });

  router.push(`/upload-artwork?${params.toString()}`);
}

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
    ? parsedCustomQty * (getUnitPrice(parsedCustomQty) + perHatPlacementUpcharge) + puffUpcharge
    : currentQuantity.price + (currentQuantity.qty * perHatPlacementUpcharge) + puffUpcharge;

const perHat =
  activeQty > 0 ? total / activeQty : 0;

  function handleStyleChange(style: HatStyle) {
    setSelectedStyle(style);
    setPreviewAngle("front");
    const found = hatOptions.find((hat) => hat.name === style);
    if (found) setSelectedColor(found.colors[0].name);
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
function togglePlacement(type: "front" | "left" | "right") {
  const selectedCount = [frontPlacement, leftPlacement, rightPlacement].filter(Boolean).length;

  if (type === "front") {
    if (frontPlacement && selectedCount === 1) return;
    setFrontPlacement((prev) => !prev);
    return;
  }

  if (type === "left") {
    if (leftPlacement && selectedCount === 1) return;
    setLeftPlacement((prev) => !prev);
    return;
  }

  if (type === "right") {
    if (rightPlacement && selectedCount === 1) return;
    setRightPlacement((prev) => !prev);
    return;
  }
}
  return (
    <main className="min-h-screen bg-[#f6f6f4] text-black">
      <TopBanner />
      <SiteHeader />

      <section className="border-b border-black/5 bg-[#f6f6f4]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
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
                  className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm sm:h-32 sm:w-32"
                >
                  {hat.previewImage ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={hat.previewImage}
                        alt={hat.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <HatMockup
                      label={hat.name}
                      colorHex={hat.colors[0].hex}
                      emoji={hat.imageBase}
                      active={false}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ececeb] py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-[1.2fr_1.2fr_1.4fr_1fr]">
          <div className="order-2 lg:order-1">
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
                      <div className="flex items-center justify-center rounded-2xl bg-white p-2">
                        {hat.previewImage ? (
                          <div className="relative h-20 w-full">
                            <Image
                              src={hat.previewImage}
                              alt={hat.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <HatMockup
                            label={hat.name}
                            colorHex={previewColor}
                            emoji={hat.imageBase}
                            active={active}
                          />
                        )}
                      </div>

                      <p className="mt-3 text-sm font-bold leading-tight">{hat.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
  <div className="mb-8">
    <Label>Embroidery Placement</Label>

    <div className="grid grid-cols-1 gap-3">
      <PlacementButton
        label="Front of Cap"
        selected={frontPlacement}
        onClick={() => togglePlacement("front")}
      />

      <PlacementButton
        label="Left Side"
        selected={leftPlacement}
        onClick={() => togglePlacement("left")}
      />

      <PlacementButton
        label="Right Side"
        selected={rightPlacement}
        onClick={() => togglePlacement("right")}
      />
    </div>
  </div>

            <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Selected Hat Preview</p>

              {(() => {
                const colorData = currentColors.find((c) => c.name === selectedColor) ?? currentColors[0];
                const hasSide = !!colorData.sideImage;
                const imgSrc = previewAngle === "side" && colorData.sideImage ? colorData.sideImage : colorData.image;

                return (
                  <>
                    {hasSide && (
                      <div className="mt-4 flex gap-2">
                        {(["front", "side"] as const).map((angle) => (
                          <button
                            key={angle}
                            type="button"
                            onClick={() => setPreviewAngle(angle)}
                            className={`flex-1 rounded-xl py-2 text-sm font-semibold capitalize transition ${
                              previewAngle === angle
                                ? "bg-[#13294b] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {angle}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-center rounded-[1.5rem] bg-white p-4">
                      {imgSrc ? (
                        <div key={imgSrc} className="relative h-48 w-full">
                          <Image
                            src={imgSrc}
                            alt={`${selectedStyle} in ${selectedColor} — ${previewAngle}`}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <HatMockup
                          label={selectedStyle}
                          colorHex={colorData.hex}
                          emoji="🧢"
                          active
                          large
                        />
                      )}
                    </div>
                  </>
                );
              })()}

              <p className="mt-4 text-center text-sm font-semibold">
                {selectedStyle} · {selectedColor}
              </p>

              <div className="mt-4 border-t border-black/5 pt-4">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Color: <span className="font-bold text-black">{selectedColor}</span>
                </p>
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                  {currentColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => { setSelectedColor(color.name); setPreviewAngle("front"); }}
                      title={color.name}
                      className={`h-10 w-10 rounded-full border-2 transition hover:scale-105 sm:h-12 sm:w-12 ${
                        selectedColor === color.name
                          ? "border-[#13294b] ring-2 ring-[#13294b]/20"
                          : "border-white shadow"
                      }`}
                      style={{
                        background: color.hex2
                          ? `linear-gradient(45deg, ${color.hex} 50%, ${color.hex2} 50%)`
                          : color.hex,
                      }}
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="order-3">
            <Label>Quantity</Label>

            <div className="space-y-3">
              {quantities.map((quantity) => {
                const isActive = !isCustomQuantity && selectedQuantity === quantity.label;
                const adjustedPrice =
                  quantity.price + (quantity.qty * perHatPlacementUpcharge) + (stitchType === "3D Puff Stitched Hat" ? 72 : 0);

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
  <div className="flex flex-wrap items-center justify-between gap-4">
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

          <div className="order-4 min-w-0 overflow-hidden">
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
  onClick={goToUploadPage}
  disabled={isCustomQuantity && !customQtyIsValid}
  className={`mt-5 w-full rounded-2xl px-6 py-4 text-sm font-bold text-white transition ${
    isCustomQuantity && !customQtyIsValid
      ? "cursor-not-allowed bg-gray-400"
      : "bg-[#13294b] hover:scale-[1.02] hover:bg-[#0f1f39]"
  }`}
>
  Continue to Upload
</button>

            {perHatPlacementUpcharge > 0 && (
              <p className="mt-3 text-xs text-[#d39a14]">
                ★ Additional placement adds ${perHatPlacementUpcharge.toFixed(2)}/hat
              </p>
            )}

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
                  <span className="font-semibold text-black">Placement:</span>{" "}
                  {[
                    frontPlacement ? "Front of Cap" : null,
                    leftPlacement ? "Left Side" : null,
                    rightPlacement ? "Right Side" : null,
                  ]
                    .filter(Boolean)
                    .join(", ") || "None selected"}
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

      <section className="bg-white py-14">
  <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 text-center md:grid-cols-3">
    {PRODUCT_FEATURES.map((f) => (
      <Feature key={f.title} image={f.image} title={f.title} text={f.text} />
    ))}
  </div>
</section>

<ProcessSteps />

<section className="bg-[#f6f6f4] py-20">
  <div className="mx-auto max-w-6xl px-6">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Premium embroidered hats built for brands
      </h2>
      <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
        Whether you want clean regular embroidery or bold 3D puff stitching,
        El Hilo Co helps you create hats that feel polished, wearable, and
        brand-ready.
      </p>
    </div>

    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="relative overflow-hidden rounded-[2rem] shadow-sm min-h-[260px] md:min-h-[420px]">
        <video
          src="/images/home/PeakCapVid.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="relative overflow-hidden rounded-[2rem] shadow-sm min-h-[260px] md:min-h-[420px]">
        <Image
          src="/images/home/PeakBundle.JPG"
          alt="El Hilo Co hat bundle"
          fill
          className="object-cover object-center"
        />
      </div>
    </div>

    <div className="mx-auto mt-20 max-w-3xl text-center">
      <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Connect with us on social media
      </h2>
      <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
        Want to see your hats in process, proof updates, and behind-the-scenes
        content? Follow El Hilo Co and stay connected with the work.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://www.instagram.com/elhiloco"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#13294b] px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#0f1f39]"
        >
          Instagram
        </a>
        <a
          href="https://www.tiktok.com/@el.hilo.co"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[#13294b] px-6 py-3 text-sm font-semibold text-[#13294b] transition hover:bg-[#eef2f7]"
        >
          TikTok
        </a>
      </div>
    </div>
  </div>
</section>

<section className="bg-white py-20">
  <div className="mx-auto max-w-4xl px-6">
    <div className="text-center">
      <h2 className="text-4xl font-extrabold tracking-tight">Customer reviews</h2>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <p className="text-4xl font-extrabold">5/5</p>
          <p className="mt-2 text-sm text-gray-500">Average reviews</p>
        </div>
        <div>
          <p className="text-4xl font-extrabold">56</p>
          <p className="mt-2 text-sm text-gray-500">Total reviews</p>
        </div>
        <div>
          <p className="text-4xl font-extrabold">100%</p>
          <p className="mt-2 text-sm text-gray-500">Would order again</p>
        </div>
      </div>
    </div>

    <div className="mt-12">
      {reviews.map((review) => (
        <ReviewCard
          key={`${review.initials}-${review.title}`}
          initials={review.initials}
          title={review.title}
          date={review.date}
          text={review.text}
        />
      ))}
    </div>
  </div>
</section>
<SiteFooter />
    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-sm font-bold text-black">{children}</p>
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

function ReviewCard({
  initials,
  title,
  date,
  text,
}: {
  initials: string;
  title: string;
  date: string;
  text: string;
}) {
  return (
    <div className="border-t border-black/10 py-8 first:border-t-0 first:pt-0">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffd84d] text-sm font-bold text-black">
          {initials}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-[#f0b100]">★★★★★</div>
          <h3 className="mt-1 text-lg font-bold">{title}</h3>
          <p className="text-xs text-gray-500">Verified · {date}</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">{text}</p>
        </div>
      </div>
    </div>
  );
}
function PlacementButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
        selected
          ? "border-[#e3b33d] bg-[#fff8e7] shadow-sm"
          : "border-black/10 bg-white hover:border-[#d9d9d9]"
      }`}
    >
      {label}
    </button>
  );
}