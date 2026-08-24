export type CartItem = {
  cartItemId: string;
  productType: string;
  style: string;
  color: string;
  quantity: number;
  placement: string[];
  details: Record<string, string>;
  artworkUrls?: string[];   // uploaded artwork file URLs (one per placement slot)
  minQty: number;
  perPieceUpcharge: number; // added to unit price per piece (e.g. $5/polo dual placement)
  flatUpcharge: number;     // flat per-order fee (e.g. logo size digitizing)
  price: number;
  unitPrice: number;
  image?: string;

  /**
   * Hats only. The cap style id and the serialised add-on placements, carried
   * so the cart can requote through `quoteOrder()` when the shopper changes
   * quantity. Hat pricing depends on the style's blank cost and on which
   * placements are embroidered, so the flat `getUnitPrice` table cannot
   * reprice them. Absent on every other product type.
   */
  styleId?: string;
  addOns?: string;
};

export type AddCartItemInput = Omit<CartItem, "cartItemId">;
