import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { CalendarEditor } from "@/components/admin/calendar-editor";
import { getCalendarById, getAllCalendarEntries, getCalendarRequests, getCalendarStrategies, getCommentsForEntries, getGlsEntries } from "@/lib/data/calendar";

export const metadata: Metadata = { title: "Kalender Konten" };
export const dynamic = "force-dynamic";

interface CalendarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CalendarDetailPage({ params }: CalendarDetailPageProps) {
  const { id } = await params;
  const calendar = await getCalendarById(id);
  if (!calendar) notFound();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const [entries, requests, strategies, glsEntries] = await Promise.all([
    getAllCalendarEntries(id),
    getCalendarRequests(id),
    getCalendarStrategies(id),
    getGlsEntries(id),
  ]);

  const commentsByEntry = await getCommentsForEntries(entries.map((e) => e.id));

  const shareUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://www.konteninyk.agency") + `/calendar/${calendar.share_token}`;

  return (
    <div className="space-y-6">
      <Link href="/admin/dashboard/calendars" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Semua Kalender
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kalender Konten</h1>
        <p className="mt-1 text-sm text-muted-foreground">Rencanakan, tinjau, dan bagikan jadwal konten kamu dengan {calendar.client_name}.</p>
      </div>

      <CalendarEditor
        calendar={calendar}
        entries={entries}
        requests={requests}
        strategies={strategies}
        commentsByEntry={commentsByEntry}
        glsEntries={glsEntries}
        initialYear={year}
        initialMonth={month}
        shareUrl={shareUrl}
      />
    </div>
  );
}
