-- Logs when a client's approval decision (approved/rejected) was made —
-- shown as "Disetujui pada [tanggal]" in the Content Summary list.
alter table public.content_calendar_entries add column if not exists approval_updated_at timestamptz;
