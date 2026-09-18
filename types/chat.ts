/** Row shape of the `chat_qa_entries` table — custom keyword-triggered answers for Hend Program. */
export interface ChatQaEntry {
  id: string;
  keywords: string[];
  answer_1: string;
  answer_2: string | null;
  answer_3: string | null;
  created_at: string;
}

/** Row shape of the `chat_unmatched_queries` table — questions Hend Program couldn't answer. */
export interface UnmatchedQuery {
  id: string;
  query_text: string;
  locale: string | null;
  created_at: string;
}
