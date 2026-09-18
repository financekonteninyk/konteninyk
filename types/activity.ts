/** Row shape of the `activity_photos` table — reusable BTS carousel across the site. */
export interface ActivityPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}
