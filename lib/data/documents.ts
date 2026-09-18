import { createClient } from "@/lib/supabase/server";
import type { Proposal, Expense, MouDocument, FreelancerOffer } from "@/types/documents";

// ---------------------------------------------------------------------------
// Proposals
// ---------------------------------------------------------------------------
export async function getProposals(): Promise<Proposal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("proposals").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch proposals:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Proposal[];
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("proposals").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Failed to fetch proposal:", error.message);
    return null;
  }
  return data as unknown as Proposal | null;
}

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------
export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("expenses").select("*").order("payment_date", { ascending: false });
  if (error) {
    console.error("Failed to fetch expenses:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Failed to fetch expense:", error.message);
    return null;
  }
  return data;
}

export interface MonthlyExpense {
  month: string;
  label: string;
  total: number;
}

/** Monthly total of all expenses, for the cash-flow chart. Returns the last N months, oldest first. */
export async function getMonthlyExpenses(months = 6): Promise<MonthlyExpense[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("expenses").select("amount, payment_date");
  if (error) {
    console.error("Failed to fetch expense totals:", error.message);
    return [];
  }

  const now = new Date();
  const buckets: MonthlyExpense[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({ month: key, label: d.toLocaleDateString("en-US", { month: "short" }), total: 0 });
  }
  const byMonth = new Map(buckets.map((b) => [b.month, b]));

  for (const row of data ?? []) {
    const date = new Date(row.payment_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = byMonth.get(key);
    if (bucket) bucket.total += Number(row.amount) || 0;
  }

  return buckets;
}

// ---------------------------------------------------------------------------
// MOU documents
// ---------------------------------------------------------------------------
export async function getMouDocuments(): Promise<MouDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("mou_documents").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch MOU documents:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getMouDocumentById(id: string): Promise<MouDocument | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("mou_documents").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Failed to fetch MOU document:", error.message);
    return null;
  }
  return data;
}

// ---------------------------------------------------------------------------
// Freelancer offers
// ---------------------------------------------------------------------------
export async function getFreelancerOffers(): Promise<FreelancerOffer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("freelancer_offers").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch freelancer offers:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFreelancerOfferById(id: string): Promise<FreelancerOffer | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("freelancer_offers").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Failed to fetch freelancer offer:", error.message);
    return null;
  }
  return data;
}
