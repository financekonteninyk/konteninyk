"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { activityPhotoSchema } from "@/lib/validations";

export interface ActivityActionState {
  error?: string;
}

/** Adds an activity/BTS photo. */
export async function addActivityPhotoAction(imageUrl: string, caption: string): Promise<ActivityActionState> {
  const parsed = activityPhotoSchema.safeParse({ image_url: imageUrl, caption });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("activity_photos").insert({
    image_url: parsed.data.image_url,
    caption: parsed.data.caption || null,
  });

  if (error) return { error: `Failed to add photo: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/");
  return {};
}

/** Deletes an activity/BTS photo. */
export async function deleteActivityPhotoAction(id: string): Promise<ActivityActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("activity_photos").delete().eq("id", id);
  if (error) return { error: `Failed to delete photo: ${error.message}` };

  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/");
  return {};
}
