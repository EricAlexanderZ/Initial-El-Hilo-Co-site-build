-- Run this in Supabase → SQL Editor

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz NOT NULL    DEFAULT now(),
  customer_name    text        NOT NULL,
  customer_email   text        NOT NULL,
  customer_phone   text,
  shipping_address jsonb,
  shipping_method  text,
  shipping_price   numeric(10, 2) NOT NULL DEFAULT 0,
  subtotal         numeric(10, 2) NOT NULL,
  total            numeric(10, 2) NOT NULL,
  status           text        NOT NULL    DEFAULT 'new'
    CHECK (status IN ('new','proof_sent','proof_approved','in_production','shipped','complete','cancelled')),
  notes            text
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id                 uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           uuid    NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_type       text    NOT NULL,
  style              text,
  color              text,
  quantity           integer NOT NULL CHECK (quantity > 0),
  placement          text[]  NOT NULL DEFAULT '{}',
  details            jsonb   NOT NULL DEFAULT '{}',
  artwork_urls       text[]  NOT NULL DEFAULT '{}',
  price              numeric(10, 2) NOT NULL,
  unit_price         numeric(10, 2) NOT NULL,
  per_piece_upcharge numeric(10, 2) NOT NULL DEFAULT 0,
  flat_upcharge      numeric(10, 2) NOT NULL DEFAULT 0
);

-- Row-level security
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Anon (checkout flow) can insert
CREATE POLICY "anon_insert_orders"      ON orders      FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT TO anon WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
