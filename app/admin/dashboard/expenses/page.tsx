import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Printer, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { IncomeChart } from "@/components/admin/income-chart";
import { DeleteExpenseButton } from "@/components/admin/delete-expense-button";
import { getExpenses, getMonthlyExpenses } from "@/lib/data/documents";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Expenses" };
export const dynamic = "force-dynamic";

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export default async function ExpensesPage() {
  const [expenses, monthly] = await Promise.all([getExpenses(), getMonthlyExpenses(6)]);
  const totalThisMonth = monthly[monthly.length - 1]?.total ?? 0;

  return (
    <div className="space-y-6">
      <Link href="/admin/dashboard/finance" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Finance
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Money going out — freelancers, design services, salaries. {expenses.length} recorded.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/expenses/new">
            <Plus className="h-4 w-4" /> Record Expense
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outflow Overview</CardTitle>
          <CardDescription>
            Total spent this month: <span className="font-semibold text-foreground">{formatIDR(totalThisMonth)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IncomeChart data={monthly} />
        </CardContent>
      </Card>

      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses recorded yet"
          description="Track payments to freelancers, designers, or your team here."
          action={
            <Button asChild>
              <Link href="/admin/dashboard/expenses/new">
                <Plus className="h-4 w-4" /> Record Expense
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Paid To</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3 font-medium">{e.paid_to}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(e.payment_date)}</td>
                  <td className="px-4 py-3 font-medium">{formatIDR(e.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/admin/dashboard/expenses/${e.id}/print`} target="_blank">
                          <Printer className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/admin/dashboard/expenses/${e.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteExpenseButton id={e.id} label={e.paid_to} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
