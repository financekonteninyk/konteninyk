import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvoiceById, getBankAccounts } from "@/lib/data/tools";
import { getSiteSettings } from "@/lib/data/settings";
import { PaymentConfirmationPrintView } from "@/components/admin/payment-confirmation-print-view";

export const metadata: Metadata = { title: "Payment Confirmation" };
export const dynamic = "force-dynamic";

interface PaymentConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentConfirmationPage({ params }: PaymentConfirmationPageProps) {
  const { id } = await params;
  const [invoice, bankAccounts, settings] = await Promise.all([
    getInvoiceById(id),
    getBankAccounts(),
    getSiteSettings(),
  ]);

  if (!invoice) notFound();

  const receivingBank = bankAccounts.find((b) => b.id === invoice.bank_account_id) ?? null;
  const companyName = settings.invoice_company_name || "Kontenin.yk";
  const companyContact = [settings.invoice_company_email, settings.invoice_company_wa].filter(Boolean).join("  •  ");

  return (
    <PaymentConfirmationPrintView
      invoiceNumber={invoice.invoice_number}
      clientName={invoice.client_name}
      clientCompany={invoice.client_company}
      clientEmail={invoice.client_email}
      clientWhatsapp={invoice.client_whatsapp}
      total={invoice.total}
      currency={invoice.currency}
      paymentPurpose={invoice.payment_purpose}
      paidDate={invoice.paid_date}
      transactionCode={invoice.transaction_code}
      senderBank={invoice.sender_bank}
      receivingBank={receivingBank}
      items={invoice.items}
      companyName={companyName}
      companyAddress={settings.invoice_company_address || "Yogyakarta, Indonesia"}
      companyLogoUrl={settings.site_logo_url}
      companyContact={companyContact}
    />
  );
}
