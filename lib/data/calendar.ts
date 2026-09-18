import { createClient } from "@/lib/supabase/server";
import type { ContentCalendar, ContentCalendarEntry, ContentCalendarRequest, CalendarStrategy, CalendarEntryComment, CalendarGlsEntry } from "@/types/calendar";

// ---------------------------------------------------------------------------
// Calendars (admin)
// ---------------------------------------------------------------------------
export async function getCalendars(): Promise<ContentCalendar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_calendars").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch calendars:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCalendarById(id: string): Promise<ContentCalendar | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_calendars").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Failed to fetch calendar:", error.message);
    return null;
  }
  return data;
}

// ---------------------------------------------------------------------------
// Calendar — public, by share token (no auth; used on /calendar/[token])
// ---------------------------------------------------------------------------
export async function getCalendarByShareToken(token: string): Promise<ContentCalendar | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_calendars").select("*").eq("share_token", token).maybeSingle();
  if (error) {
    console.error("Failed to fetch calendar by token:", error.message);
    return null;
  }
  return data;
}

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------
/** Entries for a calendar within a given month (inclusive range), sorted by date. */
export async function getCalendarEntriesForMonth(
  calendarId: string,
  monthStart: string,
  monthEnd: string
): Promise<ContentCalendarEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_calendar_entries")
    .select("*")
    .eq("calendar_id", calendarId)
    .gte("entry_date", monthStart)
    .lte("entry_date", monthEnd)
    .order("entry_date", { ascending: true });

  if (error) {
    console.error("Failed to fetch calendar entries:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Every entry for a calendar, with no date filtering — used so the admin
 * editor can navigate freely between months (even years back or forward)
 * without needing to refetch from the server each time. Fine at the scale
 * a single client's calendar realistically reaches; revisit with proper
 * windowed fetching if any one calendar grows into the thousands of rows.
 */
export async function getAllCalendarEntries(calendarId: string): Promise<ContentCalendarEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_calendar_entries")
    .select("*")
    .eq("calendar_id", calendarId)
    .order("entry_date", { ascending: true });

  if (error) {
    console.error("Failed to fetch all calendar entries:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCalendarEntryById(id: string): Promise<ContentCalendarEntry | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_calendar_entries").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Failed to fetch calendar entry:", error.message);
    return null;
  }
  return data;
}

// ---------------------------------------------------------------------------
// Requests (admin inbox)
// ---------------------------------------------------------------------------
export async function getCalendarRequests(calendarId: string): Promise<ContentCalendarRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_calendar_requests")
    .select("*")
    .eq("calendar_id", calendarId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch calendar requests:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPendingRequestCount(calendarId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("content_calendar_requests")
    .select("*", { count: "exact", head: true })
    .eq("calendar_id", calendarId)
    .eq("status", "pending");

  if (error) {
    console.error("Failed to count pending requests:", error.message);
    return 0;
  }
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Strategy Gallery
// ---------------------------------------------------------------------------
export async function getCalendarStrategies(calendarId: string): Promise<CalendarStrategy[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_strategies")
    .select("*")
    .eq("calendar_id", calendarId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch calendar strategies:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCalendarStrategyById(id: string): Promise<CalendarStrategy | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("calendar_strategies").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Failed to fetch calendar strategy:", error.message);
    return null;
  }
  return data;
}

// ---------------------------------------------------------------------------
// Content Review — comments per entry
// ---------------------------------------------------------------------------
export async function getEntryComments(entryId: string): Promise<CalendarEntryComment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_entry_comments")
    .select("*")
    .eq("entry_id", entryId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch entry comments:", error.message);
    return [];
  }
  return data ?? [];
}

/** All comments across a set of entries at once (e.g. every entry in a
 * calendar), grouped by entry_id — used so the whole page can load in one
 * round trip instead of fetching per-entry on demand. */
export async function getCommentsForEntries(entryIds: string[]): Promise<Record<string, CalendarEntryComment[]>> {
  if (entryIds.length === 0) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_entry_comments")
    .select("*")
    .in("entry_id", entryIds)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch comments for entries:", error.message);
    return {};
  }

  const grouped: Record<string, CalendarEntryComment[]> = {};
  for (const comment of data ?? []) {
    const list = grouped[comment.entry_id] ?? [];
    list.push(comment);
    grouped[comment.entry_id] = list;
  }
  return grouped;
}

// ---------------------------------------------------------------------------
// GLS (Growth Loop System) feedback log
// ---------------------------------------------------------------------------
export async function getGlsEntries(calendarId: string): Promise<CalendarGlsEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_gls_entries")
    .select("*")
    .eq("calendar_id", calendarId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch GLS entries:", error.message);
    return [];
  }
  return data ?? [];
}
