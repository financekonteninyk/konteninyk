import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Printer, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteProposalButton } from "@/components/admin/delete-proposal-button";
import { getProposals } from "@/lib/data/documents";
import { PROPOSAL_STATUS_LABELS } from "@/types/documents";

export const metadata: Metadata = { title: "Proposals" };
export const dynamic = "force-dynamic";

const BADGE_VARIANT = {
  draft: "secondary",
  sent: "warning",
  accepted: "success",
  declined: "destructive",
} as const;

export default async function ProposalsPage() {
  const proposals = await getProposals();

  return (
    <div className="space-y-6">
      <Link href="/admin/dashboard/agreements" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Agreements
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Proposals</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Concept, strategy, and pricing — sent to prospective clients.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/proposals/new">
            <Plus className="h-4 w-4" /> New Proposal
          </Link>
        </Button>
      </div>

      {proposals.length === 0 ? (
        <EmptyState
          title="No proposals yet"
          description="Create your first one after a client discovery conversation."
          action={
            <Button asChild>
              <Link href="/admin/dashboard/proposals/new">
                <Plus className="h-4 w-4" /> New Proposal
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{p.project_title}</p>
                  <Badge variant={BADGE_VARIANT[p.status]}>{PROPOSAL_STATUS_LABELS[p.status]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {p.client_name} · {p.proposal_number}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/dashboard/proposals/${p.id}/print`} target="_blank">
                    <Printer className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/dashboard/proposals/${p.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteProposalButton id={p.id} title={p.project_title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
