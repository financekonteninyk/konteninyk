import type { Metadata } from "next";
import { PricingCategoryForm } from "@/components/admin/pricing-category-form";
import { createPricingCategoryAction } from "@/lib/actions/pricing";

export const metadata: Metadata = {
  title: "New Pricing Category",
};

export default function NewPricingCategoryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Pricing Category</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          e.g. "Content Packages", "Editing Only", "Personal Branding" — each with its own tiers.
        </p>
      </div>
      <PricingCategoryForm action={createPricingCategoryAction} />
    </div>
  );
}
