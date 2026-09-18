import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PricingCategoryForm } from "@/components/admin/pricing-category-form";
import { getPricingCategoryById } from "@/lib/data/pricing";
import { updatePricingCategoryAction } from "@/lib/actions/pricing";

export const metadata: Metadata = {
  title: "Edit Pricing Category",
};

export const dynamic = "force-dynamic";

interface EditPricingCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPricingCategoryPage({ params }: EditPricingCategoryPageProps) {
  const { id } = await params;
  const category = await getPricingCategoryById(id);

  if (!category) notFound();

  const boundAction = updatePricingCategoryAction.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Pricing Category</h1>
        <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>
      </div>
      <PricingCategoryForm category={category} action={boundAction} />
    </div>
  );
}
