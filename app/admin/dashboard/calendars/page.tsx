import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { getCalendars } from "@/lib/data/calendar";

export const metadata: Metadata = { title: "CFS — Content Flow System" };
export const dynamic = "force-dynamic";

export default async function CalendarsPage() {
  const calendars = await getCalendars();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CFS — Content Flow System</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your content workflow, connected. Rencanakan dan bagikan jadwal konten ke klien kamu.</p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/calendars/new">
            <Plus className="h-4 w-4" /> Kalender Baru
          </Link>
        </Button>
      </div>

      {calendars.length === 0 ? (
        <EmptyState
          title="Belum ada kalender"
          description="Buat kalender konten pertama kamu untuk seorang klien."
          action={
            <Button asChild>
              <Link href="/admin/dashboard/calendars/new">
                <Plus className="h-4 w-4" /> Kalender Baru
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calendars.map((cal) => (
            <Link
              key={cal.id}
              href={`/admin/dashboard/calendars/${cal.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-border p-5 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-center gap-3">
                {cal.client_logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cal.client_logo_url} alt={cal.client_name} className="h-10 w-10 rounded-xl border border-border object-contain" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                )}
                <p className="font-medium">{cal.client_name}</p>
              </div>
              {cal.strategy_note && <p className="line-clamp-2 text-sm text-muted-foreground">{cal.strategy_note}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
