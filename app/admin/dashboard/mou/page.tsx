import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Printer, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteMouButton } from "@/components/admin/delete-mou-button";
import { getMouDocuments } from "@/lib/data/documents";
import { MOU_STATUS_LABELS } from "@/types/documents";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "MOU Documents" };
export const dynamic = "force-dynamic";

const BADGE_VARIANT = { draft: "secondary", sent: "warning", signed: "success" } as const;

export default async function MouPage() {
  const documents = await getMouDocuments();

  return (
    <div className="space-y-6">
      <Link href="/admin/dashboard/agreements" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Agreements
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">MOU Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">Agreements for clients and freelancers, ready to print and sign.</p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/mou/new">
            <Plus className="h-4 w-4" /> New MOU
          </Link>
        </Button>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title="No MOU documents yet"
          description="Create one for a client project or a freelancer collaboration."
          action={
            <Button asChild>
              <Link href="/admin/dashboard/mou/new">
                <Plus className="h-4 w-4" /> New MOU
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {documents.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{m.project_title}</p>
                  <Badge variant={BADGE_VARIANT[m.status]}>{MOU_STATUS_LABELS[m.status]}</Badge>
                  <Badge variant="outline">{m.party_type === "client" ? "Client" : "Freelancer"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {m.party_name} · {m.mou_number} · {formatDate(m.effective_date)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/dashboard/mou/${m.id}/print`} target="_blank">
                    <Printer className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/dashboard/mou/${m.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteMouButton id={m.id} label={m.project_title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
