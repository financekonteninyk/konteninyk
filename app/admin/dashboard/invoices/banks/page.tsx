import type { Metadata } from "next";
import { BankAccountsManager } from "@/components/admin/bank-accounts-manager";
import { getBankAccounts } from "@/lib/data/tools";

export const metadata: Metadata = {
  title: "Bank Accounts",
};

export const dynamic = "force-dynamic";

export default async function BankAccountsPage() {
  const accounts = await getBankAccounts();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bank Accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the remittance details available when creating invoices.
        </p>
      </div>
      <BankAccountsManager items={accounts} />
    </div>
  );
}
