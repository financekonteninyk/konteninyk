import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FreelancerOfferForm } from "@/components/admin/freelancer-offer-form";
import { getFreelancerOfferById } from "@/lib/data/documents";
import { updateFreelancerOfferAction } from "@/lib/actions/documents";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Edit Offer" };
export const dynamic = "force-dynamic";

interface EditOfferPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFreelancerOfferPage({ params }: EditOfferPageProps) {
  const { id } = await params;
  const [offer, settings] = await Promise.all([getFreelancerOfferById(id), getSiteSettings()]);
  if (!offer) notFound();

  const boundAction = updateFreelancerOfferAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Offer</h1>
        <p className="mt-1 text-sm text-muted-foreground">{offer.offer_number}</p>
      </div>
      <FreelancerOfferForm offer={offer} action={boundAction} settings={settings} />
    </div>
  );
}
