import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CalendarSettingsForm } from "@/components/admin/calendar-settings-form";
import { createCalendarAction } from "@/lib/actions/calendar";
import { getClientsForInvoice } from "@/lib/data/clients";

export const metadata: Metadata = { title: "Kalender Baru" };
export const dynamic = "force-dynamic";

export default async function NewCalendarPage() {
  const existingClients = await getClientsForInvoice();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/admin/dashboard/calendars" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Semua Kalender
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kalender Konten Baru</h1>
        <p className="mt-1 text-sm text-muted-foreground">Buat kalender yang persisten dan bisa dibagikan ke klien.</p>
      </div>

      <CalendarSettingsForm action={createCalendarAction} existingClients={existingClients} />
    </div>
  );
}
