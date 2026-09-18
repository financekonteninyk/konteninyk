import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpenseForm } from "@/components/admin/expense-form";
import { getExpenseById } from "@/lib/data/documents";
import { updateExpenseAction } from "@/lib/actions/documents";
import { getSiteSettings } from "@/lib/data/settings";
import { getChipSuggestions } from "@/lib/data/chip-suggestions";

export const metadata: Metadata = { title: "Edit Expense" };
export const dynamic = "force-dynamic";

interface EditExpensePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = await params;
  const [expense, settings, category, paidTo, role, paymentMethod] = await Promise.all([
    getExpenseById(id),
    getSiteSettings(),
    getChipSuggestions("expense_category"),
    getChipSuggestions("expense_paid_to"),
    getChipSuggestions("expense_role"),
    getChipSuggestions("expense_payment_method"),
  ]);
  if (!expense) notFound();

  const boundAction = updateExpenseAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Expense</h1>
        <p className="mt-1 text-sm text-muted-foreground">{expense.voucher_number}</p>
      </div>
      <ExpenseForm
        expense={expense}
        action={boundAction}
        settings={settings}
        savedSuggestions={{ category, paidTo, role, paymentMethod }}
      />
    </div>
  );
}
