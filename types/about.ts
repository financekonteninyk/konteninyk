/** Row shape of the `about_timeline` table — one milestone in the brand journey. */
export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface TimelineItemInput {
  year: string;
  title: string;
  description: string | null;
  sort_order: number;
}

/** Row shape of the `about_values` table — a core brand value. */
export interface Value {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

/** Row shape of the `about_awards` table — a recognition or achievement. */
export interface Award {
  id: string;
  title: string;
  issuer: string | null;
  year: string | null;
  sort_order: number;
  created_at: string;
}

/** Row shape of the `about_gallery` table — a behind-the-scenes photo. */
export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

/** Row shape of the `about_tools` table — a tool/software used by the team. */
export interface Tool {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
  created_at: string;
}
