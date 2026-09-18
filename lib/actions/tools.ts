"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { invoiceFormSchema, toolLinkSchema, bankAccountSchema, adminNoteSchema, editingStandardSchema, invoiceServiceSchema } from "@/lib/validations";
import type { InvoiceLineItem, InvoiceStatus } from "@/types/tools";

export interface ToolActionState {
  error?: string;
}

/** Matches the real-world formula used by the Kontenin.yk invoice tool. */
function computeTotal(items: InvoiceLineItem[], discountPercent: number, taxPercent: number) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const afterDiscount = subtotal - subtotal * (discountPercent / 100);
  const total = afterDiscount * (1 + taxPercent / 100);
  return Math.round(total * 100) / 100;
}

function parseInvoiceForm(formData: FormData) {
  const itemsRaw = (formData.get("items") as string) || "[]";
  let items: InvoiceLineItem[] = [];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    items = [];
  }

  return {
    invoice_number: formData.get("invoice_number"),
    doc_type: formData.get("doc_type"),
    currency: formData.get("currency"),
    client_id: (formData.get("client_id") as string) || null,
    client_name: formData.get("client_name"),
    client_company: formData.get("client_company"),
    client_whatsapp: formData.get("client_whatsapp"),
    client_email: formData.get("client_email"),
    client_logo_url: (formData.get("client_logo_url") as string) || null,
    payment_purpose: formData.get("payment_purpose"),
    items,
    discount_percent: formData.get("discount_percent") || 0,
    tax_percent: formData.get("tax_percent") || 0,
    bank_account_id: (formData.get("bank_account_id") as string) || null,
    show_qris: formData.get("show_qris") === "true",
    status: formData.get("status"),
    issue_date: formData.get("issue_date"),
    due_date: formData.get("due_date"),
    paid_date: formData.get("paid_date"),
    transaction_code: formData.get("transaction_code"),
    sender_bank: formData.get("sender_bank"),
    notes: formData.get("notes"),
  };
}

function buildInvoicePayload(parsed: ReturnType<typeof invoiceFormSchema.parse>) {
  const total = computeTotal(parsed.items, parsed.discount_percent, parsed.tax_percent);

  return {
    invoice_number: parsed.invoice_number,
    doc_type: parsed.doc_type,
    currency: parsed.currency,
    client_id: parsed.client_id || null,
    client_name: parsed.client_name,
    client_company: parsed.client_company || null,
    client_whatsapp: parsed.client_whatsapp || null,
    client_email: parsed.client_email || null,
    client_logo_url: parsed.client_logo_url || null,
    payment_purpose: parsed.payment_purpose || null,
    items: parsed.items,
    discount_percent: parsed.discount_percent,
    tax_percent: parsed.tax_percent,
    total,
    bank_account_id: parsed.bank_account_id || null,
    show_qris: parsed.show_qris,
    status: parsed.status,
    issue_date: parsed.issue_date,
    due_date: parsed.due_date || null,
    paid_date: parsed.paid_date || null,
    transaction_code: parsed.transaction_code || null,
    sender_bank: parsed.sender_bank || null,
    notes: parsed.notes || null,
  };
}

/** Creates a new invoice. */
export async function createInvoiceAction(
  _prevState: ToolActionState,
  formData: FormData
): Promise<ToolActionState> {
  const parsed = invoiceFormSchema.safeParse(parseInvoiceForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("invoices").insert(buildInvoicePayload(parsed.data));

  if (error) return { error: `Failed to create invoice: ${error.message}` };

  revalidatePath("/admin/dashboard/invoices");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard/invoices");
}

/** Updates an existing invoice. */
export async function updateInvoiceAction(
  id: string,
  _prevState: ToolActionState,
  formData: FormData
): Promise<ToolActionState> {
  const parsed = invoiceFormSchema.safeParse(parseInvoiceForm(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .update({ ...buildInvoicePayload(parsed.data), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: `Failed to update invoice: ${error.message}` };

  revalidatePath("/admin/dashboard/invoices");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard/invoices");
}

/** Deletes an invoice. */
export async function deleteInvoiceAction(id: string): Promise<ToolActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) return { error: `Failed to delete invoice: ${error.message}` };

  revalidatePath("/admin/dashboard/invoices");
  revalidatePath("/admin/dashboard");
  return {};
}

/**
 * Quickly updates just an invoice's status. When marking as Paid and no
 * paid_date is set yet, defaults it to today — but it stays fully editable
 * from the invoice edit form, since the actual transfer might have landed
 * on a different date than when you got around to marking it.
 */
export async function updateInvoiceStatusAction(id: string, status: InvoiceStatus): Promise<ToolActionState> {
  const supabase = await createClient();

  const updatePayload: { status: InvoiceStatus; updated_at: string; paid_date?: string } = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "paid") {
    const { data: existing } = await supabase.from("invoices").select("paid_date").eq("id", id).maybeSingle();
    if (existing && !existing.paid_date) {
      updatePayload.paid_date = new Date().toISOString().slice(0, 10);
    }
  }

  const { error } = await supabase.from("invoices").update(updatePayload).eq("id", id);

  if (error) return { error: `Failed to update status: ${error.message}` };

  revalidatePath("/admin/dashboard/invoices");
  revalidatePath("/admin/dashboard");
  return {};
}

/** Adds a bank account. */
export async function addBankAccountAction(
  bankName: string,
  accountNumber: string,
  accountHolder: string,
  description: string
): Promise<ToolActionState> {
  const parsed = bankAccountSchema.safeParse({
    bank_name: bankName,
    account_number: accountNumber,
    account_holder: accountHolder,
    description,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("invoice_bank_accounts").insert({
    bank_name: parsed.data.bank_name,
    account_number: parsed.data.account_number,
    account_holder: parsed.data.account_holder,
    description: parsed.data.description || null,
  });

  if (error) return { error: `Failed to add bank account: ${error.message}` };

  revalidatePath("/admin/dashboard/invoices/banks");
  return {};
}

/** Deletes a bank account. */
export async function deleteBankAccountAction(id: string): Promise<ToolActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("invoice_bank_accounts").delete().eq("id", id);
  if (error) return { error: `Failed to delete bank account: ${error.message}` };

  revalidatePath("/admin/dashboard/invoices/banks");
  return {};
}

/** Adds a new tool link. */
export async function addToolLinkAction(
  name: string,
  url: string,
  category: string,
  iconUrl: string | null
): Promise<ToolActionState> {
  const parsed = toolLinkSchema.safeParse({ name, url, category, icon_url: iconUrl });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("tool_links").insert({
    name: parsed.data.name,
    url: parsed.data.url,
    category: parsed.data.category || null,
    icon_url: parsed.data.icon_url || null,
  });

  if (error) return { error: `Failed to add link: ${error.message}` };

  revalidatePath("/admin/dashboard/tools");
  return {};
}

/** Deletes a tool link. */
export async function deleteToolLinkAction(id: string): Promise<ToolActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("tool_links").delete().eq("id", id);
  if (error) return { error: `Failed to delete link: ${error.message}` };

  revalidatePath("/admin/dashboard/tools");
  return {};
}

/** Adds a note/task. */
export async function addAdminNoteAction(content: string): Promise<ToolActionState> {
  const parsed = adminNoteSchema.safeParse({ content });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("admin_notes").insert({ content: parsed.data.content });

  if (error) return { error: `Failed to add note: ${error.message}` };

  revalidatePath("/admin/dashboard");
  return {};
}

/** Toggles a note's done state. */
export async function toggleAdminNoteAction(id: string, isDone: boolean): Promise<ToolActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("admin_notes").update({ is_done: isDone }).eq("id", id);
  if (error) return { error: `Failed to update note: ${error.message}` };

  revalidatePath("/admin/dashboard");
  return {};
}

