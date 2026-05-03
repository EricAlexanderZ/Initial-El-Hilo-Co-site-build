import type { AddCartItemInput, CartItem } from "@/types/cart";

export const CART_STORAGE_KEY = "el-hilo-cart";

export function buildCartItemId(item: AddCartItemInput): string {
  return [
    item.productType,
    item.style,
    item.color,
    [...item.placement].sort().join("-"),
  ].join("__");
}

// Price and unitPrice are computed by the product page — cart just stores them.
export function createCartItem(input: AddCartItemInput): CartItem {
  return {
    ...input,
    cartItemId: buildCartItemId(input),
  };
}

export function getCartCount(items: CartItem[]): number {
  return items.length;
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
