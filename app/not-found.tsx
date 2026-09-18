import Link from "next/link";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/data/settings";
import { pickText } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/get-locale";

export default async function NotFound() {
  const [settings, locale] = await Promise.all([getSiteSettings(), getLocale()]);
  const tagline = pickText(locale, settings.tagline_id, settings.tagline_en, settings.tagline);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} locale={locale} />
      <main className="flex flex-1 flex-col items-center justify-center py-32 text-center">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Back to Home</Link>
        </Button>
      </main>
      <SiteFooter tagline={tagline} locale={locale} settings={settings} />
    </div>
  );
}
