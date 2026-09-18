import { createClient } from "@/lib/supabase/server";
import type { Invoice, InvoiceBankAccount, ToolLink, AdminNote, EditingStandard, InvoiceService } from "@/types/tools";

/** Fetch the invoice services price catalog, for quick-adding line items. */
export async function getInvoiceServices(): Promise<InvoiceService[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoice_services")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch invoice services:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch all admin notes/tasks, newest first. */
export async function getAdminNotes(): Promise<AdminNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_notes")
    .select("*")
    .order("is_done", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch notes:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch all editing standards, grouped implicitly by category via sort order. */
export async function getEditingStandards(): Promise<EditingStandard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("editing_standards")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch editing standards:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch all bank accounts for the invoice bank-account selector. */
export async function getBankAccounts(): Promise<InvoiceBankAccount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoice_bank_accounts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch bank accounts:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch all invoices, newest first. */
export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("issue_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch invoices:", error.message);
    return [];
  }

  return (data ?? []) as unknown as Invoice[];
}

/** Fetch a single invoice by id. */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("invoices").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Failed to fetch invoice:", error.message);
    return null;
  }

  return data as unknown as Invoice | null;
}

/** Monthly total of PAID invoices, for the income chart. Returns the last N months, oldest first. */
export interface MonthlyIncome {
  month: string; // "2026-01"
  label: string; // "Jan"
  total: number;
}

export async function getMonthlyIncome(months = 6): Promise<MonthlyIncome[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("total, issue_date, status")
    .eq("status", "paid");

  if (error) {
    console.error("Failed to fetch income data:", error.message);
    return [];
  }

  const now = new Date();
  const buckets: MonthlyIncome[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({
      month: key,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      total: 0,
    });
  }

  const byMonth = new Map(buckets.map((b) => [b.month, b]));

  for (const row of data ?? []) {
    const date = new Date(row.issue_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = byMonth.get(key);
    if (bucket) bucket.total += Number(row.total) || 0;
  }

  return buckets;
}

/** Fetch all tool links, grouped implicitly by category via sort order. */
export async function getToolLinks(): Promise<ToolLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tool_links")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch tool links:", error.message);
    return [];
  }

  return data ?? [];
}
