"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calendarFormSchema, calendarEntryFormSchema, calendarRequestFormSchema, calendarStrategyFormSchema, entryCommentFormSchema, glsCommentFormSchema, glsResolutionFormSchema } from "@/lib/validations";

export interface CalendarActionState {
  error?: string;
}

function describeValidationError(error: { issues: { path: (string | number)[]; message: string }[] }): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid input — no further detail available.";
  const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
  return `${path}: ${issue.message}`;
}

// ---------------------------------------------------------------------------
// Calendars
// ---------------------------------------------------------------------------
export async function createCalendarAction(
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = calendarFormSchema.safeParse({
    client_id: formData.get("client_id") || null,
    client_name: formData.get("client_name"),
    client_logo_url: formData.get("client_logo_url") || null,
    strategy_note: formData.get("strategy_note"),
    background_color: formData.get("background_color") || null,
    page_title: formData.get("page_title"),
    whatsapp_number: formData.get("whatsapp_number"),
    contract_start_date: formData.get("contract_start_date"),
    contract_end_date: formData.get("contract_end_date"),
    notes: formData.get("notes"),
    strategy_title: formData.get("strategy_title"),
  });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_calendars")
    .insert({
      client_id: parsed.data.client_id || null,
      client_name: parsed.data.client_name,
      client_logo_url: parsed.data.client_logo_url || null,
      strategy_note: parsed.data.strategy_note || null,
      background_color: parsed.data.background_color || null,
      page_title: parsed.data.page_title || null,
      whatsapp_number: parsed.data.whatsapp_number || null,
      contract_start_date: parsed.data.contract_start_date || null,
      contract_end_date: parsed.data.contract_end_date || null,
      notes: parsed.data.notes || null,
      strategy_title: parsed.data.strategy_title || null,
    })
    .select("id")
    .single();

  if (error || !data) return { error: `Failed to create calendar: ${error?.message ?? "unknown error"}` };

  revalidatePath("/admin/dashboard/calendars");
  redirect(`/admin/dashboard/calendars/${data.id}`);
}

export async function updateCalendarAction(
  id: string,
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = calendarFormSchema.safeParse({
    client_id: formData.get("client_id") || null,
    client_name: formData.get("client_name"),
    client_logo_url: formData.get("client_logo_url") || null,
    strategy_note: formData.get("strategy_note"),
    background_color: formData.get("background_color") || null,
    page_title: formData.get("page_title"),
    whatsapp_number: formData.get("whatsapp_number"),
    contract_start_date: formData.get("contract_start_date"),
    contract_end_date: formData.get("contract_end_date"),
    notes: formData.get("notes"),
    strategy_title: formData.get("strategy_title"),
  });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("content_calendars")
    .update({
      client_id: parsed.data.client_id || null,
      client_name: parsed.data.client_name,
      client_logo_url: parsed.data.client_logo_url || null,
      strategy_note: parsed.data.strategy_note || null,
      background_color: parsed.data.background_color || null,
      page_title: parsed.data.page_title || null,
      whatsapp_number: parsed.data.whatsapp_number || null,
      contract_start_date: parsed.data.contract_start_date || null,
      contract_end_date: parsed.data.contract_end_date || null,
      notes: parsed.data.notes || null,
      strategy_title: parsed.data.strategy_title || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: `Failed to update calendar: ${error.message}` };

  revalidatePath(`/admin/dashboard/calendars/${id}`);
  revalidatePath("/admin/dashboard/calendars");
  redirect(`/admin/dashboard/calendars/${id}`);
}

export async function deleteCalendarAction(id: string): Promise<CalendarActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("content_calendars").delete().eq("id", id);
  if (error) return { error: `Failed to delete: ${error.message}` };
  revalidatePath("/admin/dashboard/calendars");
  return {};
}

