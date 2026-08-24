"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AddCartItemInput, CartItem } from "@/types/cart";
import { CART_STORAGE_KEY, createCartItem, getCartCount, getCartSubtotal } from "@/lib/cart";
import { getUnitPrice } from "@/lib/products/pricing";
import { parseAddOns, quoteOrder } from "@/lib/pricing";

/**
 * Per-piece price for a cart line at a given quantity.
 *
 * Hats are quoted through the cap engine rather than the flat per-product tier
 * table: their price depends on the style's blank cost and on which placements
 * are embroidered, neither of which `getUnitPrice` knows about. Any hat added
 * before this change has no styleId, so it falls through to the old path and
 * keeps whatever price it was added at instead of throwing.
 */
function unitPriceFor(item: { productType: string; styleId?: string; addOns?: string }, qty: number): number {
  if (item.productType === "Custom Hats" && item.styleId) {
    try {
      return quoteOrder({
        styleId:    item.styleId,
        quantity:   qty,
        placements: parseAddOns(item.addOns),
      }).perHat;
    } catch {
      // Unknown style id (catalog changed under an old cart). Fall through.
    }
  }
  return getUnitPrice(item.productType, qty);
}

type CartContextType = {
  items: CartItem[];
  addItem: (item: AddCartItemInput) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return;
    try {
      setItems(JSON.parse(saved));
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(input: AddCartItemInput) {
    const newItem = createCartItem(input);
    setItems((prev) => {
      const existing = prev.find((c) => c.cartItemId === newItem.cartItemId);
      if (existing) {
        const mergedQty    = existing.quantity + newItem.quantity;
        const basePrice    = unitPriceFor(existing, mergedQty);
        const newUnitPrice = basePrice + existing.perPieceUpcharge;
        return prev.map((c) =>
          c.cartItemId === newItem.cartItemId
            ? { ...c, quantity: mergedQty, unitPrice: newUnitPrice, price: newUnitPrice * mergedQty + c.flatUpcharge }
            : c
        );
      }
      return [...prev, newItem];
    });
  }

  function removeItem(cartItemId: string) {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }

  function updateQuantity(cartItemId: string, quantity: number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        const safeQty    = Math.max(item.minQty, Math.floor(quantity));
        const basePrice  = unitPriceFor(item, safeQty);
        const newUnitPrice = basePrice + item.perPieceUpcharge;
        return {
          ...item,
          quantity:  safeQty,
          unitPrice: newUnitPrice,
          price:     newUnitPrice * safeQty + item.flatUpcharge,
        };
      })
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = useMemo(() => getCartCount(items), [items]);
  const subtotal  = useMemo(() => getCartSubtotal(items), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
