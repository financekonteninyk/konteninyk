-- Strategy Gallery: instead of one cramped text field, a calendar can now
-- have several strategy documents (e.g. "Phase 1 Strategy", "Q1 Content
-- Pillars", "Brand Voice Guide") shown as browsable cards, each opening to
-- full detail. Safe to run again if already applied.
create table if not exists public.calendar_strategies (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references public.content_calendars(id) on delete cascade,
  title text not null,
  content text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists calendar_strategies_calendar_idx
  on public.calendar_strategies (calendar_id, sort_order);

drop trigger if exists calendar_strategies_set_updated_at on public.calendar_strategies;
create trigger calendar_strategies_set_updated_at before update on public.calendar_strategies
  for each row execute function public.set_updated_at();

alter table public.calendar_strategies enable row level security;

drop policy if exists "Authenticated can manage calendar strategies" on public.calendar_strategies;
create policy "Authenticated can manage calendar strategies" on public.calendar_strategies
  for all to authenticated using (true) with check (true);

drop policy if exists "Anyone can view calendar strategies by link" on public.calendar_strategies;
create policy "Anyone can view calendar strategies by link" on public.calendar_strategies
  for select to anon using (true);

-- Drive link for FINISHED content, shown separately from reference_url
-- (which is for inspiration/reference before the content is made).
alter table public.content_calendar_entries add column if not exists drive_url text;
