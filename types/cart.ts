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
};

export type AddCartItemInput = Omit<CartItem, "cartItemId">;
