"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { proposalFormSchema, expenseFormSchema, mouFormSchema, freelancerOfferFormSchema } from "@/lib/validations";
import { rememberChipValues } from "@/lib/actions/chip-suggestions";
import type { ScopeItem, InvestmentItem } from "@/types/documents";

export interface DocActionState {
  error?: string;
}

// ---------------------------------------------------------------------------
// Proposals
// ---------------------------------------------------------------------------
function parseProposalForm(formData: FormData) {
  const scopeRaw = (formData.get("scope_items") as string) || "[]";
  const investmentRaw = (formData.get("investment_items") as string) || "[]";
  let scope_items: ScopeItem[] = [];
  let investment_items: InvestmentItem[] = [];
  try {
    scope_items = JSON.parse(scopeRaw);
  } catch {
    scope_items = [];
  }
  try {
    investment_items = JSON.parse(investmentRaw);
  } catch {
    investment_items = [];
  }

  return {
    proposal_number: formData.get("proposal_number"),
    client_name: formData.get("client_name"),
    client_company: formData.get("client_company"),
    project_title: formData.get("project_title"),
    objective: formData.get("objective"),
    background: formData.get("background"),
    account_analysis: formData.get("account_analysis"),
    strategy: formData.get("strategy"),
    scope_items,
    investment_items,
    investment_note: formData.get("investment_note"),
    timeline: formData.get("timeline"),
    valid_until: formData.get("valid_until"),
    status: formData.get("status"),
  };
}

function buildProposalPayload(parsed: ReturnType<typeof proposalFormSchema.parse>) {
  return {
    proposal_number: parsed.proposal_number,
    client_name: parsed.client_name,
    client_company: parsed.client_company || null,
    project_title: parsed.project_title,
    objective: parsed.objective || null,
    background: parsed.background || null,
    account_analysis: parsed.account_analysis || null,
    strategy: parsed.strategy || null,
    scope_items: parsed.scope_items,
    investment_items: parsed.investment_items,
    investment_note: parsed.investment_note || null,
    timeline: parsed.timeline || null,
    valid_until: parsed.valid_until || null,
    status: parsed.status,
  };
}

