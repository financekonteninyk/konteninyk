import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExpenseById } from "@/lib/data/documents";
import { getSiteSettings } from "@/lib/data/settings";
import { ExpensePrintView } from "@/components/admin/expense-print-view";

export const metadata: Metadata = { title: "Remittance Advice" };
export const dynamic = "force-dynamic";

interface PrintExpensePageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintExpensePage({ params }: PrintExpensePageProps) {
  const { id } = await params;
  const [expense, settings] = await Promise.all([getExpenseById(id), getSiteSettings()]);
  if (!expense) notFound();

  return (
    <ExpensePrintView
      voucherNumber={expense.voucher_number}
      paidTo={expense.paid_to}
      role={expense.role ?? ""}
      category={expense.category}
      workPeriod={expense.work_period ?? ""}
      description={expense.description ?? ""}
      personalNote={expense.personal_note ?? ""}
      amount={expense.amount}
      paymentDate={expense.payment_date}
      paymentMethod={expense.payment_method ?? ""}
      transactionCode={expense.transaction_code ?? ""}
      senderBank={expense.sender_bank ?? ""}
      receiverBank={expense.receiver_bank ?? ""}
      companyName={settings.invoice_company_name || "Kontenin.yk"}
      companyLogoUrl={settings.site_logo_url}
    />
  );
}
