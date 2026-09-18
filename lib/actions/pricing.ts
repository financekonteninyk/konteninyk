"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { pricingCategorySchema } from "@/lib/validations";
import type { PricingTier } from "@/types/pricing";

export interface PricingActionState {
  error?: string;
}

function parsePricingForm(formData: FormData) {
  const tiersRaw = (formData.get("tiers") as string) || "[]";
  let tiers: PricingTier[] = [];
  try {
    tiers = JSON.parse(tiersRaw);
  } catch {
    tiers = [];
  }

  return {
    name: formData.get("name"),
    subtitle: formData.get("subtitle"),
    tiers,
    sort_order: formData.get("sort_order") || 0,
    is_published: formData.get("is_published") === "true",
  };
}

/** Turns a Zod validation failure into a message that names the exact
 * field that failed (e.g. "tiers.0.price: Can't be negative"), instead of
 * a generic "Invalid input" that gives no clue where to look. */
function describeValidationError(error: { issues: { path: (string | number)[]; message: string }[] }): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid input — no further detail available.";
  const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
  return `${path}: ${issue.message}`;
}

function buildPayload(parsed: ReturnType<typeof pricingCategorySchema.parse>) {
  return {
    name: parsed.name,
    subtitle: parsed.subtitle || null,
    tiers: parsed.tiers.map((tier) => ({
      name: tier.name,
      price: tier.price,
      period: tier.period || null,
      badge: tier.badge || null,
      description: tier.description || null,
      features: tier.features,
    })),
    sort_order: parsed.sort_order,
    is_published: parsed.is_published,
  };
}

/** Creates a new pricing category. */
export async function createPricingCategoryAction(
  _prevState: PricingActionState,
  formData: FormData
): Promise<PricingActionState> {
  const parsed = pricingCategorySchema.safeParse(parsePricingForm(formData));
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("pricing_categories").insert(buildPayload(parsed.data));

  if (error) return { error: `Failed to create pricing category: ${error.message}` };

  revalidatePath("/admin/dashboard/pricing");
  revalidatePath("/pricing");
  redirect("/admin/dashboard/pricing");
}

/** Updates an existing pricing category. */
export async function updatePricingCategoryAction(
  id: string,
  _prevState: PricingActionState,
  formData: FormData
): Promise<PricingActionState> {
  const parsed = pricingCategorySchema.safeParse(parsePricingForm(formData));
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pricing_categories")
    .update({ ...buildPayload(parsed.data), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: `Failed to update pricing category: ${error.message}` };

  revalidatePath("/admin/dashboard/pricing");
  revalidatePath("/pricing");
  redirect("/admin/dashboard/pricing");
}

/** Deletes a pricing category. */
export async function deletePricingCategoryAction(id: string): Promise<PricingActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("pricing_categories").delete().eq("id", id);
  if (error) return { error: `Failed to delete: ${error.message}` };

  revalidatePath("/admin/dashboard/pricing");
  revalidatePath("/pricing");
  return {};
}

/** Toggles whether a pricing category shows on the public site. */
export async function togglePricingPublishedAction(id: string, isPublished: boolean): Promise<PricingActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pricing_categories")
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: `Failed to update: ${error.message}` };

  revalidatePath("/admin/dashboard/pricing");
  revalidatePath("/pricing");
  return {};
}

/** Adds a pricing tier to the invoice service price list, for quick reuse on invoices. */
export async function addTierToInvoiceServicesAction(
  tierName: string,
  price: number,
  categoryName: string
): Promise<PricingActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("invoice_services").insert({
    name: tierName,
    price,
    category: categoryName,
  });

  if (error) return { error: `Failed to add to invoice price list: ${error.message}` };

  revalidatePath("/admin/dashboard/invoices/services");
  return {};
}
