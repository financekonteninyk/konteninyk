export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "id";
export const LOCALE_COOKIE = "kontenin_locale";

/** Picks the right language value from a bilingual DB field, with graceful fallbacks. */
export function pickText(
  locale: Locale,
  id: string | null | undefined,
  en: string | null | undefined,
  fallback = ""
): string {
  if (locale === "en") return en || id || fallback;
  return id || en || fallback;
}
