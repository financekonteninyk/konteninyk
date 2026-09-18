import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvoiceForm } from "@/components/admin/invoice-form";
import { getInvoiceById, getBankAccounts, getInvoiceServices } from "@/lib/data/tools";
import { getClientsForInvoice } from "@/lib/data/clients";
import { getSiteSettings } from "@/lib/data/settings";
import { updateInvoiceAction } from "@/lib/actions/tools";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

export const dynamic = "force-dynamic";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { id } = await params;
  const [invoice, bankAccounts, settings, clients, services] = await Promise.all([
    getInvoiceById(id),
    getBankAccounts(),
    getSiteSettings(),
    getClientsForInvoice(),
    getInvoiceServices(),
  ]);

  if (!invoice) notFound();

  const boundAction = updateInvoiceAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Invoice</h1>
        <p className="mt-1 text-sm text-muted-foreground">{invoice.invoice_number}</p>
      </div>
      <InvoiceForm
        invoice={invoice}
        action={boundAction}
        bankAccounts={bankAccounts}
        settings={settings}
        clients={clients}
        services={services}
      />
    </div>
  );
}
