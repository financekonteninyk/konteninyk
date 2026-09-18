-- Replaces the color legend panel with something functional: a notes
-- field, and a countdown based on the collaboration's start/end dates.
alter table public.content_calendars add column if not exists contract_start_date date;
alter table public.content_calendars add column if not exists contract_end_date date;
alter table public.content_calendars add column if not exists notes text;
