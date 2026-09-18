export const CLIENT_STATUSES = ["draft", "published", "archived"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const STATUS_LABELS: Record<ClientStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

/** Row shape as stored in Supabase `clients` table (one page per brand). */
export interface Client {
  id: string;
  name: string;
  logo_url: string | null;
  cover_thumbnail_url: string | null;
  category: string;
  industry: string | null;
  description: string;
  period: string | null;
  services: string[];
  brand_color: string | null;
  website_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  featured: boolean;
  status: ClientStatus;
  sort_order: number;
  city: string | null;
  whatsapp_number: string | null;
  case_study_challenge: string | null;
  case_study_strategy: string | null;
  case_study_production: string | null;
  case_study_result: string | null;
  created_at: string;
  updated_at: string;
}

/** Payload used when creating or updating a client from the dashboard form. */
export interface ClientInput {
  name: string;
  logo_url: string | null;
  cover_thumbnail_url: string | null;
  category: string;
  industry: string | null;
  description: string;
  period: string | null;
  services: string[];
  brand_color: string | null;
  website_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  featured: boolean;
  status: ClientStatus;
  sort_order: number;
  city: string | null;
  whatsapp_number: string | null;
  case_study_challenge: string | null;
  case_study_strategy: string | null;
  case_study_production: string | null;
  case_study_result: string | null;
}

/** A client with its published video count, used in list views. */
export interface ClientWithStats extends Client {
  video_count: number;
}
