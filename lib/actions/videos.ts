"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { videoFormSchema } from "@/lib/validations";
import type { VideoPlatform } from "@/types/video";

export interface VideoActionState {
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

function buildPayload(clientId: string, formData: FormData) {
  const tagsRaw = (formData.get("tags") as string) || "";
  return {
    client_id: clientId,
    title: formData.get("title"),
    description: formData.get("description"),
    thumbnail_url: formData.get("thumbnail_url"),
    content_type: (formData.get("content_type") as string) || "video",
    carousel_images: formData.getAll("carousel_images") as string[],
    platform: (formData.get("platform") as string) || null,
    instagram_url: formData.get("instagram_url"),
    tiktok_url: formData.get("tiktok_url"),
    youtube_url: formData.get("youtube_url"),
    views_count: (formData.get("views_count") as string) || null,
    tags: tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

function normalize(data: ReturnType<typeof videoFormSchema.parse>) {
  return {
    ...data,
    title: data.title || null,
    description: data.description || null,
    platform: (data.platform ?? null) as VideoPlatform | null,
    instagram_url: data.instagram_url || null,
    tiktok_url: data.tiktok_url || null,
    youtube_url: data.youtube_url || null,
    views_count: data.views_count ?? null,
  };
}

/** Creates a new video under a client. Redirects to that client's video list on success. */
export async function createVideoAction(
  clientId: string,
  _prevState: VideoActionState,
  formData: FormData
): Promise<VideoActionState> {
  const parsed = videoFormSchema.safeParse(buildPayload(clientId, formData));

  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("videos").insert(normalize(parsed.data));

  if (error) return { error: `Failed to create video: ${error.message}` };

  revalidatePath(`/admin/dashboard/clients/${clientId}/videos`);
  revalidatePath(`/client/${clientId}`);
  redirect(`/admin/dashboard/clients/${clientId}/videos`);
}

/** Updates an existing video by id. */
export async function updateVideoAction(
  videoId: string,
  clientId: string,
  _prevState: VideoActionState,
  formData: FormData
): Promise<VideoActionState> {
  const parsed = videoFormSchema.safeParse(buildPayload(clientId, formData));

  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("videos")
    .update({ ...normalize(parsed.data), updated_at: new Date().toISOString() })
    .eq("id", videoId);

  if (error) return { error: `Failed to update video: ${error.message}` };

  revalidatePath(`/admin/dashboard/clients/${clientId}/videos`);
  revalidatePath(`/client/${clientId}`);
  redirect(`/admin/dashboard/clients/${clientId}/videos`);
}

/** Deletes a video by id. Used by the delete confirmation dialog. */
export async function deleteVideoAction(
  videoId: string,
  clientId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("videos").delete().eq("id", videoId);

  if (error) return { error: `Failed to delete video: ${error.message}` };

  revalidatePath(`/admin/dashboard/clients/${clientId}/videos`);
  revalidatePath(`/client/${clientId}`);
  return {};
}
