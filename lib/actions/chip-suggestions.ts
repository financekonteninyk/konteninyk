"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Remembers a value the user typed into a chip field, so it shows up as a
 * suggestion next time. Fire-and-forget — failures here should never break
 * the actual form submission, so this never throws.
 */
export async function rememberChipValue(fieldKey: string, value: string): Promise<void> {
  const trimmed = value.trim();
  if (!trimmed) return;

  try {
    const supabase = await createClient();
    await supabase.from("chip_suggestions").upsert({ field_key: fieldKey, value: trimmed }, { onConflict: "field_key,value" });
  } catch (error) {
    console.error(`Failed to remember chip value for ${fieldKey}:`, error);
  }
}

/** Remembers several chip values from one form submission at once. */
export async function rememberChipValues(entries: { fieldKey: string; value: string }[]): Promise<void> {
  await Promise.all(entries.map((e) => rememberChipValue(e.fieldKey, e.value)));
}
