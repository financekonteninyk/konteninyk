import { createClient } from "@/lib/supabase/server";
import type { ActivityPhoto } from "@/types/activity";

/** Fetch all activity/BTS photos, in display order. */
export async function getActivityPhotos(): Promise<ActivityPhoto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_photos")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch activity photos:", error.message);
    return [];
  }

  return data ?? [];
}
