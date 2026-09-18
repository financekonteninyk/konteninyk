import type { Metadata } from "next";
import { ExpenseForm } from "@/components/admin/expense-form";
import { createExpenseAction } from "@/lib/actions/documents";
import { getSiteSettings } from "@/lib/data/settings";
import { getChipSuggestions } from "@/lib/data/chip-suggestions";

export const metadata: Metadata = { title: "Record Expense" };
export const dynamic = "force-dynamic";

export default async function NewExpensePage() {
  const [settings, category, paidTo, role, paymentMethod] = await Promise.all([
    getSiteSettings(),
    getChipSuggestions("expense_category"),
    getChipSuggestions("expense_paid_to"),
    getChipSuggestions("expense_role"),
    getChipSuggestions("expense_payment_method"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Record Expense</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track a payment going out of Kontenin.yk.</p>
      </div>
      <ExpenseForm
        action={createExpenseAction}
        settings={settings}
        savedSuggestions={{ category, paidTo, role, paymentMethod }}
      />
    </div>
  );
}
