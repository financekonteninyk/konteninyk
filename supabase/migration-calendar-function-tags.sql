-- Function tag: categorize content by marketing function (Trust, Awareness,
-- Engagement, Conversion, or anything custom the admin wants), each with
-- its own color for at-a-glance scanning on the calendar grid.
-- (reference_image_url already exists from the original calendar migration
-- — it was just never wired up to any UI until now.)
alter table public.content_calendar_entries add column if not exists function_tag text;
alter table public.content_calendar_entries add column if not exists function_color text;
