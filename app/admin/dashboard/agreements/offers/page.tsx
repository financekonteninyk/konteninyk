import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Printer, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteOfferButton } from "@/components/admin/delete-offer-button";
import { getFreelancerOffers } from "@/lib/data/documents";
import { OFFER_STATUS_LABELS } from "@/types/documents";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Freelancer Offers" };
export const dynamic = "force-dynamic";

const BADGE_VARIANT = { draft: "secondary", sent: "warning", accepted: "success", declined: "destructive" } as const;

export default async function FreelancerOffersPage() {
  const offers = await getFreelancerOffers();

  return (
    <div className="space-y-6">
      <Link href="/admin/dashboard/agreements" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Agreements
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Freelancer Offers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Rate, scope, and deadline — sent before work begins.</p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/agreements/offers/new">
            <Plus className="h-4 w-4" /> New Offer
          </Link>
        </Button>
      </div>

      {offers.length === 0 ? (
        <EmptyState
          title="No offers yet"
          description="Create one when you're ready to bring a freelancer onto a project."
          action={
            <Button asChild>
              <Link href="/admin/dashboard/agreements/offers/new">
                <Plus className="h-4 w-4" /> New Offer
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {offers.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{o.job_title}</p>
                  <Badge variant={BADGE_VARIANT[o.status]}>{OFFER_STATUS_LABELS[o.status]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {o.freelancer_name} · {o.offer_number}
                  {o.project_deadline && <> · Due {formatDate(o.project_deadline)}</>}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/dashboard/agreements/offers/${o.id}/print`} target="_blank">
                    <Printer className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/dashboard/agreements/offers/${o.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteOfferButton id={o.id} label={o.job_title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
