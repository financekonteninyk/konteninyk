import { Suspense } from "react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Cursor } from "@/components/shared/cursor";
import { ChatWidget } from "@/components/shared/chat-widget";
import { Hero } from "@/components/home/hero";
import { StatsLine } from "@/components/home/stats-line";
import { GallerySection } from "@/components/home/gallery-section";
import { ProcessSection } from "@/components/home/process-section";
import { ServicesSection } from "@/components/home/services-section";
import { TrustedBySection } from "@/components/home/trusted-by";
import { AboutSection } from "@/components/home/about-section";
import { PortfolioSection } from "@/components/portfolio/portfolio-section";
import { CtaSection } from "@/components/home/cta-section";
import { Skeleton } from "@/components/ui/skeleton";
import { getSiteSettings } from "@/lib/data/settings";
import { getRandomPublishedVideos } from "@/lib/data/videos";
import { getChatQaEntries } from "@/lib/data/chat";
import { getActivityPhotos } from "@/lib/data/activity";
import { pickText } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/get-locale";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Deliberately NOT awaiting `searchParams` here. Reading a dynamic API
  // like searchParams at the page level opts the *entire* route out of
  // static rendering — every single visit re-fetches everything below,
  // even sections that never change between requests. Passing the raw
  // promise down to PortfolioSection (already Suspense-wrapped) keeps that
  // dynamic cost scoped to just the part that actually needs it — page
  // navigation should feel noticeably snappier as a result.
  const [settings, previewVideos, locale, qaEntries, activityPhotos] = await Promise.all([
    getSiteSettings(),
    getRandomPublishedVideos(12),
    getLocale(),
    getChatQaEntries(),
    getActivityPhotos(),
  ]);
  const tagline = pickText(locale, settings.tagline_id, settings.tagline_en, settings.tagline);
  const aboutText = pickText(locale, settings.about_text_id, settings.about_text_en, settings.about_text);
  const statsText = pickText(locale, settings.stats_text_id, settings.stats_text_en, "");

  return (
    <div className="flex min-h-screen flex-col">
      <Cursor />
      <SiteHeader settings={settings} locale={locale} />
      <main className="flex-1">
        <Hero settings={settings} previewVideos={previewVideos} locale={locale} activityPhotos={activityPhotos} />
        <div className="border-t border-border py-6">
          <StatsLine text={statsText || null} />
        </div>
        <TrustedBySection locale={locale} />
        <GallerySection locale={locale} />
        <Suspense fallback={<PortfolioSkeleton />}>
          <PortfolioSection searchParams={searchParams} />
        </Suspense>
        <ProcessSection locale={locale} glsIconUrl={settings.gls_icon_url} />
        <ServicesSection locale={locale} />
        <AboutSection aboutText={aboutText} locale={locale} />
        <CtaSection tagline={tagline} locale={locale} whatsappUrl={settings.whatsapp_url} />
      </main>
      <SiteFooter tagline={tagline} locale={locale} settings={settings} />
      <ChatWidget
        whatsappUrl={settings.whatsapp_url}
        locale={locale}
        botLogoUrl={settings.chat_bot_logo_url}
        qaEntries={qaEntries}
      />
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <Skeleton className="mb-3 h-9 w-64" />
        <Skeleton className="mb-10 h-5 w-96 max-w-full" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[360px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}
