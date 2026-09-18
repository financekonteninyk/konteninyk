import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Cursor } from "@/components/shared/cursor";
import { ChatWidget } from "@/components/shared/chat-widget";
import { RevealText } from "@/components/shared/reveal-text";
import { VisionMission } from "@/components/about-page/vision-mission";
import { TimelineDisplay } from "@/components/about-page/timeline-display";
import { ValuesDisplay } from "@/components/about-page/values-display";
import { AwardsDisplay } from "@/components/about-page/awards-display";
import { GalleryDisplay } from "@/components/about-page/gallery-display";
import { ToolsDisplay } from "@/components/about-page/tools-display";
import { CtaSection } from "@/components/home/cta-section";
import { getSiteSettings } from "@/lib/data/settings";
import { getTimelineItems, getValues, getAwards, getGalleryImages, getTools } from "@/lib/data/about";
import { getChatQaEntries } from "@/lib/data/chat";
import { pickText } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Kontenin.yk — a Yogyakarta-based creative content agency helping brands build consistent, growth-driven digital identities.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [settings, timelineItems, values, awards, galleryImages, tools, locale, qaEntries] = await Promise.all([
    getSiteSettings(),
    getTimelineItems(),
    getValues(),
    getAwards(),
    getGalleryImages(),
    getTools(),
    getLocale(),
    getChatQaEntries(),
  ]);

  const tagline = pickText(locale, settings.tagline_id, settings.tagline_en, settings.tagline);
  const aboutText = pickText(locale, settings.about_text_id, settings.about_text_en, settings.about_text);
  const vision = pickText(locale, settings.about_vision_id, settings.about_vision_en, settings.about_vision ?? "") || null;
  const mission = pickText(locale, settings.about_mission_id, settings.about_mission_en, settings.about_mission ?? "") || null;

  return (
    <div className="flex min-h-screen flex-col">
      <Cursor />
      <SiteHeader settings={settings} locale={locale} />
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container">
            <span className="eyebrow mb-6 block text-xs text-muted-foreground">
              {t(locale, "about_us")}
            </span>
            <RevealText
              as="h1"
              text={aboutText}
              className="max-w-4xl text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl"
            />
          </div>
        </section>

        <VisionMission vision={vision} mission={mission} />
        <ValuesDisplay items={values} />
        <TimelineDisplay items={timelineItems} />
        <AwardsDisplay items={awards} />
        <GalleryDisplay items={galleryImages} />
        <ToolsDisplay items={tools} />
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
