import type { Metadata } from "next";
import { FreelancerOfferForm } from "@/components/admin/freelancer-offer-form";
import { createFreelancerOfferAction } from "@/lib/actions/documents";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "New Offer" };
export const dynamic = "force-dynamic";

export default async function NewFreelancerOfferPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Freelancer Offer</h1>
        <p className="mt-1 text-sm text-muted-foreground">Rate, job scope, and deadline in one document.</p>
      </div>
      <FreelancerOfferForm action={createFreelancerOfferAction} settings={settings} />
    </div>
  );
}
