import { createClient } from "@/lib/supabase/server";
import type { PricingCategory } from "@/types/pricing";

/** Fetch all pricing categories (admin view — includes unpublished). */
export async function getAllPricingCategories(): Promise<PricingCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pricing_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch pricing categories:", error.message);
    return [];
  }

  return (data ?? []) as unknown as PricingCategory[];
}

/** Fetch only published pricing categories — used on the public pricing page. */
export async function getPublishedPricingCategories(): Promise<PricingCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pricing_categories")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch published pricing categories:", error.message);
    return [];
  }

  return (data ?? []) as unknown as PricingCategory[];
}

/** Fetch a single pricing category by id. */
export async function getPricingCategoryById(id: string): Promise<PricingCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("pricing_categories").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Failed to fetch pricing category:", error.message);
    return null;
  }

  return data as unknown as PricingCategory | null;
}
