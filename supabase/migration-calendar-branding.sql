-- Lets each calendar have its own customizable page title (instead of
-- the fixed "Kalender Konten" text) and its own WhatsApp number to show
-- on the public share page. Safe to run again if already applied.
alter table public.content_calendars add column if not exists page_title text;
alter table public.content_calendars add column if not exists whatsapp_number text;