/** Deletes a note/task. */
export async function deleteAdminNoteAction(id: string): Promise<ToolActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("admin_notes").delete().eq("id", id);
  if (error) return { error: `Failed to delete note: ${error.message}` };

  revalidatePath("/admin/dashboard");
  return {};
}

/** Adds an editing standard/spec entry. */
export async function addEditingStandardAction(
  category: string,
  label: string,
  value: string
): Promise<ToolActionState> {
  const parsed = editingStandardSchema.safeParse({ category, label, value });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("editing_standards").insert({
    category: parsed.data.category,
    label: parsed.data.label,
    value: parsed.data.value,
  });

  if (error) return { error: `Failed to add standard: ${error.message}` };

  revalidatePath("/admin/dashboard");
  return {};
}

/** Deletes an editing standard/spec entry. */
export async function deleteEditingStandardAction(id: string): Promise<ToolActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("editing_standards").delete().eq("id", id);
  if (error) return { error: `Failed to delete standard: ${error.message}` };

  revalidatePath("/admin/dashboard");
  return {};
}

/** Adds an entry to the invoice services price catalog. */
export async function addInvoiceServiceAction(
  name: string,
  price: number,
  category: string
): Promise<ToolActionState> {
  const parsed = invoiceServiceSchema.safeParse({ name, price, category });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("invoice_services").insert({
    name: parsed.data.name,
    price: parsed.data.price,
    category: parsed.data.category || null,
  });

  if (error) return { error: `Failed to add service: ${error.message}` };

  revalidatePath("/admin/dashboard/invoices/services");
  revalidatePath("/admin/dashboard/invoices/new");
  return {};
}

/** Deletes an entry from the invoice services price catalog. */
export async function deleteInvoiceServiceAction(id: string): Promise<ToolActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("invoice_services").delete().eq("id", id);
  if (error) return { error: `Failed to delete service: ${error.message}` };

  revalidatePath("/admin/dashboard/invoices/services");
  return {};
}

/** Duplicates an invoice — same client, items, and settings, but a fresh
 * invoice number, reset to Draft status with no paid date, so you can bill
 * a repeat client without retyping everything. */
export async function duplicateInvoiceAction(id: string): Promise<ToolActionState & { newId?: string }> {
  const supabase = await createClient();
  const { data: original, error: fetchError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !original) return { error: "Could not find the invoice to duplicate." };

  const now = new Date();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const newInvoiceNumber = `${original.invoice_number}-COPY-${suffix}`;

  const { data: created, error: insertError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: newInvoiceNumber,
      doc_type: original.doc_type,
      currency: original.currency,
      client_id: original.client_id,
      client_name: original.client_name,
      client_company: original.client_company,
      client_whatsapp: original.client_whatsapp,
      client_email: original.client_email,
      client_logo_url: original.client_logo_url,
      payment_purpose: original.payment_purpose,
      items: original.items,
      discount_percent: original.discount_percent,
      tax_percent: original.tax_percent,
      total: original.total,
      bank_account_id: original.bank_account_id,
      show_qris: original.show_qris,
      status: "draft",
      issue_date: now.toISOString().slice(0, 10),
      due_date: null,
      paid_date: null,
      notes: original.notes,
    })
    .select("id")
    .single();

  if (insertError || !created) return { error: `Failed to duplicate invoice: ${insertError?.message ?? "unknown error"}` };

  revalidatePath("/admin/dashboard/invoices");
  return { newId: created.id };
}
