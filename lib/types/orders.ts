export type OrderStatus =
  | "new"
  | "proof_sent"
  | "proof_approved"
  | "in_production"
  | "shipped"
  | "complete"
  | "cancelled";

export type OrderItem = {
  id: string;
  order_id: string;
  product_type: string;
  style: string | null;
  color: string | null;
  quantity: number;
  placement: string[];
  details: Record<string, string>;
  artwork_urls: string[];
  price: number;
  unit_price: number;
  per_piece_upcharge: number;
  flat_upcharge: number;
};

export type Order = {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;
  shipping_method: string | null;
  shipping_price: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  archived_at: string | null;
  order_items?: OrderItem[];
};
