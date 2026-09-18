import { createClient } from "@/lib/supabase/server";
import type { ChatQaEntry, UnmatchedQuery } from "@/types/chat";

/** Fetch all custom Q&A entries, used both by the admin manager and the public chat widget. */
export async function getChatQaEntries(): Promise<ChatQaEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_qa_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch chat Q&A entries:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch the most recent unanswered questions, for the admin review screen. */
export async function getUnmatchedQueries(limit = 100): Promise<UnmatchedQuery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_unmatched_queries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch unmatched queries:", error.message);
    return [];
  }

  return data ?? [];
}
