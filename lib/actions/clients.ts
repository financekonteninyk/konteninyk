"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { clientFormSchema } from "@/lib/validations";

export interface ClientActionState {
  error?: string;
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

function buildPayload(formData: FormData) {
  return {
    name: formData.get("name"),
    logo_url: (formData.get("logo_url") as string) || null,
    cover_thumbnail_url: (formData.get("cover_thumbnail_url") as string) || null,
    category: formData.get("category"),
    industry: formData.get("industry"),
    description: formData.get("description"),
    period: formData.get("period"),
    services: formData.getAll("services") as string[],
    brand_color: formData.get("brand_color"),
    website_url: formData.get("website_url"),
    instagram_url: formData.get("instagram_url"),
    tiktok_url: formData.get("tiktok_url"),
    youtube_url: formData.get("youtube_url"),
    featured: formData.get("featured") === "true",
    sort_order: formData.get("sort_order") || 0,
    city: formData.get("city"),
    whatsapp_number: formData.get("whatsapp_number"),
    status: formData.get("status"),
    case_study_challenge: formData.get("case_study_challenge"),
    case_study_strategy: formData.get("case_study_strategy"),
    case_study_production: formData.get("case_study_production"),
    case_study_result: formData.get("case_study_result"),
  };
}

function normalize(data: ReturnType<typeof clientFormSchema.parse>) {
  return {
    ...data,
    industry: data.industry || null,
    period: data.period || null,
    brand_color: data.brand_color || null,
    website_url: data.website_url || null,
    instagram_url: data.instagram_url || null,
    tiktok_url: data.tiktok_url || null,
    youtube_url: data.youtube_url || null,
    city: data.city || null,
    whatsapp_number: data.whatsapp_number || null,
    case_study_challenge: data.case_study_challenge || null,
    case_study_strategy: data.case_study_strategy || null,
    case_study_production: data.case_study_production || null,
    case_study_result: data.case_study_result || null,
  };
}

/** Creates a new client. Redirects to the clients list on success. */
export async function createClientAction(
  _prevState: ClientActionState,
  formData: FormData
): Promise<ClientActionState> {
  const parsed = clientFormSchema.safeParse(buildPayload(formData));

  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert(normalize(parsed.data));

  if (error) return { error: `Failed to create client: ${error.message}` };

  revalidatePath("/admin/dashboard/clients");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard/clients");
}

/** Updates an existing client by id. Redirects to the clients list on success. */
export async function updateClientAction(
  id: string,
  _prevState: ClientActionState,
  formData: FormData
): Promise<ClientActionState> {
  const parsed = clientFormSchema.safeParse(buildPayload(formData));

  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({ ...normalize(parsed.data), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: `Failed to update client: ${error.message}` };

  revalidatePath("/admin/dashboard/clients");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/client/${id}`);
  revalidatePath("/");
  redirect("/admin/dashboard/clients");
}

/** Deletes a client by id (cascades to its videos). Used by the delete confirmation dialog. */
export async function deleteClientAction(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) return { error: `Failed to delete client: ${error.message}` };

  revalidatePath("/admin/dashboard/clients");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  return {};
}
