import type { Metadata } from "next";
import { InvoiceForm } from "@/components/admin/invoice-form";
import { createInvoiceAction } from "@/lib/actions/tools";
import { getBankAccounts, getInvoiceServices } from "@/lib/data/tools";
import { getClientsForInvoice } from "@/lib/data/clients";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "New Invoice",
};

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const [bankAccounts, settings, clients, services] = await Promise.all([
    getBankAccounts(),
    getSiteSettings(),
    getClientsForInvoice(),
    getInvoiceServices(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Invoice</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fill in the details below.</p>
      </div>
      <InvoiceForm
        action={createInvoiceAction}
        bankAccounts={bankAccounts}
        settings={settings}
        clients={clients}
        services={services}
      />
    </div>
  );
}
