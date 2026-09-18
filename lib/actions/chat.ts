"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { chatQaEntrySchema } from "@/lib/validations";

export interface ChatActionState {
  error?: string;
}

/** Adds a new custom Q&A entry. */
export async function addQaEntryAction(
  keywords: string[],
  answer1: string,
  answer2: string,
  answer3: string
): Promise<ChatActionState> {
  const parsed = chatQaEntrySchema.safeParse({
    keywords,
    answer_1: answer1,
    answer_2: answer2,
    answer_3: answer3,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("chat_qa_entries").insert({
    keywords: parsed.data.keywords,
    answer_1: parsed.data.answer_1,
    answer_2: parsed.data.answer_2 || null,
    answer_3: parsed.data.answer_3 || null,
  });

  if (error) return { error: `Failed to add Q&A entry: ${error.message}` };

  revalidatePath("/admin/dashboard/chat");
  return {};
}

/** Updates an existing Q&A entry. */
export async function updateQaEntryAction(
  id: string,
  keywords: string[],
  answer1: string,
  answer2: string,
  answer3: string
): Promise<ChatActionState> {
  const parsed = chatQaEntrySchema.safeParse({
    keywords,
    answer_1: answer1,
    answer_2: answer2,
    answer_3: answer3,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("chat_qa_entries")
    .update({
      keywords: parsed.data.keywords,
      answer_1: parsed.data.answer_1,
      answer_2: parsed.data.answer_2 || null,
      answer_3: parsed.data.answer_3 || null,
    })
    .eq("id", id);

  if (error) return { error: `Failed to update Q&A entry: ${error.message}` };

  revalidatePath("/admin/dashboard/chat");
  return {};
}

/** Deletes a Q&A entry. */
export async function deleteQaEntryAction(id: string): Promise<ChatActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("chat_qa_entries").delete().eq("id", id);
  if (error) return { error: `Failed to delete Q&A entry: ${error.message}` };

  revalidatePath("/admin/dashboard/chat");
  return {};
}

/** Logs a question CS Kontenin.yk couldn't answer. Called from the public chat widget. */
export async function logUnmatchedQueryAction(queryText: string, locale: string): Promise<void> {
  const trimmed = queryText.trim();
  if (!trimmed) return;

  const supabase = await createClient();
  await supabase.from("chat_unmatched_queries").insert({ query_text: trimmed, locale });
}

/** Deletes a single unmatched-query log entry (after reviewing it). */
export async function deleteUnmatchedQueryAction(id: string): Promise<ChatActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("chat_unmatched_queries").delete().eq("id", id);
  if (error) return { error: `Failed to delete: ${error.message}` };

  revalidatePath("/admin/dashboard/chat");
  return {};
}

export interface BulkImportResult {
  error?: string;
  importedCount?: number;
  skippedCount?: number;
}

/**
 * Inserts many Q&A entries at once from a parsed CSV/table upload.
 * Invalid rows (no keywords or no first answer) are silently skipped and
 * counted, rather than failing the whole batch.
 */
export async function bulkImportQaEntriesAction(
  rows: { keywords: string[]; answer_1: string; answer_2: string; answer_3: string }[]
): Promise<BulkImportResult> {
  if (rows.length === 0) return { error: "No valid rows found in the file." };

  const validRows: { keywords: string[]; answer_1: string; answer_2: string | null; answer_3: string | null }[] = [];
  let skippedCount = 0;

  for (const row of rows) {
    const parsed = chatQaEntrySchema.safeParse(row);
    if (!parsed.success) {
      skippedCount++;
      continue;
    }
    validRows.push({
      keywords: parsed.data.keywords,
      answer_1: parsed.data.answer_1,
      answer_2: parsed.data.answer_2 || null,
      answer_3: parsed.data.answer_3 || null,
    });
  }

  if (validRows.length === 0) {
    return { error: "None of the rows were valid — check that each has keywords and at least one answer." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("chat_qa_entries").insert(validRows);

  if (error) return { error: `Failed to import: ${error.message}` };

  revalidatePath("/admin/dashboard/chat");
  return { importedCount: validRows.length, skippedCount };
}

/** Deletes ALL logged unanswered questions at once (after exporting/reviewing them). */
export async function clearAllUnmatchedQueriesAction(): Promise<ChatActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("chat_unmatched_queries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) return { error: `Failed to clear: ${error.message}` };

  revalidatePath("/admin/dashboard/chat");
  return {};
}

/** Deletes ALL custom Q&A entries at once — useful before re-uploading a fresh CSV batch. */
export async function clearAllQaEntriesAction(): Promise<ChatActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("chat_qa_entries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) return { error: `Failed to clear: ${error.message}` };

  revalidatePath("/admin/dashboard/chat");
  return {};
}
