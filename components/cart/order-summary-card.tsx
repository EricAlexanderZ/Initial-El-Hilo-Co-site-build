"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";

export default function OrderSummaryCard() {
  const { items, subtotal } = useCart();
  const [error, setError] = useState("");
  const router = useRouter();

  function handleCheckout() {
    if (items.length === 0) {
      setError("Your cart is empty. Add at least one item before proceeding to checkout.");
      return;
    }
    router.push("/checkout");
  }

  return (
    <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-bold">Order Summary</h3>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>

        <div className="border-t border-black/10 pt-4">
          <div className="flex items-center justify-between text-xl font-bold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          className="mt-2 block w-full rounded-xl bg-[#e5b43d] px-5 py-3 text-center text-sm font-semibold text-black transition hover:brightness-95"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
