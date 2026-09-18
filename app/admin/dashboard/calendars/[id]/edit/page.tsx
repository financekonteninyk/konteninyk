import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { CalendarSettingsForm } from "@/components/admin/calendar-settings-form";
import { getCalendarById } from "@/lib/data/calendar";
import { getClientsForInvoice } from "@/lib/data/clients";
import { updateCalendarAction } from "@/lib/actions/calendar";

export const metadata: Metadata = { title: "Edit Kalender" };
export const dynamic = "force-dynamic";

interface EditCalendarPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCalendarPage({ params }: EditCalendarPageProps) {
  const { id } = await params;
  const [calendar, existingClients] = await Promise.all([getCalendarById(id), getClientsForInvoice()]);
  if (!calendar) notFound();

  const boundAction = updateCalendarAction.bind(null, id);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href={`/admin/dashboard/calendars/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Kembali ke Kalender
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Kalender</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ubah judul, strategi, atau warna personal kalender ini.</p>
      </div>

      <CalendarSettingsForm calendar={calendar} action={boundAction} existingClients={existingClients} />
    </div>
  );
}
