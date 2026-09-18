import { createClient } from "@/lib/supabase/server";
import type { Video, VideoWithClient } from "@/types/video";

/** Fetch all videos belonging to published clients, newest first, for the homepage Gallery section. */
export async function getAllPublishedVideos(
  limit = 24,
  contentType?: "video" | "carousel"
): Promise<VideoWithClient[]> {
  const supabase = await createClient();
  let query = supabase
    .from("videos")
    .select("*, client:clients!inner(name, logo_url, status)")
    .eq("client.status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (contentType) query = query.eq("content_type", contentType);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch gallery videos:", error.message);
    return [];
  }

  return (data ?? []) as unknown as VideoWithClient[];
}

/** Fetch a random pool of videos belonging to published clients, for the hero gallery. */
export async function getRandomPublishedVideos(limit = 12): Promise<VideoWithClient[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*, client:clients!inner(name, logo_url, status)")
    .eq("client.status", "published")
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) {
    console.error("Failed to fetch videos for hero gallery:", error.message);
    return [];
  }

  const pool = (data ?? []) as unknown as VideoWithClient[];

  // Fisher-Yates shuffle so the gallery order differs on each visit.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }

  return pool.slice(0, limit);
}

/** Fetch all videos for a published client, ordered for public display. */
export async function getPublishedVideosByClientId(clientId: string): Promise<Video[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("client_id", clientId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch videos:", error.message);
    return [];
  }

  return (data ?? []) as Video[];
}

/** Fetch all videos for a client in the admin dashboard (any client status). */
export async function getAdminVideosByClientId(clientId: string): Promise<Video[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("client_id", clientId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch videos:", error.message);
    return [];
  }

  return (data ?? []) as Video[];
}

/** Fetch a single video by id for the admin edit form. */
export async function getAdminVideoById(id: string): Promise<Video | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch video:", error.message);
    return null;
  }

  return data as Video | null;
}

/** Count videos per client, used on the dashboard and client cards. */
export async function getVideoCountForClient(clientId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("videos")
    .select("*", { count: "exact", head: true })
    .eq("client_id", clientId);

  if (error) {
    console.error("Failed to count videos:", error.message);
    return 0;
  }

  return count ?? 0;
}
