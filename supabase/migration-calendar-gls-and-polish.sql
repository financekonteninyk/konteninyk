-- Editable strategy section title (defaults to "Strategi & Arah Konten" in the UI if left empty).
alter table public.content_calendars add column if not exists strategy_title text;

-- Lets the client tick off "yes, I've seen this went live" on published content.
alter table public.content_calendar_entries add column if not exists client_confirmed boolean not null default false;

-- GLS (Growth Loop System) feedback log — client writes a comment/issue,
-- admin writes a resolution, and it's marked resolved once addressed.
-- General to the calendar, not tied to a specific content entry.
create table if not exists public.calendar_gls_entries (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references public.content_calendars(id) on delete cascade,
  client_comment text not null,
  resolution text,
  is_resolved boolean not null default false,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists calendar_gls_entries_calendar_idx on public.calendar_gls_entries (calendar_id, created_at);

alter table public.calendar_gls_entries enable row level security;

drop policy if exists "Authenticated can manage GLS entries" on public.calendar_gls_entries;
create policy "Authenticated can manage GLS entries" on public.calendar_gls_entries
  for all to authenticated using (true) with check (true);

-- Public can post a comment and read the whole thread (same trust model
-- as requests/comments elsewhere in CFS — the link itself is the access
-- control). Resolution is added by admin only, via the authenticated
-- policy above.
drop policy if exists "Anyone can view GLS entries by link" on public.calendar_gls_entries;
create policy "Anyone can view GLS entries by link" on public.calendar_gls_entries
  for select to anon using (true);

drop policy if exists "Anyone can post a GLS comment by link" on public.calendar_gls_entries;
create policy "Anyone can post a GLS comment by link" on public.calendar_gls_entries
  for insert to anon with check (true);

-- Client also needs to be able to tick "client_confirmed" on entries —
-- same table already allows anon update for approval_status, so this
-- rides on the existing policy from the review/approval migration.
