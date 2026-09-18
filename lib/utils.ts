import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely, resolving conflicts (used by every UI primitive). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date string into a short, human-readable date. */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Slugify a string (used for generating friendly identifiers if needed). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Extract a YouTube video ID from a full URL (watch, youtu.be, or shorts links). */
export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/**
 * Resolves the single link a video card should open when clicked.
 * Prefers TikTok, then Instagram, then falls back to the client's gallery
 * page. YouTube is intentionally never used here — short-form platforms
 * (or the in-site gallery) are the priority for this interaction.
 */
export function getVideoPrimaryLink(
  video: { tiktok_url: string | null; instagram_url: string | null; client_id: string },
): { href: string; external: boolean } {
  if (video.tiktok_url) return { href: video.tiktok_url, external: true };
  if (video.instagram_url) return { href: video.instagram_url, external: true };
  return { href: `/client/${video.client_id}`, external: false };
}

/** Truncate text to a maximum length, appending an ellipsis if cut. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
