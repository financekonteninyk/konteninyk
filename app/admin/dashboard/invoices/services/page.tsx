import type { Metadata } from "next";
import { ServicesCatalogManager } from "@/components/admin/services-catalog-manager";
import { getInvoiceServices } from "@/lib/data/tools";

export const metadata: Metadata = {
  title: "Service Price List",
};

export const dynamic = "force-dynamic";

export default async function InvoiceServicesPage() {
  const services = await getInvoiceServices();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Service Price List</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your standard services and rates — pick from these when adding line items to an invoice.
        </p>
      </div>
      <ServicesCatalogManager items={services} />
    </div>
  );
}
