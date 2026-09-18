import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, FileText } from "lucide-react";
import { getCalendarByShareToken, getCalendarStrategies } from "@/lib/data/calendar";

export const dynamic = "force-dynamic";

interface StrategyPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: StrategyPageProps): Promise<Metadata> {
  const { token } = await params;
  const calendar = await getCalendarByShareToken(token);
  return {
    title: calendar ? `Strategi — ${calendar.client_name}` : "Content Strategy",
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function StrategyPage({ params }: StrategyPageProps) {
  const { token } = await params;
  const calendar = await getCalendarByShareToken(token);
  if (!calendar) notFound();

  const strategies = await getCalendarStrategies(calendar.id);

  const customHsl = calendar.background_color ? hexToHslString(calendar.background_color) : null;
  const accentStyle = customHsl ? ({ "--primary": customHsl, "--ring": customHsl, "--accent": customHsl } as CSSProperties) : undefined;

  return (
    <div className="dark min-h-screen bg-background text-foreground" style={accentStyle}>
      {/* Premium hero header */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,hsl(var(--primary)/0.18),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-4xl px-5 py-12 sm:px-10 sm:py-20">
          <Link
            href={`/calendar/${token}`}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Kalender
          </Link>

          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            <Sparkles className="h-3 w-3" />
            Content Strategy
          </span>
          <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-5xl">{calendar.strategy_title || "Strategi & Arah Konten"}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{calendar.client_name}</p>
        </div>
      </div>

      {/* Documents */}
      <div className="mx-auto max-w-4xl space-y-6 px-5 py-10 sm:px-10 sm:py-16">
        {strategies.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            Belum ada dokumen strategi untuk kalender ini.
          </div>
        ) : (
          strategies.map((strategy) => (
            <article key={strategy.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/5 to-transparent px-6 py-5 sm:px-8">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <FileText className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold tracking-tight sm:text-xl">{strategy.title}</h2>
                  <p className="text-xs text-muted-foreground">Diperbarui {formatDate(strategy.updated_at)}</p>
                </div>
              </div>
              <div className="px-6 py-7 sm:px-8">
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">{strategy.content}</p>
              </div>
            </article>
          ))
        )}

        <p className="pt-4 text-center text-xs text-muted-foreground">
          Didukung oleh <span className="font-semibold">Kontenin.yk</span> — Creative Growth Agency
        </p>
      </div>
    </div>
  );
}
