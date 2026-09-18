import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingCategoriesList } from "@/components/admin/pricing-categories-list";
import { EmptyState } from "@/components/shared/empty-state";
import { getAllPricingCategories } from "@/lib/data/pricing";

export const metadata: Metadata = {
  title: "Pricing",
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const categories = await getAllPricingCategories();

  return (
    <div className="space-y-6">
      <Link href="/admin/dashboard/finance" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Finance
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your price lists — shown on the public Pricing page and reusable for invoices.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/pricing/new">
            <Plus className="h-4 w-4" />
            New Category
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No pricing categories yet"
          description="Create your first price list — e.g. Content Packages, Editing Only, Personal Branding."
          action={
            <Button asChild>
              <Link href="/admin/dashboard/pricing/new">
                <Plus className="h-4 w-4" />
                New Category
              </Link>
            </Button>
          }
        />
      ) : (
        <PricingCategoriesList categories={categories} />
      )}
    </div>
  );
}
