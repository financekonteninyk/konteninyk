import type { Metadata } from "next";
import Link from "next/link";
import { Building2, PlayCircle, CheckCircle2, Wallet, Link2 } from "lucide-react";
import { getDashboardStats } from "@/lib/data/settings";
import { getAdminNotes, getEditingStandards } from "@/lib/data/tools";
import { getClientsForDashboard } from "@/lib/data/clients";
import { getSiteSettings } from "@/lib/data/settings";
import { getFinanceSummary } from "@/lib/data/finance";
import { StatCard } from "@/components/admin/stat-card";
import { RecentClients } from "@/components/admin/recent-clients";
import { NotesWidget } from "@/components/admin/notes-widget";
import { EditingStandardsWidget } from "@/components/admin/editing-standards-widget";
import { ClientContactsPanel } from "@/components/admin/client-contacts-panel";
import { DashboardHero } from "@/components/admin/dashboard-hero";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export default async function DashboardPage() {
  const [stats, clients, notes, standards, settings, finance] = await Promise.all([
    getDashboardStats(),
    getClientsForDashboard(),
    getAdminNotes(),
    getEditingStandards(),
    getSiteSettings(),
    getFinanceSummary(),
  ]);

  return (
    <div className="space-y-8">
      <DashboardHero logoUrl={settings.site_logo_url} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Clients" value={stats.totalClients} icon={Building2} accent="primary" />
        <StatCard label="Total Videos" value={stats.totalVideos} icon={PlayCircle} accent="amber" />
        <StatCard
          label="Published Clients"
          value={stats.publishedClients}
          icon={CheckCircle2}
          accent="emerald"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link
          href="/admin/dashboard/finance"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">Finance</p>
            <p className="text-sm text-muted-foreground">
              Balance: <span className="font-semibold text-foreground">{formatIDR(finance.balance)}</span> — invoices, expenses & pricing
            </p>
          </div>
        </Link>
        <Link
          href="/admin/dashboard/tools"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Link2 className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">Tools & Links</p>
            <p className="text-sm text-muted-foreground">Drive folders, VFX assets, schedules</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <NotesWidget items={notes} />
        <ClientContactsPanel clients={clients} />
      </div>

      <EditingStandardsWidget items={standards} />

      <RecentClients clients={stats.recentClients} />
    </div>
  );
}
