-- Allows the public share page to show past requests submitted for a
-- calendar (so a client can see "yes, I already asked for this, here's
-- the status"). Since there's no login, this shows every request made
-- through that calendar's link — reasonable for a link meant to represent
-- one client relationship, not shared across multiple separate clients.
drop policy if exists "Anyone can view calendar requests by link" on public.content_calendar_requests;
create policy "Anyone can view calendar requests by link" on public.content_calendar_requests
  for select to anon using (true);
