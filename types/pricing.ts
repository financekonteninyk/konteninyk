export interface PricingFeature {
  label: string;
  /** "true" = checkmark, "false" = dash (not included), anything else = shown as-is (e.g. "4", "1 Week"). */
  value: string;
}

export interface PricingTier {
  name: string;
  price: number;
  /** Optional billing cadence shown next to the price, e.g. "/bulan", "/project". */
  period: string | null;
  badge: string | null;
  description: string | null;
  features: PricingFeature[];
}

/** Row shape of the `pricing_categories` table. */
export interface PricingCategory {
  id: string;
  name: string;
  subtitle: string | null;
  tiers: PricingTier[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
