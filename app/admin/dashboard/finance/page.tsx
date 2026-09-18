import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, Wallet, Tag, CreditCard, ListChecks, TrendingUp, TrendingDown, ArrowRight, PiggyBank, LineChart as LineChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart } from "@/components/admin/line-chart";
import { BalanceCard } from "@/components/admin/balance-card";
import { getFinanceSummary, getRecentTransactions } from "@/lib/data/finance";
import { getMonthlyIncome } from "@/lib/data/tools";
import { getMonthlyExpenses } from "@/lib/data/documents";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Finance" };
export const dynamic = "force-dynamic";

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

const QUICK_LINKS = [
  { href: "/admin/dashboard/invoices", label: "Invoices", desc: "Bill clients, track payments", icon: Receipt },
  { href: "/admin/dashboard/expenses", label: "Expenses", desc: "Freelancers, tools, salaries", icon: Wallet },
  { href: "/admin/dashboard/pricing", label: "Pricing", desc: "Your rate cards & packages", icon: Tag },
  { href: "/admin/dashboard/invoices/banks", label: "Bank Accounts", desc: "Remittance details", icon: CreditCard },
  { href: "/admin/dashboard/invoices/services", label: "Service Price List", desc: "Quick-add items for invoices", icon: ListChecks },
];

export default async function FinancePage() {
  const [summary, transactions, income, expenses] = await Promise.all([
    getFinanceSummary(),
    getRecentTransactions(8),
    getMonthlyIncome(6),
    getMonthlyExpenses(6),
  ]);

  const isProfitable = summary.profit >= 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Finance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything money-related, in one place — invoices, expenses, and pricing.
        </p>
      </div>

      <Card className="overflow-hidden">
        <BalanceCard balance={summary.balance} totalIncome={summary.totalIncome} totalExpenses={summary.totalExpenses} />
      </Card>

      {/* Profit & Capital */}
      <Card className="overflow-hidden">
        <CardContent className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="p-6">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <LineChartIcon className="h-3.5 w-3.5" />
              Profit
            </p>
            <p className={`mt-2 text-2xl font-semibold tracking-tight ${isProfitable ? "text-emerald-600" : "text-destructive"}`}>
              {formatIDR(summary.profit)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Income minus operational expenses (excludes Capital)</p>
          </div>
          <div className="p-6">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <PiggyBank className="h-3.5 w-3.5" />
              Capital / Modal
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{formatIDR(summary.totalCapital)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Money invested in equipment & assets, not a cost</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col gap-2 rounded-2xl border border-border p-4 transition-colors hover:border-foreground/30"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <link.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{link.label}</p>
              <p className="text-xs text-muted-foreground">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Income vs Expenses trend, combined */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income vs Expenses (last 6 months)</CardTitle>
          <CardDescription>Paid invoices (IDR) against all recorded outgoing payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            series={[
              { data: income, color: "#10b981", name: "Income" },
              { data: expenses, color: "hsl(var(--destructive))", name: "Expenses" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Recent transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
            <CardDescription>Latest income and expenses, combined.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <Link
                  key={`${tx.type}-${tx.id}`}
                  href={tx.href}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        tx.type === "income" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {tx.type === "income" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{tx.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.sublabel} · {tx.date ? formatDate(tx.date) : "-"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-destructive"}`}>
                    {tx.type === "income" ? "+" : "-"}
                    {formatIDR(tx.amount)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/dashboard/invoices">
          View all invoices
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}
