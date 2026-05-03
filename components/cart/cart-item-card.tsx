"use client";

import type { CartItem } from "@/types/cart";
import { useCart } from "@/components/cart/cart-provider";

const PRODUCT_EMOJI: Record<string, string> = {
  "Custom Hats":     "🧢",
  "Custom Polos":    "👔",
  "Custom Hoodies":  "🧥",
  "Custom Sweaters": "🧶",
};

export default function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const emoji = item.image ?? PRODUCT_EMOJI[item.productType] ?? "📦";

  return (
    <div className="rounded-[1.75rem] bg-white p-4 shadow-sm sm:p-6">
      {/* Top row: thumbnail + name + remove */}
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#eef2f7] text-4xl sm:h-24 sm:w-24 sm:text-5xl">
          {emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold leading-tight sm:text-2xl">{item.productType}</h3>
            <button
              type="button"
              onClick={() => removeItem(item.cartItemId)}
              className="shrink-0 text-sm text-gray-400 hover:text-red-500"
            >
              Remove
            </button>
          </div>

          <div className="mt-1 space-y-0.5 text-sm text-gray-600">
            {item.style    && <p>{item.style}</p>}
            {item.color    && <p>{item.color}</p>}
            {item.placement.length > 0 && <p>{item.placement.join(", ")}</p>}
            {Object.entries(item.details).map(([k, v]) => (
              <p key={k}><span className="font-medium">{k}:</span> {v}</p>
            ))}
            {item.flatUpcharge > 0 && (
              <p className="text-[#d39a14]">+${item.flatUpcharge.toFixed(2)} placement upcharge</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: quantity + price */}
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <input
            type="number"
            min={item.minQty}
            step={1}
            value={item.quantity}
            onChange={(e) => updateQuantity(item.cartItemId, Number(e.target.value))}
            className="w-20 rounded-xl border border-black/10 px-3 py-2 text-sm sm:w-24"
          />
          {item.minQty > 1 && (
            <p className="mt-1 text-xs text-gray-500">Min: {item.minQty}</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} / piece</p>
        </div>
      </div>
    </div>
  );
}
