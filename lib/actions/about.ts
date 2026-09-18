"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  timelineItemSchema,
  valueItemSchema,
  awardItemSchema,
  galleryItemSchema,
  toolItemSchema,
} from "@/lib/validations";

export interface TimelineActionState {
  error?: string;
}

/** Adds a new timeline item. Used by the admin Timeline manager. */
export async function addTimelineItemAction(
  year: string,
  title: string,
  description: string
): Promise<TimelineActionState> {
  const parsed = timelineItemSchema.safeParse({ year, title, description });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("about_timeline").insert({
    year: parsed.data.year,
    title: parsed.data.title,
    description: parsed.data.description || null,
  });

  if (error) return { error: `Failed to add timeline item: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Updates an existing timeline item. */
export async function updateTimelineItemAction(
  id: string,
  year: string,
  title: string,
  description: string
): Promise<TimelineActionState> {
  const parsed = timelineItemSchema.safeParse({ year, title, description });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("about_timeline")
    .update({
      year: parsed.data.year,
      title: parsed.data.title,
      description: parsed.data.description || null,
    })
    .eq("id", id);

  if (error) return { error: `Failed to update timeline item: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Deletes a timeline item. */
export async function deleteTimelineItemAction(id: string): Promise<TimelineActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("about_timeline").delete().eq("id", id);
  if (error) return { error: `Failed to delete timeline item: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Adds a new brand value. */
export async function addValueAction(title: string, description: string): Promise<TimelineActionState> {
  const parsed = valueItemSchema.safeParse({ title, description });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("about_values").insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
  });

  if (error) return { error: `Failed to add value: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Updates an existing brand value. */
export async function updateValueAction(
  id: string,
  title: string,
  description: string
): Promise<TimelineActionState> {
  const parsed = valueItemSchema.safeParse({ title, description });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("about_values")
    .update({ title: parsed.data.title, description: parsed.data.description || null })
    .eq("id", id);

  if (error) return { error: `Failed to update value: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Deletes a brand value. */
export async function deleteValueAction(id: string): Promise<TimelineActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("about_values").delete().eq("id", id);
  if (error) return { error: `Failed to delete value: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Adds a new award/achievement. */
export async function addAwardAction(
  title: string,
  issuer: string,
  year: string
): Promise<TimelineActionState> {
  const parsed = awardItemSchema.safeParse({ title, issuer, year });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("about_awards").insert({
    title: parsed.data.title,
    issuer: parsed.data.issuer || null,
    year: parsed.data.year || null,
  });

  if (error) return { error: `Failed to add award: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Updates an existing award/achievement. */
export async function updateAwardAction(
  id: string,
  title: string,
  issuer: string,
  year: string
): Promise<TimelineActionState> {
  const parsed = awardItemSchema.safeParse({ title, issuer, year });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("about_awards")
    .update({
      title: parsed.data.title,
      issuer: parsed.data.issuer || null,
      year: parsed.data.year || null,
    })
    .eq("id", id);

  if (error) return { error: `Failed to update award: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Deletes an award/achievement. */
export async function deleteAwardAction(id: string): Promise<TimelineActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("about_awards").delete().eq("id", id);
  if (error) return { error: `Failed to delete award: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Adds a new gallery image. */
export async function addGalleryImageAction(
  imageUrl: string,
  caption: string
): Promise<TimelineActionState> {
  const parsed = galleryItemSchema.safeParse({ image_url: imageUrl, caption });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("about_gallery").insert({
    image_url: parsed.data.image_url,
    caption: parsed.data.caption || null,
  });

  if (error) return { error: `Failed to add image: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Deletes a gallery image. */
export async function deleteGalleryImageAction(id: string): Promise<TimelineActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("about_gallery").delete().eq("id", id);
  if (error) return { error: `Failed to delete image: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Adds a new tool. */
export async function addToolAction(name: string, logoUrl: string | null): Promise<TimelineActionState> {
  const parsed = toolItemSchema.safeParse({ name, logo_url: logoUrl });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("about_tools").insert({
    name: parsed.data.name,
    logo_url: parsed.data.logo_url || null,
  });

  if (error) return { error: `Failed to add tool: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/** Deletes a tool. */
export async function deleteToolAction(id: string): Promise<TimelineActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("about_tools").delete().eq("id", id);
  if (error) return { error: `Failed to delete tool: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/about");
  return {};
}
