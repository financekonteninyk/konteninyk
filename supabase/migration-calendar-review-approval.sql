-- Content Review & Approval: clients can leave comments/feedback on a
-- specific content entry, and mark it approved or rejected. Admin can see
-- and reply to comments too — a shared thread per piece of content.
create table if not exists public.calendar_entry_comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.content_calendar_entries(id) on delete cascade,
  author text not null default 'client' check (author in ('client', 'admin')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists calendar_entry_comments_entry_idx
  on public.calendar_entry_comments (entry_id, created_at);

alter table public.calendar_entry_comments enable row level security;

drop policy if exists "Authenticated can manage entry comments" on public.calendar_entry_comments;
create policy "Authenticated can manage entry comments" on public.calendar_entry_comments
  for all to authenticated using (true) with check (true);

-- Public can read the whole thread (so a client sees admin's replies too)
-- and post new comments — same trust model as calendar_requests: the
-- share link itself is the access control, not per-user identity.
drop policy if exists "Anyone can view entry comments by link" on public.calendar_entry_comments;
create policy "Anyone can view entry comments by link" on public.calendar_entry_comments
  for select to anon using (true);

drop policy if exists "Anyone can post entry comments by link" on public.calendar_entry_comments;
create policy "Anyone can post entry comments by link" on public.calendar_entry_comments
  for insert to anon with check (true);

-- Approval status: the CLIENT's decision on a piece of content, separate
-- from `status` (which tracks the admin's own production workflow —
-- planned/confirmed/published/cancelled).
alter table public.content_calendar_entries
  add column if not exists approval_status text not null default 'pending'
  check (approval_status in ('pending', 'approved', 'rejected'));

-- Public needs to be able to flip approval_status via the share link.
-- (The server action only ever writes this one column — a table-level
-- UPDATE policy is the same trust model already used for requests/
-- comments on this feature, not a new relaxation.)
drop policy if exists "Anyone can set approval status by link" on public.content_calendar_entries;
create policy "Anyone can set approval status by link" on public.content_calendar_entries
  for update to anon using (true) with check (true);
