import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvoiceById, getBankAccounts } from "@/lib/data/tools";
import { getSiteSettings } from "@/lib/data/settings";
import { InvoicePrintView } from "@/components/admin/invoice-print-view";

export const metadata: Metadata = {
  title: "Print Invoice",
};

export const dynamic = "force-dynamic";

interface PrintInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintInvoicePage({ params }: PrintInvoicePageProps) {
  const { id } = await params;
  const [invoice, bankAccounts, settings] = await Promise.all([
    getInvoiceById(id),
    getBankAccounts(),
    getSiteSettings(),
  ]);

  if (!invoice) notFound();

  const bankAccount = bankAccounts.find((b) => b.id === invoice.bank_account_id) ?? null;
  const clientContact = [invoice.client_whatsapp, invoice.client_email].filter(Boolean).join(" | ");
  const companyContact = [settings.invoice_company_email, settings.invoice_company_wa].filter(Boolean).join(" | ");

  return (
    <InvoicePrintView
      invoiceNumber={invoice.invoice_number}
      docType={invoice.doc_type}
      status={invoice.status}
      issueDate={invoice.issue_date}
      dueDate={invoice.due_date ?? ""}
      paymentPurpose={invoice.payment_purpose ?? ""}
      clientName={invoice.client_name}
      clientCompany={invoice.client_company ?? ""}
      clientContact={clientContact}
      clientLogoUrl={invoice.client_logo_url}
      agencyLogoUrl={settings.site_logo_url}
      companyName={settings.invoice_company_name || "Kontenin.yk"}
      companySub={settings.invoice_company_sub || "Creative Agency"}
      companyAddress={settings.invoice_company_address || "Yogyakarta, Indonesia"}
      companyContact={companyContact}
      items={invoice.items}
      currency={invoice.currency}
      discountPercent={invoice.discount_percent}
      taxPercent={invoice.tax_percent}
      bankAccount={bankAccount}
      showQris={invoice.show_qris}
      qrisUrl={settings.invoice_qris_url}
      footerNote={settings.invoice_footer_note || ""}
    />
  );
}
