import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFreelancerOfferById } from "@/lib/data/documents";
import { getSiteSettings } from "@/lib/data/settings";
import { FreelancerOfferPrintView } from "@/components/admin/freelancer-offer-print-view";

export const metadata: Metadata = { title: "Print Offer" };
export const dynamic = "force-dynamic";

interface PrintOfferPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintOfferPage({ params }: PrintOfferPageProps) {
  const { id } = await params;
  const [offer, settings] = await Promise.all([getFreelancerOfferById(id), getSiteSettings()]);
  if (!offer) notFound();

  return (
    <FreelancerOfferPrintView
      offerNumber={offer.offer_number}
      freelancerName={offer.freelancer_name}
      jobTitle={offer.job_title}
      price={offer.price}
      specifications={offer.specifications ?? ""}
      projectDeadline={offer.project_deadline ?? ""}
      companyName={settings.invoice_company_name || "Kontenin.yk"}
      companyLogoUrl={settings.site_logo_url}
    />
  );
}
