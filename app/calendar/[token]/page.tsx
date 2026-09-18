import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { getCalendarByShareToken, getAllCalendarEntries, getCalendarRequests, getCalendarStrategies, getCommentsForEntries, getGlsEntries } from "@/lib/data/calendar";
import { PublicCalendarViewer } from "@/components/public/public-calendar-viewer";
import { FloatingMetricsWidget } from "@/components/public/floating-metrics-widget";
import { ContentSummaryList } from "@/components/public/content-summary-list";
import { RequestContentCta } from "@/components/public/request-content-cta";
import { StrategyShowcaseCard } from "@/components/public/strategy-showcase-card";
import { CollaborationDetailCard } from "@/components/public/collaboration-detail-card";
import { GlsSection } from "@/components/public/gls-section";
import { CfsSidebar, CfsMobileNav } from "@/components/public/cfs-sidebar";

export const dynamic = "force-dynamic";

interface PublicCalendarPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PublicCalendarPageProps): Promise<Metadata> {
  const { token } = await params;
  const calendar = await getCalendarByShareToken(token);
  return {
    title: calendar ? `${calendar.client_name} — CFS by Kontenin.yk` : "CFS — Content Flow System",
    robots: { index: false, follow: false },
  };
}

function hexToHslString(hex: string): string | null {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (full.length !== 6) return null;

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default async function PublicCalendarPage({ params }: PublicCalendarPageProps) {
  const { token } = await params;
  const calendar = await getCalendarByShareToken(token);
  if (!calendar) notFound();

  const [entries, requests, strategies, glsEntries] = await Promise.all([
    getAllCalendarEntries(calendar.id),
    getCalendarRequests(calendar.id),
    getCalendarStrategies(calendar.id),
    getGlsEntries(calendar.id),
  ]);

  const commentsByEntry = await getCommentsForEntries(entries.map((e) => e.id));

  const customHsl = calendar.background_color ? hexToHslString(calendar.background_color) : null;
  const accentStyle = customHsl
    ? ({
        "--primary": customHsl,
        "--ring": customHsl,
        "--accent": customHsl,
      } as CSSProperties)
    : undefined;

  return (
    <div className="dark min-h-screen bg-background text-foreground" style={accentStyle}>
      <div className="flex min-h-screen">
        <CfsSidebar />

        <div className="flex-1">
          {/* Header */}
          <div className="border-b border-border">
            <div className="flex items-center justify-between px-5 py-4 sm:px-10">
              <div className="flex items-center gap-3">
                {calendar.client_logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={calendar.client_logo_url}
                    alt={calendar.client_name}
                    className="h-9 w-9 rounded-lg border border-border object-contain p-1"
                  />
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    CFS <span className="font-normal normal-case tracking-normal text-muted-foreground/70">Content Flow System</span>
                  </p>
                  <h1 className="text-base font-bold leading-tight sm:text-lg">{calendar.client_name}</h1>
                </div>
              </div>
              <a
                href="https://www.konteninyk.agency"
                target="_blank"
                rel="noreferrer noopener"
                className="hidden items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
              >
                konteninyk.agency
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="space-y-8 px-5 py-6 pb-24 sm:px-10 sm:py-8 lg:pb-8">
            {/* Strategy — luxurious showcase, above the calendar */}
            <section id="strategy" className="scroll-mt-6">
              <StrategyShowcaseCard strategies={strategies} shareToken={token} title={calendar.strategy_title} />
            </section>

            {/* Calendar (left) + Upcoming Content & Requests (right) side by side */}
            <section id="calendar" className="scroll-mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
                <PublicCalendarViewer entries={entries} commentsByEntry={commentsByEntry} calendarId={calendar.id} />
              </div>

              <div id="content" className="scroll-mt-6 space-y-4">
                <ContentSummaryList calendarId={calendar.id} entries={entries} />
                <RequestContentCta calendarId={calendar.id} requests={requests} />
                <CollaborationDetailCard calendar={calendar} />
                <GlsSection calendarId={calendar.id} entries={glsEntries} />
              </div>
            </section>

            <p className="pt-2 text-center text-xs text-muted-foreground">
              Powered by <span className="font-semibold">Kontenin.yk</span> — Creative Growth Agency
            </p>
          </div>
        </div>
      </div>

      <CfsMobileNav />
      <FloatingMetricsWidget calendar={calendar} entries={entries} />

      {calendar.whatsapp_number && (
        <a
          href={calendar.whatsapp_number}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat via WhatsApp"
          className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-105 lg:bottom-5"
        >
          <MessageCircle className="h-6 w-6" fill="currentColor" strokeWidth={0} />
        </a>
      )}
    </div>
  );
}
