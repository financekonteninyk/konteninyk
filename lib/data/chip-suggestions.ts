import { createClient } from "@/lib/supabase/server";

/** Fetch saved custom values for a chip field, most recent first. */
export async function getChipSuggestions(fieldKey: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chip_suggestions")
    .select("value")
    .eq("field_key", fieldKey)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error(`Failed to fetch chip suggestions for ${fieldKey}:`, error.message);
    return [];
  }

  return (data ?? []).map((row) => row.value);
}
