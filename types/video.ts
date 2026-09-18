export const VIDEO_PLATFORMS = ["instagram", "tiktok", "youtube", "other"] as const;
export type VideoPlatform = (typeof VIDEO_PLATFORMS)[number];

export const PLATFORM_LABELS: Record<VideoPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  other: "Other",
};

export const CONTENT_TYPES = ["video", "carousel"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  video: "Video",
  carousel: "Carousel",
};

/** Row shape as stored in Supabase `videos` table — belongs to one Client. */
export interface Video {
  id: string;
  client_id: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string; // portrait image — first slide for carousels
  content_type: ContentType;
  carousel_images: string[]; // additional slides, only used when content_type === "carousel"
  platform: VideoPlatform | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  views_count: number | null;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Payload used when creating or updating a video from the dashboard form. */
export interface VideoInput {
  client_id: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string;
  content_type: ContentType;
  carousel_images: string[];
  platform: VideoPlatform | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  views_count: number | null;
  tags: string[];
}

/** A video with its parent client's name/logo attached — used in the hero gallery. */
export interface VideoWithClient extends Video {
  client: {
    name: string;
    logo_url: string | null;
  };
}
