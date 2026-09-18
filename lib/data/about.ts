import { createClient } from "@/lib/supabase/server";
import type { TimelineItem, Value, Award, GalleryImage, Tool } from "@/types/about";

/** Fetch all timeline items, ordered for display. */
export async function getTimelineItems(): Promise<TimelineItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_timeline")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("year", { ascending: true });

  if (error) {
    console.error("Failed to fetch timeline items:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch all brand values, ordered for display. */
export async function getValues(): Promise<Value[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_values")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch values:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch all awards/achievements, ordered for display. */
export async function getAwards(): Promise<Award[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_awards")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch awards:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch all gallery images, ordered for display. */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_gallery")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch gallery images:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch all tools, ordered for display. */
export async function getTools(): Promise<Tool[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_tools")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch tools:", error.message);
    return [];
  }

  return data ?? [];
}
