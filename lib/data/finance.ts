import { createClient } from "@/lib/supabase/server";

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  totalOperationalExpenses: number;
  totalCapital: number;
  profit: number;
  balance: number;
}

/**
 * Balance is computed from IDR-only paid invoices minus all expenses
 * (expenses don't currently support other currencies). Invoices in other
 * currencies (USD, SGD, etc.) are excluded from this number on purpose —
 * mixing currencies into one total would just be wrong. They're still
 * fully visible on the Invoices page itself.
 *
 * Profit vs Capital: expenses are split by `expense_type`. "Operational"
 * costs (salaries, subscriptions, etc.) count against Profit. "Capital"
 * spending (equipment, gear — money put into assets, not spent-and-gone)
 * is tracked separately as Modal, since it's an investment, not a cost of
 * doing business. Balance (actual cash) still subtracts both, since the
 * money physically left the bank either way.
 */
export async function getFinanceSummary(): Promise<FinanceSummary> {
  const supabase = await createClient();

  const [invoicesRes, expensesRes] = await Promise.all([
    supabase.from("invoices").select("total, currency, status"),
    supabase.from("expenses").select("amount, expense_type"),
  ]);

  const totalIncome = (invoicesRes.data ?? [])
    .filter((inv) => inv.status === "paid" && inv.currency === "IDR")
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  const expenseRows = expensesRes.data ?? [];
  const totalOperationalExpenses = expenseRows
    .filter((exp) => exp.expense_type !== "capital")
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalCapital = expenseRows
    .filter((exp) => exp.expense_type === "capital")
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalExpenses = totalOperationalExpenses + totalCapital;

  return {
    totalIncome,
    totalExpenses,
    totalOperationalExpenses,
    totalCapital,
    profit: totalIncome - totalOperationalExpenses,
    balance: totalIncome - totalExpenses,
  };
}

export interface FinanceTransaction {
  id: string;
  type: "income" | "expense";
  label: string;
  sublabel: string;
  amount: number;
  date: string;
  href: string;
}

/** Recent income (paid IDR invoices) and expenses, merged and sorted by date. */
export async function getRecentTransactions(limit = 8): Promise<FinanceTransaction[]> {
  const supabase = await createClient();

  const [invoicesRes, expensesRes] = await Promise.all([
    supabase
      .from("invoices")
      .select("id, invoice_number, client_name, total, currency, status, paid_date")
      .eq("status", "paid")
      .eq("currency", "IDR")
      .order("paid_date", { ascending: false })
      .limit(limit),
    supabase
      .from("expenses")
      .select("id, voucher_number, paid_to, amount, payment_date")
      .order("payment_date", { ascending: false })
      .limit(limit),
  ]);

  const income: FinanceTransaction[] = (invoicesRes.data ?? []).map((inv) => ({
    id: inv.id,
    type: "income" as const,
    label: inv.client_name,
    sublabel: inv.invoice_number,
    amount: Number(inv.total) || 0,
    date: inv.paid_date ?? "",
    href: `/admin/dashboard/invoices/${inv.id}/edit`,
  }));

  const expenses: FinanceTransaction[] = (expensesRes.data ?? []).map((exp) => ({
    id: exp.id,
    type: "expense" as const,
    label: exp.paid_to,
    sublabel: exp.voucher_number,
    amount: Number(exp.amount) || 0,
    date: exp.payment_date,
    href: `/admin/dashboard/expenses/${exp.id}/edit`,
  }));

  return [...income, ...expenses].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
}
