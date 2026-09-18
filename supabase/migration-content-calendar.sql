-- ============================================================================
-- CONTENT CALENDAR — persistent per-client content planning calendar with
-- a public, no-login shareable link, and a general client request inbox.
-- Safe to run on its own: only creates new tables, does not touch any
-- existing ones.
-- ============================================================================

create extension if not exists pgcrypto;

-- One calendar per client. Lives forever, spans many months (navigated
-- month-by-month in the UI, not recreated each month).
create table if not exists public.content_calendars (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  client_logo_url text,
  strategy_note text,
  -- Long random token used in the public share URL (/calendar/[token]).
  -- Access control here relies on the token being unguessable, not on a
  -- login — matches "anyone with the link" the way Google Docs does it.
  share_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_calendars_share_token_idx on public.content_calendars (share_token);

-- Individual planned days within a calendar.
create table if not exists public.content_calendar_entries (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references public.content_calendars(id) on delete cascade,
  entry_date date not null,
  content_type text not null,           -- e.g. "Reels", "Carousel", "Story", "Photo"
  description text,                     -- the plan/brief for that day
  reference_url text,                   -- optional external reference link
  reference_image_url text,             -- optional uploaded reference image
  status text not null default 'planned' check (status in ('planned', 'confirmed', 'published', 'cancelled')),
  -- 'admin' = normal, planned by Kontenin.yk as part of the regular schedule
  -- 'client_request' = originated from something a client asked for
  -- 'initiative' = Kontenin.yk's own creative initiative, outside the client's ask
  source text not null default 'admin' check (source in ('admin', 'client_request', 'initiative')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_calendar_entries_calendar_date_idx
  on public.content_calendar_entries (calendar_id, entry_date);

-- General, not-yet-scheduled requests or references submitted by a client
-- through the public share page. Admin reviews these and, if used, turns
-- one into an actual calendar entry (linked_entry_id records that link).
create table if not exists public.content_calendar_requests (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references public.content_calendars(id) on delete cascade,
  message text not null,
  reference_url text,
  status text not null default 'pending' check (status in ('pending', 'placed', 'dismissed')),
  linked_entry_id uuid references public.content_calendar_entries(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists content_calendar_requests_calendar_idx
  on public.content_calendar_requests (calendar_id, status);

-- Keeps updated_at current on edits.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists content_calendars_set_updated_at on public.content_calendars;
create trigger content_calendars_set_updated_at before update on public.content_calendars
  for each row execute function public.set_updated_at();

drop trigger if exists content_calendar_entries_set_updated_at on public.content_calendar_entries;
create trigger content_calendar_entries_set_updated_at before update on public.content_calendar_entries
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.content_calendars enable row level security;
alter table public.content_calendar_entries enable row level security;
alter table public.content_calendar_requests enable row level security;

-- Admin (authenticated) has full control over everything.
drop policy if exists "Authenticated can manage calendars" on public.content_calendars;
create policy "Authenticated can manage calendars" on public.content_calendars
  for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated can manage calendar entries" on public.content_calendar_entries;
create policy "Authenticated can manage calendar entries" on public.content_calendar_entries
  for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated can manage calendar requests" on public.content_calendar_requests;
create policy "Authenticated can manage calendar requests" on public.content_calendar_requests
  for all to authenticated using (true) with check (true);

-- Public (anon, no login) can VIEW calendars and entries — needed for the
-- share-link page. Protection comes from the token being unguessable, the
-- same trade-off "anyone with the link" sharing always makes.
drop policy if exists "Anyone can view calendars by link" on public.content_calendars;
create policy "Anyone can view calendars by link" on public.content_calendars
  for select to anon using (true);

drop policy if exists "Anyone can view calendar entries by link" on public.content_calendar_entries;
create policy "Anyone can view calendar entries by link" on public.content_calendar_entries
  for select to anon using (true);

-- Public can SUBMIT a request (insert only — they can never read, edit, or
-- delete requests, including ones they just submitted, or see anyone
-- else's).
drop policy if exists "Anyone can submit a calendar request" on public.content_calendar_requests;
create policy "Anyone can submit a calendar request" on public.content_calendar_requests
  for insert to anon with check (true);
