"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { siteSettingsFormSchema, taxonomyItemSchema, serviceItemSchema } from "@/lib/validations";
import type { ServiceStage } from "@/types/settings";

export interface SettingsActionState {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
}

function flattenFieldErrors(error: { issues: { path: (string | number)[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/** Updates the singleton site_settings row. Used by the admin Settings page. */
export async function updateSiteSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const parsed = siteSettingsFormSchema.safeParse({
    site_logo_url: (formData.get("site_logo_url") as string) || null,
    hero_logo_url: (formData.get("hero_logo_url") as string) || null,
    hero_logo_width: formData.get("hero_logo_width"),
    hero_logo_height: formData.get("hero_logo_height"),
    tagline_id: formData.get("tagline_id"),
    tagline_en: formData.get("tagline_en"),
    hero_badge_text_id: formData.get("hero_badge_text_id"),
    hero_badge_text_en: formData.get("hero_badge_text_en"),
    hero_heading_id: formData.get("hero_heading_id"),
    hero_heading_en: formData.get("hero_heading_en"),
    hero_description_id: formData.get("hero_description_id"),
    hero_description_en: formData.get("hero_description_en"),
    about_text_id: formData.get("about_text_id"),
    about_text_en: formData.get("about_text_en"),
    about_vision_id: formData.get("about_vision_id"),
    about_vision_en: formData.get("about_vision_en"),
    about_mission_id: formData.get("about_mission_id"),
    about_mission_en: formData.get("about_mission_en"),
    stats_text_id: formData.get("stats_text_id"),
    stats_text_en: formData.get("stats_text_en"),
    nav_portfolio_id: formData.get("nav_portfolio_id"),
    nav_portfolio_en: formData.get("nav_portfolio_en"),
    nav_process_id: formData.get("nav_process_id"),
    nav_process_en: formData.get("nav_process_en"),
    nav_services_id: formData.get("nav_services_id"),
    nav_services_en: formData.get("nav_services_en"),
    nav_about_id: formData.get("nav_about_id"),
    nav_about_en: formData.get("nav_about_en"),
    nav_cta_id: formData.get("nav_cta_id"),
    nav_cta_en: formData.get("nav_cta_en"),
    whatsapp_url: formData.get("whatsapp_url"),
    chat_bot_logo_url: (formData.get("chat_bot_logo_url") as string) || null,
    whatsapp_icon_url: (formData.get("whatsapp_icon_url") as string) || null,
    gls_icon_url: (formData.get("gls_icon_url") as string) || null,
    invoice_company_name: formData.get("invoice_company_name"),
    invoice_company_sub: formData.get("invoice_company_sub"),
    invoice_company_address: formData.get("invoice_company_address"),
    invoice_company_email: formData.get("invoice_company_email"),
    invoice_company_wa: formData.get("invoice_company_wa"),
    invoice_company_web: formData.get("invoice_company_web"),
    invoice_company_npwp: formData.get("invoice_company_npwp"),
    invoice_qris_url: (formData.get("invoice_qris_url") as string) || null,
    invoice_footer_note: formData.get("invoice_footer_note"),
  });

  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      ...parsed.data,
      about_vision_id: parsed.data.about_vision_id || null,
      about_vision_en: parsed.data.about_vision_en || null,
      about_mission_id: parsed.data.about_mission_id || null,
      about_mission_en: parsed.data.about_mission_en || null,
      stats_text_id: parsed.data.stats_text_id || null,
      stats_text_en: parsed.data.stats_text_en || null,
      whatsapp_url: parsed.data.whatsapp_url || null,
      invoice_company_name: parsed.data.invoice_company_name || null,
      invoice_company_sub: parsed.data.invoice_company_sub || null,
      invoice_company_address: parsed.data.invoice_company_address || null,
      invoice_company_email: parsed.data.invoice_company_email || null,
      invoice_company_wa: parsed.data.invoice_company_wa || null,
      invoice_company_web: parsed.data.invoice_company_web || null,
      invoice_company_npwp: parsed.data.invoice_company_npwp || null,
      invoice_footer_note: parsed.data.invoice_footer_note || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: `Failed to save settings: ${error.message}` };

  revalidatePath("/", "layout");
  revalidatePath("/admin/dashboard/settings");
  return { success: true };
}

export interface TaxonomyActionState {
  error?: string;
}

/** Adds a new category. Used both in Settings and inline from the client form. */
export async function addCategoryAction(name: string): Promise<TaxonomyActionState> {
  const parsed = taxonomyItemSchema.safeParse({ name });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid name" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ name: parsed.data.name })
    .select()
    .single();

  if (error && error.code !== "23505") {
    // 23505 = unique_violation (category already exists) — treat as a no-op success
    return { error: `Failed to add category: ${error.message}` };
  }

  revalidatePath("/admin/dashboard/taxonomy");
  revalidatePath("/admin/dashboard/clients/new");
  return {};
}

/** Deletes a category from the suggestion list (does not affect existing clients). */
export async function deleteCategoryAction(id: string): Promise<TaxonomyActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: `Failed to delete category: ${error.message}` };

  revalidatePath("/admin/dashboard/taxonomy");
  return {};
}

/** Adds a new service. Used both in Settings and inline from the client form. */
export async function addServiceAction(name: string): Promise<TaxonomyActionState> {
  const parsed = taxonomyItemSchema.safeParse({ name });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid name" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .insert({ name: parsed.data.name })
    .select()
    .single();

  if (error && error.code !== "23505") {
    return { error: `Failed to add service: ${error.message}` };
  }

  revalidatePath("/admin/dashboard/taxonomy");
  revalidatePath("/admin/dashboard/clients/new");
  return {};
}

/** Deletes a service from the suggestion list (does not affect existing clients). */
export async function deleteServiceAction(id: string): Promise<TaxonomyActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: `Failed to delete service: ${error.message}` };

  revalidatePath("/admin/dashboard/taxonomy");
  return {};
}

/** Adds a new service with an explicit stage. Used by the Taxonomy admin page. */
export async function addServiceWithStageAction(
  name: string,
  stage: ServiceStage
): Promise<TaxonomyActionState> {
  const parsed = serviceItemSchema.safeParse({ name, stage });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .insert({ name: parsed.data.name, stage: parsed.data.stage })
    .select()
    .single();

  if (error && error.code !== "23505") {
    return { error: `Failed to add service: ${error.message}` };
  }

  revalidatePath("/admin/dashboard/taxonomy");
  revalidatePath("/admin/dashboard/clients/new");
  revalidatePath("/");
  return {};
}

/** Updates which stage (Strategy/Production/Growth) an existing service belongs to. */
export async function updateServiceStageAction(
  id: string,
  stage: ServiceStage
): Promise<TaxonomyActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("services").update({ stage }).eq("id", id);
  if (error) return { error: `Failed to update service: ${error.message}` };

  revalidatePath("/admin/dashboard/taxonomy");
  revalidatePath("/");
  return {};
}
