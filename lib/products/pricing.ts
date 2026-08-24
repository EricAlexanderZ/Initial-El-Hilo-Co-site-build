// Single source of truth for per-product pricing tiers and minimum order quantities.
// Used by both product pages (configurator) and the cart (quantity updates).

export type PricingTier = { minQty: number; unitPrice: number };

const TIERS: Record<string, PricingTier[]> = {
  "Custom Hats": [
    { minQty: 100, unitPrice: 13.5  },
    { minQty: 72,  unitPrice: 14    },
    { minQty: 48,  unitPrice: 15    },
    { minQty: 24,  unitPrice: 16    },
    { minQty: 12,  unitPrice: 18    },
    { minQty: 5,   unitPrice: 23    },
  ],
  "Custom Polos": [
    { minQty: 100, unitPrice: 17    },
    { minQty: 72,  unitPrice: 17.5  },
    { minQty: 48,  unitPrice: 18.75 },
    { minQty: 24,  unitPrice: 20    },
    { minQty: 12,  unitPrice: 21    },
    { minQty: 5,   unitPrice: 30    },
  ],
  "Custom Hoodies": [
    { minQty: 48, unitPrice: 31 },
    { minQty: 24, unitPrice: 34 },
    { minQty: 12, unitPrice: 36 },
    { minQty: 5,  unitPrice: 40 },
    { minQty: 1,  unitPrice: 45 },
  ],
  "Custom Sweaters": [
    { minQty: 48, unitPrice: 28 },
    { minQty: 24, unitPrice: 31 },
    { minQty: 12, unitPrice: 33 },
    { minQty: 5,  unitPrice: 35 },
    { minQty: 1,  unitPrice: 40 },
  ],
};

/**
 * Minimum order quantity, per product type.
 *
 * Everything is 1: single pieces are accepted across the catalog. The tier
 * tables below still start at 5 for hats and polos, which is deliberate — a
 * quantity under the lowest tier falls through to the highest per-piece rate
 * rather than being rejected. Small orders cost more each, they are simply no
 * longer refused.
 */
export const PRODUCT_MOQ: Record<string, number> = {
  "Custom Hats":     1,
  "Custom Polos":    1,
  "Custom Hoodies":  1,
  "Custom Sweaters": 1,
};

/** Returns the unit price for a given product type and quantity. */
export function getUnitPrice(productType: string, qty: number): number {
  const tiers = TIERS[productType];
  if (!tiers) return 0;
  for (const tier of tiers) {
    if (qty >= tier.minQty) return tier.unitPrice;
  }
  return tiers[tiers.length - 1]?.unitPrice ?? 0;
}

/** Returns the minimum order quantity for a product type. */
export function getMinQty(productType: string): number {
  return PRODUCT_MOQ[productType] ?? 1;
}

/** Returns the full pricing tier list for a product type (for displaying tiers in UI). */
export function getPricingTiers(productType: string): PricingTier[] {
  return TIERS[productType] ?? [];
}
