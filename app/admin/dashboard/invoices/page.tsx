import type { Metadata } from "next";
import Link from "next/link";
import { Plus, CreditCard, Tag, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InvoicesTable } from "@/components/admin/invoices-table";
import { IncomeChart } from "@/components/admin/income-chart";
import { NotesWidget } from "@/components/admin/notes-widget";
import { EmptyState } from "@/components/shared/empty-state";
import { getInvoices, getMonthlyIncome, getAdminNotes } from "@/lib/data/tools";

export const metadata: Metadata = {
  title: "Invoices",
};

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const [invoices, income, notes] = await Promise.all([getInvoices(), getMonthlyIncome(6), getAdminNotes()]);

  return (
    <div className="space-y-6">
      <Link href="/admin/dashboard/finance" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Finance
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">{invoices.length} total</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/dashboard/invoices/banks">
              <CreditCard className="h-4 w-4" />
              Bank Accounts
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard/invoices/services">
              <Tag className="h-4 w-4" />
              Service Price List
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/dashboard/invoices/new">
              <Plus className="h-4 w-4" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Overview</CardTitle>
          <CardDescription>Total of paid invoices per month, last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <IncomeChart data={income} />
        </CardContent>
      </Card>

      <NotesWidget items={notes} />

      {invoices.length === 0 ? (
        <EmptyState
          title="No invoices yet"
          description="Create your first invoice to start tracking income."
          action={
            <Button asChild>
              <Link href="/admin/dashboard/invoices/new">
                <Plus className="h-4 w-4" />
                New Invoice
              </Link>
            </Button>
          }
        />
      ) : (
        <InvoicesTable invoices={invoices} />
      )}
    </div>
  );
}