/** Rotates the share link — old link stops working immediately. Useful if a link was shared somewhere it shouldn't have been. */
export async function regenerateShareTokenAction(id: string): Promise<CalendarActionState> {
  const newToken = Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  const supabase = await createClient();
  const { error } = await supabase
    .from("content_calendars")
    .update({ share_token: newToken, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: `Failed to regenerate link: ${error.message}` };
  revalidatePath(`/admin/dashboard/calendars/${id}`);
  return {};
}

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------
export async function createCalendarEntryAction(
  calendarId: string,
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = calendarEntryFormSchema.safeParse({
    entry_date: formData.get("entry_date"),
    content_type: formData.get("content_type"),
    description: formData.get("description"),
    reference_url: formData.get("reference_url"),
    reference_image_url: formData.get("reference_image_url") || null,
    drive_url: formData.get("drive_url"),
    function_tag: formData.get("function_tag"),
    function_color: formData.get("function_color"),
    status: formData.get("status"),
    source: formData.get("source"),
  });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("content_calendar_entries").insert({
    calendar_id: calendarId,
    entry_date: parsed.data.entry_date,
    content_type: parsed.data.content_type,
    description: parsed.data.description || null,
    reference_url: parsed.data.reference_url || null,
    reference_image_url: parsed.data.reference_image_url || null,
    drive_url: parsed.data.drive_url || null,
      function_tag: parsed.data.function_tag || null,
      function_color: parsed.data.function_color || null,
    status: parsed.data.status,
    source: parsed.data.source,
  });

  if (error) return { error: `Failed to create entry: ${error.message}` };

  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

export async function updateCalendarEntryAction(
  entryId: string,
  calendarId: string,
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = calendarEntryFormSchema.safeParse({
    entry_date: formData.get("entry_date"),
    content_type: formData.get("content_type"),
    description: formData.get("description"),
    reference_url: formData.get("reference_url"),
    reference_image_url: formData.get("reference_image_url") || null,
    drive_url: formData.get("drive_url"),
    function_tag: formData.get("function_tag"),
    function_color: formData.get("function_color"),
    status: formData.get("status"),
    source: formData.get("source"),
  });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("content_calendar_entries")
    .update({
      entry_date: parsed.data.entry_date,
      content_type: parsed.data.content_type,
      description: parsed.data.description || null,
      reference_url: parsed.data.reference_url || null,
      reference_image_url: parsed.data.reference_image_url || null,
    drive_url: parsed.data.drive_url || null,
      function_tag: parsed.data.function_tag || null,
      function_color: parsed.data.function_color || null,
      status: parsed.data.status,
      source: parsed.data.source,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId);

  if (error) return { error: `Failed to update entry: ${error.message}` };

  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

export async function deleteCalendarEntryAction(entryId: string, calendarId: string): Promise<CalendarActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("content_calendar_entries").delete().eq("id", entryId);
  if (error) return { error: `Failed to delete entry: ${error.message}` };
  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------
/** Submitted by a client from the public share page — no auth required. */
export async function submitCalendarRequestAction(
  calendarId: string,
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = calendarRequestFormSchema.safeParse({
    message: formData.get("message"),
    reference_url: formData.get("reference_url"),
  });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("content_calendar_requests").insert({
    calendar_id: calendarId,
    message: parsed.data.message,
    reference_url: parsed.data.reference_url || null,
  });

  if (error) return { error: `Failed to submit request: ${error.message}` };

  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

export async function dismissCalendarRequestAction(requestId: string, calendarId: string): Promise<CalendarActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("content_calendar_requests")
    .update({ status: "dismissed" })
    .eq("id", requestId);
  if (error) return { error: `Failed to update request: ${error.message}` };
  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

/** Marks a request as "placed" once the admin has turned it into an actual calendar entry. */
export async function markRequestPlacedAction(
  requestId: string,
  entryId: string,
  calendarId: string
): Promise<CalendarActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("content_calendar_requests")
    .update({ status: "placed", linked_entry_id: entryId })
    .eq("id", requestId);
  if (error) return { error: `Failed to update request: ${error.message}` };
  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

// ---------------------------------------------------------------------------
// Strategy Gallery
// ---------------------------------------------------------------------------
export async function createCalendarStrategyAction(
  calendarId: string,
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = calendarStrategyFormSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("calendar_strategies").insert({
    calendar_id: calendarId,
    title: parsed.data.title,
    content: parsed.data.content,
    sort_order: parsed.data.sort_order,
  });

  if (error) return { error: `Failed to create strategy: ${error.message}` };

  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

export async function updateCalendarStrategyAction(
  strategyId: string,
  calendarId: string,
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = calendarStrategyFormSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("calendar_strategies")
    .update({
      title: parsed.data.title,
      content: parsed.data.content,
      sort_order: parsed.data.sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", strategyId);

  if (error) return { error: `Failed to update strategy: ${error.message}` };

  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

export async function deleteCalendarStrategyAction(strategyId: string, calendarId: string): Promise<CalendarActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("calendar_strategies").delete().eq("id", strategyId);
  if (error) return { error: `Failed to delete strategy: ${error.message}` };
  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

// ---------------------------------------------------------------------------
// Content Review & Approval
// ---------------------------------------------------------------------------
/** Posts a comment on an entry — used by both the client (public page) and the admin. */
export async function postEntryCommentAction(
  entryId: string,
  calendarId: string,
  author: "client" | "admin",
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = entryCommentFormSchema.safeParse({ message: formData.get("message") });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("calendar_entry_comments").insert({
    entry_id: entryId,
    author,
    message: parsed.data.message,
  });

  if (error) return { error: `Failed to post comment: ${error.message}` };

  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

/** Client sets approval status on a piece of content — only ever touches
 * this one column, regardless of what else might be sent. */
export async function setApprovalStatusAction(
  entryId: string,
  status: "pending" | "approved" | "rejected"
): Promise<CalendarActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("content_calendar_entries")
    .update({ approval_status: status, approval_updated_at: new Date().toISOString() })
    .eq("id", entryId);

  if (error) return { error: `Failed to update approval status: ${error.message}` };
  return {};
}

/** Approves every entry in a calendar that's still pending, in one go —
 * used by the "Setujui Semua" button on the Content Summary list. */
export async function approveAllEntriesAction(calendarId: string): Promise<CalendarActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("content_calendar_entries")
    .update({ approval_status: "approved", approval_updated_at: new Date().toISOString() })
    .eq("calendar_id", calendarId)
    .eq("approval_status", "pending");

  if (error) return { error: `Failed to approve all: ${error.message}` };
  return {};
}

/** Rejecting a piece of content requires an explanation — this is the
 * only path to "rejected", combining the required comment and the status
 * change atomically so a rejection is never left unexplained. */
export async function rejectEntryWithCommentAction(
  entryId: string,
  calendarId: string,
  message: string
): Promise<CalendarActionState> {
  const trimmed = message.trim();
  if (!trimmed) return { error: "Tulis komentar atau referensi dulu sebelum menolak." };

  const supabase = await createClient();

  const { error: commentError } = await supabase.from("calendar_entry_comments").insert({
    entry_id: entryId,
    author: "client",
    message: trimmed,
  });
  if (commentError) return { error: `Failed to post comment: ${commentError.message}` };

  const { error: statusError } = await supabase
    .from("content_calendar_entries")
    .update({ approval_status: "rejected", approval_updated_at: new Date().toISOString() })
    .eq("id", entryId);
  if (statusError) return { error: `Failed to update approval status: ${statusError.message}` };

  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

// ---------------------------------------------------------------------------
// GLS (Growth Loop System) feedback log
// ---------------------------------------------------------------------------
export async function postGlsCommentAction(
  calendarId: string,
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = glsCommentFormSchema.safeParse({ client_comment: formData.get("client_comment") });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("calendar_gls_entries").insert({
    calendar_id: calendarId,
    client_comment: parsed.data.client_comment,
  });

  if (error) return { error: `Failed to post comment: ${error.message}` };

  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  revalidatePath(`/calendar/${calendarId}`);
  return {};
}

export async function resolveGlsEntryAction(
  entryId: string,
  calendarId: string,
  _prevState: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const parsed = glsResolutionFormSchema.safeParse({ resolution: formData.get("resolution") });
  if (!parsed.success) return { error: describeValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("calendar_gls_entries")
    .update({ resolution: parsed.data.resolution, is_resolved: true, resolved_at: new Date().toISOString() })
    .eq("id", entryId);

  if (error) return { error: `Failed to resolve: ${error.message}` };

  revalidatePath(`/admin/dashboard/calendars/${calendarId}`);
  return {};
}

// ---------------------------------------------------------------------------
// Client confirms a piece of content has gone live
// ---------------------------------------------------------------------------
export async function setClientConfirmedAction(entryId: string, confirmed: boolean): Promise<CalendarActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("content_calendar_entries").update({ client_confirmed: confirmed }).eq("id", entryId);
  if (error) return { error: `Failed to update: ${error.message}` };
  return {};
}
