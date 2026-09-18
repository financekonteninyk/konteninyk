import type { Metadata } from "next";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { ServiceManager } from "@/components/admin/service-manager";
import { getCategories, getServices } from "@/lib/data/settings";
import {
  addCategoryAction,
  deleteCategoryAction,
  addServiceWithStageAction,
  deleteServiceAction,
  updateServiceStageAction,
} from "@/lib/actions/settings";

export const metadata: Metadata = {
  title: "Categories & Services",
};

export const dynamic = "force-dynamic";

export default async function TaxonomyPage() {
  const [categories, services] = await Promise.all([getCategories(), getServices()]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories & Services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the reusable lists offered when creating or editing a client. Removing an item
          here doesn&apos;t affect clients that already use it.
        </p>
      </div>

      <TaxonomyManager
        title="Categories"
        description="Client categories, e.g. F&B, Property, Digital Marketing."
        items={categories}
        onAdd={addCategoryAction}
        onDelete={deleteCategoryAction}
      />

      <ServiceManager
        services={services}
        onAdd={addServiceWithStageAction}
        onDelete={deleteServiceAction}
        onUpdateStage={updateServiceStageAction}
      />
    </div>
  );
}
