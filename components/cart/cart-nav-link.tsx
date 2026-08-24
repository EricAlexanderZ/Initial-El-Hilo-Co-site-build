"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";

export default function CartNavLink() {
  const { cartCount } = useCart();

  return (
    <Link prefetch={false}
      href="/cart"
      className="relative inline-flex items-center gap-2 text-sm font-semibold text-black transition hover:opacity-70"
      aria-label={`Cart${cartCount > 0 ? ` with ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`}
    >
      <span>Cart</span>

      {cartCount > 0 ? (
        <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[#e5b43d] px-1.5 py-0.5 text-xs font-bold text-black">
          {cartCount}
        </span>
      ) : null}
    </Link>
  );
}