export async function createProposalAction(_prevState: DocActionState, formData: FormData): Promise<DocActionState> {
  const parsed = proposalFormSchema.safeParse(parseProposalForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("proposals").insert(buildProposalPayload(parsed.data));
  if (error) return { error: `Failed to create proposal: ${error.message}` };

  revalidatePath("/admin/dashboard/proposals");
  redirect("/admin/dashboard/proposals");
}

export async function updateProposalAction(
  id: string,
  _prevState: DocActionState,
  formData: FormData
): Promise<DocActionState> {
  const parsed = proposalFormSchema.safeParse(parseProposalForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("proposals")
    .update({ ...buildProposalPayload(parsed.data), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: `Failed to update proposal: ${error.message}` };

  revalidatePath("/admin/dashboard/proposals");
  redirect("/admin/dashboard/proposals");
}

export async function deleteProposalAction(id: string): Promise<DocActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) return { error: `Failed to delete: ${error.message}` };
  revalidatePath("/admin/dashboard/proposals");
  return {};
}

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------
function buildExpensePayload(parsed: ReturnType<typeof expenseFormSchema.parse>) {
  return {
    voucher_number: parsed.voucher_number,
    category: parsed.category,
    paid_to: parsed.paid_to,
    role: parsed.role || null,
    work_period: parsed.work_period || null,
    transaction_code: parsed.transaction_code || null,
    sender_bank: parsed.sender_bank || null,
    receiver_bank: parsed.receiver_bank || null,
    expense_type: parsed.expense_type,
    personal_note: parsed.personal_note || null,
    description: parsed.description || null,
    amount: parsed.amount,
    payment_date: parsed.payment_date,
    payment_method: parsed.payment_method || null,
    proof_url: parsed.proof_url || null,
    notes: parsed.notes || null,
  };
}

function parseExpenseForm(formData: FormData) {
  return {
    voucher_number: formData.get("voucher_number"),
    category: formData.get("category"),
    paid_to: formData.get("paid_to"),
    role: formData.get("role"),
    work_period: formData.get("work_period"),
    transaction_code: formData.get("transaction_code"),
    sender_bank: formData.get("sender_bank"),
    receiver_bank: formData.get("receiver_bank"),
    expense_type: formData.get("expense_type"),
    personal_note: formData.get("personal_note"),
    description: formData.get("description"),
    amount: formData.get("amount") || 0,
    payment_date: formData.get("payment_date"),
    payment_method: formData.get("payment_method"),
    proof_url: (formData.get("proof_url") as string) || null,
    notes: formData.get("notes"),
  };
}

function rememberExpenseChips(parsed: ReturnType<typeof expenseFormSchema.parse>) {
  return rememberChipValues([
    { fieldKey: "expense_category", value: parsed.category },
    { fieldKey: "expense_paid_to", value: parsed.paid_to },
    { fieldKey: "expense_role", value: parsed.role || "" },
    { fieldKey: "expense_payment_method", value: parsed.payment_method || "" },
  ]);
}

export async function createExpenseAction(_prevState: DocActionState, formData: FormData): Promise<DocActionState> {
  const parsed = expenseFormSchema.safeParse(parseExpenseForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("expenses").insert(buildExpensePayload(parsed.data));
  if (error) return { error: `Failed to create expense: ${error.message}` };

  await rememberExpenseChips(parsed.data);

  revalidatePath("/admin/dashboard/expenses");
  redirect("/admin/dashboard/expenses");
}

export async function updateExpenseAction(
  id: string,
  _prevState: DocActionState,
  formData: FormData
): Promise<DocActionState> {
  const parsed = expenseFormSchema.safeParse(parseExpenseForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("expenses")
    .update({ ...buildExpensePayload(parsed.data), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: `Failed to update expense: ${error.message}` };

  await rememberExpenseChips(parsed.data);

  revalidatePath("/admin/dashboard/expenses");
  redirect("/admin/dashboard/expenses");
}

export async function deleteExpenseAction(id: string): Promise<DocActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { error: `Failed to delete: ${error.message}` };
  revalidatePath("/admin/dashboard/expenses");
  return {};
}

// ---------------------------------------------------------------------------
// MOU documents
// ---------------------------------------------------------------------------
function buildMouPayload(parsed: ReturnType<typeof mouFormSchema.parse>) {
  return {
    mou_number: parsed.mou_number,
    party_type: parsed.party_type,
    party_name: parsed.party_name,
    party_company: parsed.party_company || null,
    project_title: parsed.project_title,
    scope: parsed.scope || null,
    terms: parsed.terms || null,
    compensation: parsed.compensation || null,
    duration: parsed.duration || null,
    effective_date: parsed.effective_date,
    status: parsed.status,
  };
}

function parseMouForm(formData: FormData) {
  return {
    mou_number: formData.get("mou_number"),
    party_type: formData.get("party_type"),
    party_name: formData.get("party_name"),
    party_company: formData.get("party_company"),
    project_title: formData.get("project_title"),
    scope: formData.get("scope"),
    terms: formData.get("terms"),
    compensation: formData.get("compensation"),
    duration: formData.get("duration"),
    effective_date: formData.get("effective_date"),
    status: formData.get("status"),
  };
}

export async function createMouAction(_prevState: DocActionState, formData: FormData): Promise<DocActionState> {
  const parsed = mouFormSchema.safeParse(parseMouForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("mou_documents").insert(buildMouPayload(parsed.data));
  if (error) return { error: `Failed to create MOU: ${error.message}` };

  revalidatePath("/admin/dashboard/mou");
  redirect("/admin/dashboard/mou");
}

export async function updateMouAction(
  id: string,
  _prevState: DocActionState,
  formData: FormData
): Promise<DocActionState> {
  const parsed = mouFormSchema.safeParse(parseMouForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("mou_documents")
    .update({ ...buildMouPayload(parsed.data), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: `Failed to update MOU: ${error.message}` };

  revalidatePath("/admin/dashboard/mou");
  redirect("/admin/dashboard/mou");
}

export async function deleteMouAction(id: string): Promise<DocActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("mou_documents").delete().eq("id", id);
  if (error) return { error: `Failed to delete: ${error.message}` };
  revalidatePath("/admin/dashboard/mou");
  return {};
}

// ---------------------------------------------------------------------------
// Freelancer offers
// ---------------------------------------------------------------------------
function buildOfferPayload(parsed: ReturnType<typeof freelancerOfferFormSchema.parse>) {
  return {
    offer_number: parsed.offer_number,
    freelancer_name: parsed.freelancer_name,
    job_title: parsed.job_title,
    price: parsed.price,
    specifications: parsed.specifications || null,
    project_deadline: parsed.project_deadline || null,
    status: parsed.status,
  };
}

function parseOfferForm(formData: FormData) {
  return {
    offer_number: formData.get("offer_number"),
    freelancer_name: formData.get("freelancer_name"),
    job_title: formData.get("job_title"),
    price: formData.get("price") || 0,
    specifications: formData.get("specifications"),
    project_deadline: formData.get("project_deadline"),
    status: formData.get("status"),
  };
}

export async function createFreelancerOfferAction(_prevState: DocActionState, formData: FormData): Promise<DocActionState> {
  const parsed = freelancerOfferFormSchema.safeParse(parseOfferForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("freelancer_offers").insert(buildOfferPayload(parsed.data));
  if (error) return { error: `Failed to create offer: ${error.message}` };

  await rememberChipValues([{ fieldKey: "offer_job_title", value: parsed.data.job_title }]);

  revalidatePath("/admin/dashboard/agreements/offers");
  redirect("/admin/dashboard/agreements/offers");
}

export async function updateFreelancerOfferAction(
  id: string,
  _prevState: DocActionState,
  formData: FormData
): Promise<DocActionState> {
  const parsed = freelancerOfferFormSchema.safeParse(parseOfferForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("freelancer_offers")
    .update({ ...buildOfferPayload(parsed.data), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: `Failed to update offer: ${error.message}` };

  await rememberChipValues([{ fieldKey: "offer_job_title", value: parsed.data.job_title }]);

  revalidatePath("/admin/dashboard/agreements/offers");
  redirect("/admin/dashboard/agreements/offers");
}

export async function deleteFreelancerOfferAction(id: string): Promise<DocActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("freelancer_offers").delete().eq("id", id);
  if (error) return { error: `Failed to delete: ${error.message}` };
  revalidatePath("/admin/dashboard/agreements/offers");
  return {};
}
