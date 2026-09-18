-- Adds a personal/custom accent color per calendar, so each client's
-- calendar can feel tailored to their brand instead of one-size-fits-all.
-- Safe to run again if already applied.
alter table public.content_calendars add column if not exists background_color text;
