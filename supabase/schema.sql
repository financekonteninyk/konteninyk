-- ============================================================================
-- Kontenin.yk — Schema v2 (Fase 1: Client + Video Foundation)
-- Run this entire file in the Supabase SQL Editor.
-- Safe to run on a fresh project OR on top of the v1 schema (migrates
-- existing `projects` data into the new `clients` + `videos` model instead
-- of destroying it — the old table is renamed to `projects_legacy`, never
-- dropped).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. SITE SETTINGS (singleton row — global editable content)
-- ============================================================================
create table if not exists public.site_settings (
  id int primary key default 1,
  site_logo_url text,                -- small logo used in the header/nav and admin sidebar
  hero_logo_url text,                 -- large logo shown in the homepage Hero (can differ from the header logo)
  hero_logo_width int not null default 200,   -- manual size control, in pixels
  hero_logo_height int not null default 80,
  tagline text not null default 'Helping Brands Build Consistent Content That Grows.',
  hero_badge_text text not null default 'Content Production Studio',
  hero_heading text not null default 'Kontenin.yk',
  hero_description text not null default 'We help brands turn ideas into scroll-stopping short-form content.',
  spline_scene_url text,             -- embeddable Spline/3D scene URL for the hero (editable, swap anytime)
  about_text text not null default 'Kontenin.yk is a content production studio helping brands build consistent, growth-driven content across social platforms.',
  about_vision text,                  -- optional, shown on the dedicated /about page
  about_mission text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- Safe to re-run: adds bilingual (Indonesian/English) columns. The original
-- single-language columns above are kept as-is (never dropped) so no
-- existing content is lost; the block below backfills the new columns from
-- them so you start with your current text in both languages, then edit
-- each language separately from the admin.
alter table public.site_settings add column if not exists tagline_id text;
alter table public.site_settings add column if not exists tagline_en text;
alter table public.site_settings add column if not exists hero_badge_text_id text;
alter table public.site_settings add column if not exists hero_badge_text_en text;
alter table public.site_settings add column if not exists hero_heading_id text;
alter table public.site_settings add column if not exists hero_heading_en text;
alter table public.site_settings add column if not exists hero_description_id text;
alter table public.site_settings add column if not exists hero_description_en text;
alter table public.site_settings add column if not exists about_text_id text;
alter table public.site_settings add column if not exists about_text_en text;
alter table public.site_settings add column if not exists about_vision_id text;
alter table public.site_settings add column if not exists about_vision_en text;
alter table public.site_settings add column if not exists about_mission_id text;
alter table public.site_settings add column if not exists about_mission_en text;
alter table public.site_settings add column if not exists stats_text_id text;
alter table public.site_settings add column if not exists stat_1_value text;
alter table public.site_settings add column if not exists stat_1_label_id text;
alter table public.site_settings add column if not exists stat_1_label_en text;
alter table public.site_settings add column if not exists stat_2_value text;
alter table public.site_settings add column if not exists stat_2_label_id text;
alter table public.site_settings add column if not exists stat_2_label_en text;
alter table public.site_settings add column if not exists stat_3_value text;
alter table public.site_settings add column if not exists stat_3_label_id text;
alter table public.site_settings add column if not exists stat_3_label_en text;
alter table public.site_settings add column if not exists stat_4_value text;
alter table public.site_settings add column if not exists stat_4_label_id text;
alter table public.site_settings add column if not exists stat_4_label_en text;

update public.site_settings set stat_1_value = coalesce(stat_1_value, '100+');
update public.site_settings set stat_1_label_id = coalesce(stat_1_label_id, 'Konten Dibuat');
update public.site_settings set stat_1_label_en = coalesce(stat_1_label_en, 'Pieces of Content');
update public.site_settings set stat_2_value = coalesce(stat_2_value, '20+');
update public.site_settings set stat_2_label_id = coalesce(stat_2_label_id, 'Brand Dipercaya');
update public.site_settings set stat_2_label_en = coalesce(stat_2_label_en, 'Brands Trusted');
update public.site_settings set stat_3_value = coalesce(stat_3_value, '7');
update public.site_settings set stat_3_label_id = coalesce(stat_3_label_id, 'Growth Loop System Mingguan');
update public.site_settings set stat_3_label_en = coalesce(stat_3_label_en, 'Weekly Growth Loop Cycles');
update public.site_settings set stat_4_value = coalesce(stat_4_value, '100%');
update public.site_settings set stat_4_label_id = coalesce(stat_4_label_id, 'Fokus Strategi & Kreatif');
update public.site_settings set stat_4_label_en = coalesce(stat_4_label_en, 'Strategy & Creative Focus');
alter table public.site_settings add column if not exists stats_text_en text;
alter table public.site_settings add column if not exists nav_portfolio_id text;
alter table public.site_settings add column if not exists nav_portfolio_en text;
alter table public.site_settings add column if not exists nav_process_id text;
alter table public.site_settings add column if not exists nav_process_en text;
alter table public.site_settings add column if not exists nav_services_id text;
alter table public.site_settings add column if not exists nav_services_en text;
alter table public.site_settings add column if not exists nav_about_id text;
alter table public.site_settings add column if not exists nav_about_en text;
alter table public.site_settings add column if not exists nav_cta_id text;
alter table public.site_settings add column if not exists nav_cta_en text;

update public.site_settings set nav_portfolio_id = coalesce(nav_portfolio_id, 'Portofolio');
update public.site_settings set nav_portfolio_en = coalesce(nav_portfolio_en, 'Portfolio');
update public.site_settings set nav_process_id = coalesce(nav_process_id, 'Cara Kerja');
update public.site_settings set nav_process_en = coalesce(nav_process_en, 'How We Work');
update public.site_settings set nav_services_id = coalesce(nav_services_id, 'Layanan');
update public.site_settings set nav_services_en = coalesce(nav_services_en, 'Services');
update public.site_settings set nav_about_id = coalesce(nav_about_id, 'Tentang');
update public.site_settings set nav_about_en = coalesce(nav_about_en, 'About');
update public.site_settings set nav_cta_id = coalesce(nav_cta_id, 'Konsultasi Gratis');
update public.site_settings set nav_cta_en = coalesce(nav_cta_en, 'Free Consultation');
-- This header button used to link to the admin login page — it's now a client-facing
-- WhatsApp CTA instead. If you never customized the text, upgrade it automatically;
-- if you did customize it, this leaves your text untouched.
update public.site_settings set nav_cta_id = 'Konsultasi Gratis' where nav_cta_id = 'Masuk Mode Admin';
update public.site_settings set nav_cta_en = 'Free Consultation' where nav_cta_en = 'Enter Admin Mode';

alter table public.site_settings add column if not exists invoice_company_name text;
alter table public.site_settings add column if not exists invoice_company_sub text;
alter table public.site_settings add column if not exists invoice_company_address text;
alter table public.site_settings add column if not exists invoice_company_email text;
alter table public.site_settings add column if not exists invoice_company_wa text;
alter table public.site_settings add column if not exists invoice_company_web text;
alter table public.site_settings add column if not exists invoice_company_npwp text;
alter table public.site_settings add column if not exists invoice_qris_url text;
alter table public.site_settings add column if not exists invoice_footer_note text;

update public.site_settings set invoice_company_name = coalesce(invoice_company_name, 'Kontenin.yk');
update public.site_settings set invoice_company_sub = coalesce(invoice_company_sub, 'Creative Agency');
update public.site_settings set invoice_company_address = coalesce(invoice_company_address, 'Yogyakarta, Indonesia');
update public.site_settings set invoice_footer_note = coalesce(invoice_footer_note, 'Thank you for partnering your digital marketing and media creation with Kontenin.yk. Timely remittance ensures sustained creative output of the highest caliber.');
alter table public.site_settings add column if not exists whatsapp_url text;
alter table public.site_settings add column if not exists chat_bot_logo_url text;
alter table public.site_settings add column if not exists chat_knowledge_text text;
alter table public.site_settings add column if not exists whatsapp_icon_url text;
alter table public.site_settings add column if not exists gls_icon_url text;

update public.site_settings set tagline_id = coalesce(tagline_id, tagline), tagline_en = coalesce(tagline_en, tagline);
update public.site_settings set hero_badge_text_id = coalesce(hero_badge_text_id, hero_badge_text), hero_badge_text_en = coalesce(hero_badge_text_en, hero_badge_text);
update public.site_settings set hero_heading_id = coalesce(hero_heading_id, hero_heading), hero_heading_en = coalesce(hero_heading_en, hero_heading);
update public.site_settings set hero_description_id = coalesce(hero_description_id, hero_description), hero_description_en = coalesce(hero_description_en, hero_description);
update public.site_settings set about_text_id = coalesce(about_text_id, about_text), about_text_en = coalesce(about_text_en, about_text);
update public.site_settings set about_vision_id = coalesce(about_vision_id, about_vision), about_vision_en = coalesce(about_vision_en, about_vision);
update public.site_settings set about_mission_id = coalesce(about_mission_id, about_mission), about_mission_en = coalesce(about_mission_en, about_mission);
update public.site_settings set stats_text_id = coalesce(stats_text_id, '100+ Konten Diproduksi Untuk Klien Kami');
update public.site_settings set stats_text_en = coalesce(stats_text_en, '100+ Pieces Of Content Produced For Our Clients');

-- Safe to re-run: adds the About-page columns for installs created before they existed.
alter table public.site_settings add column if not exists about_vision text;
alter table public.site_settings add column if not exists about_mission text;

-- Safe to re-run: adds the separate Hero logo + manual size columns.
alter table public.site_settings add column if not exists hero_logo_url text;
alter table public.site_settings add column if not exists hero_logo_width int not null default 200;
alter table public.site_settings add column if not exists hero_logo_height int not null default 80;

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- ============================================================================
-- 1B. ABOUT TIMELINE (brand journey — shown on the /about page)
-- ============================================================================
create table if not exists public.about_timeline (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists about_timeline_sort_order_idx
  on public.about_timeline (sort_order);

alter table public.about_timeline enable row level security;

drop policy if exists "Public can view timeline" on public.about_timeline;
create policy "Public can view timeline"
  on public.about_timeline for select to anon, authenticated using (true);

drop policy if exists "Authenticated can manage timeline" on public.about_timeline;
create policy "Authenticated can manage timeline"
  on public.about_timeline for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1C. ABOUT VALUES (core brand values — shown on the /about page)
-- ============================================================================
create table if not exists public.about_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists about_values_sort_order_idx on public.about_values (sort_order);
alter table public.about_values enable row level security;

drop policy if exists "Public can view values" on public.about_values;
create policy "Public can view values"
  on public.about_values for select to anon, authenticated using (true);

drop policy if exists "Authenticated can manage values" on public.about_values;
create policy "Authenticated can manage values"
  on public.about_values for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1D. ABOUT AWARDS (recognitions — shown on the /about page)
-- ============================================================================
create table if not exists public.about_awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  year text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists about_awards_sort_order_idx on public.about_awards (sort_order);
alter table public.about_awards enable row level security;

drop policy if exists "Public can view awards" on public.about_awards;
create policy "Public can view awards"
  on public.about_awards for select to anon, authenticated using (true);

drop policy if exists "Authenticated can manage awards" on public.about_awards;
create policy "Authenticated can manage awards"
  on public.about_awards for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1E. ABOUT GALLERY (behind-the-scenes photos — shown on the /about page)
-- ============================================================================
create table if not exists public.about_gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists about_gallery_sort_order_idx on public.about_gallery (sort_order);
alter table public.about_gallery enable row level security;

drop policy if exists "Public can view gallery" on public.about_gallery;
create policy "Public can view gallery"
  on public.about_gallery for select to anon, authenticated using (true);

drop policy if exists "Authenticated can manage gallery" on public.about_gallery;
create policy "Authenticated can manage gallery"
  on public.about_gallery for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1F. ABOUT TOOLS (tools/software used — shown on the /about page)
-- ============================================================================
create table if not exists public.about_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists about_tools_sort_order_idx on public.about_tools (sort_order);
alter table public.about_tools enable row level security;

drop policy if exists "Public can view tools" on public.about_tools;
create policy "Public can view tools"
  on public.about_tools for select to anon, authenticated using (true);

drop policy if exists "Authenticated can manage tools" on public.about_tools;
create policy "Authenticated can manage tools"
  on public.about_tools for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1G. CHAT Q&A ENTRIES (custom, admin-managed answers for Hend Program)
-- ============================================================================
create table if not exists public.chat_qa_entries (
  id uuid primary key default gen_random_uuid(),
  keywords text[] not null default '{}',   -- trigger words/phrases
  answer_1 text not null,
  answer_2 text,                            -- optional, up to 3 randomized variants
  answer_3 text,
  created_at timestamptz not null default now()
);

alter table public.chat_qa_entries enable row level security;

drop policy if exists "Public can view qa entries" on public.chat_qa_entries;
create policy "Public can view qa entries"
  on public.chat_qa_entries for select to anon, authenticated using (true);

drop policy if exists "Authenticated can manage qa entries" on public.chat_qa_entries;
create policy "Authenticated can manage qa entries"
  on public.chat_qa_entries for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1H. CHAT UNMATCHED QUERIES (log of questions Hend Program couldn't answer)
-- ============================================================================
create table if not exists public.chat_unmatched_queries (
  id uuid primary key default gen_random_uuid(),
  query_text text not null,
  locale text,
  created_at timestamptz not null default now()
);

create index if not exists chat_unmatched_queries_created_at_idx
  on public.chat_unmatched_queries (created_at desc);

alter table public.chat_unmatched_queries enable row level security;

-- Any visitor (even logged out) can log a question the bot couldn't answer.
drop policy if exists "Public can log unmatched queries" on public.chat_unmatched_queries;
create policy "Public can log unmatched queries"
  on public.chat_unmatched_queries for insert to anon, authenticated with check (true);

-- Only admins can read/clear the log — it's internal analytics, not public content.
drop policy if exists "Authenticated can view unmatched queries" on public.chat_unmatched_queries;
create policy "Authenticated can view unmatched queries"
  on public.chat_unmatched_queries for select to authenticated using (true);

drop policy if exists "Authenticated can delete unmatched queries" on public.chat_unmatched_queries;
create policy "Authenticated can delete unmatched queries"
  on public.chat_unmatched_queries for delete to authenticated using (true);

-- ============================================================================
-- 1I. INVOICES (internal billing tool)
-- ============================================================================
-- ============================================================================
-- 1I. INVOICE BANK ACCOUNTS (must exist before invoices, which references it)
-- ============================================================================
create table if not exists public.invoice_bank_accounts (
  id uuid primary key default gen_random_uuid(),
  bank_name text not null,
  account_number text not null,
  account_holder text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table public.invoice_bank_accounts enable row level security;

drop policy if exists "Authenticated can manage bank accounts" on public.invoice_bank_accounts;
create policy "Authenticated can manage bank accounts"
  on public.invoice_bank_accounts for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1I-2. INVOICES (internal billing tool — mirrors the Kontenin.yk invoice app)
-- ============================================================================
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  doc_type text not null default 'keluar' check (doc_type in ('keluar', 'masuk')),  -- keluar = billing a client, masuk = a vendor/freelancer bill
  currency text not null default 'IDR',
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  client_company text,
  client_whatsapp text,
  client_email text,
  client_logo_url text,
  payment_purpose text,
  items jsonb not null default '[]',   -- [{ description, quantity, unit_price }]
  discount_percent numeric not null default 0,
  tax_percent numeric not null default 0,
  total numeric not null default 0,
  bank_account_id uuid references public.invoice_bank_accounts(id) on delete set null,
  show_qris boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'unpaid', 'paid', 'partially_paid', 'cancelled')),
  issue_date date not null default current_date,
  due_date date,
  paid_date date,   -- when payment/proof-of-transfer was actually received — set manually, not automatic
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run: brings an earlier, simpler version of this table (from a
-- prior update) up to the full shape above without losing any data.
alter table public.invoices add column if not exists doc_type text not null default 'keluar';
alter table public.invoices add column if not exists currency text not null default 'IDR';
alter table public.invoices add column if not exists client_company text;
alter table public.invoices add column if not exists client_whatsapp text;
alter table public.invoices add column if not exists client_email text;
alter table public.invoices add column if not exists client_logo_url text;
alter table public.invoices add column if not exists payment_purpose text;
alter table public.invoices add column if not exists discount_percent numeric not null default 0;
alter table public.invoices add column if not exists bank_account_id uuid references public.invoice_bank_accounts(id) on delete set null;
alter table public.invoices add column if not exists show_qris boolean not null default true;
alter table public.invoices add column if not exists paid_date date;
alter table public.invoices add column if not exists transaction_code text;
alter table public.invoices add column if not exists sender_bank text;

alter table public.invoices drop constraint if exists invoices_status_check;
alter table public.invoices add constraint invoices_status_check
  check (status in ('draft', 'unpaid', 'paid', 'partially_paid', 'cancelled'));

alter table public.invoices drop constraint if exists invoices_doc_type_check;
alter table public.invoices add constraint invoices_doc_type_check
  check (doc_type in ('keluar', 'masuk'));

create index if not exists invoices_status_idx on public.invoices (status);
create index if not exists invoices_issue_date_idx on public.invoices (issue_date);

alter table public.invoices enable row level security;

drop policy if exists "Authenticated can manage invoices" on public.invoices;
create policy "Authenticated can manage invoices"
  on public.invoices for all to authenticated using (true) with check (true);

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 1J. TOOL LINKS (internal resource/bookmark directory — Drive folders, VFX
-- assets, schedules, etc.)
-- ============================================================================
create table if not exists public.tool_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  category text,               -- e.g. "Mentahan", "VFX & Overlay", "Jadwal", "Brand Assets"
  icon_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists tool_links_sort_order_idx on public.tool_links (sort_order);

alter table public.tool_links enable row level security;

drop policy if exists "Authenticated can manage tool links" on public.tool_links;
create policy "Authenticated can manage tool links"
  on public.tool_links for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1K. ADMIN NOTES (simple task/notes widget on the dashboard)
-- ============================================================================
create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  is_done boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.admin_notes enable row level security;

drop policy if exists "Authenticated can manage notes" on public.admin_notes;
create policy "Authenticated can manage notes"
  on public.admin_notes for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1L. EDITING STANDARDS (reference specs — file sizes, color codes, export
-- settings — shown on the dashboard for the team to check against)
-- ============================================================================
create table if not exists public.editing_standards (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'General',   -- e.g. "Video Export", "Brand Colors", "File Naming"
  label text not null,                          -- e.g. "Instagram Reels Format"
  value text not null,                          -- e.g. "MP4, H.264, 1080x1920, under 100MB"
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.editing_standards enable row level security;

drop policy if exists "Authenticated can manage editing standards" on public.editing_standards;
create policy "Authenticated can manage editing standards"
  on public.editing_standards for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1M. INVOICE SERVICES CATALOG (a price list you can quickly pick from when
-- adding line items to an invoice — e.g. "Editing Only - Basic" @ 500000)
-- ============================================================================
create table if not exists public.invoice_services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null default 0,
  category text,
  created_at timestamptz not null default now()
);

alter table public.invoice_services enable row level security;

drop policy if exists "Authenticated can manage invoice services" on public.invoice_services;
create policy "Authenticated can manage invoice services"
  on public.invoice_services for all to authenticated using (true) with check (true);

-- ============================================================================
-- 1N. PRICING CATEGORIES (admin-editable price lists — "Content Packages",
-- "Editing Only", "Personal Branding", etc. — each with its own tiers)
-- ============================================================================
create table if not exists public.pricing_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,                 -- e.g. "Content Packages"
  subtitle text,                       -- e.g. "Bantu Brand Kamu Ngonten Lebih Masif"
  tiers jsonb not null default '[]',
  -- tiers: [{ name, price, badge, description,
  --           features: [{ label, value }] }]
  -- value is a free string: "true" for a plain checkmark, "false" for a
  -- dash (not included), or any other text ("4", "1 Week", "Unlimited").
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pricing_categories_sort_order_idx on public.pricing_categories (sort_order);

alter table public.pricing_categories enable row level security;

drop policy if exists "Public can view published pricing" on public.pricing_categories;
create policy "Public can view published pricing"
  on public.pricing_categories for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Authenticated can view all pricing" on public.pricing_categories;
create policy "Authenticated can view all pricing"
  on public.pricing_categories for select to authenticated using (true);

drop policy if exists "Authenticated can manage pricing" on public.pricing_categories;
drop policy if exists "Authenticated can insert pricing" on public.pricing_categories;
drop policy if exists "Authenticated can update pricing" on public.pricing_categories;
drop policy if exists "Authenticated can delete pricing" on public.pricing_categories;
create policy "Authenticated can insert pricing"
  on public.pricing_categories for insert to authenticated with check (true);
create policy "Authenticated can update pricing"
  on public.pricing_categories for update to authenticated using (true) with check (true);
create policy "Authenticated can delete pricing"
  on public.pricing_categories for delete to authenticated using (true);

drop trigger if exists pricing_categories_set_updated_at on public.pricing_categories;
create trigger pricing_categories_set_updated_at
  before update on public.pricing_categories
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 1O. ACTIVITY PHOTOS (behind-the-scenes / work-in-progress photos — reused
-- as a moving carousel across the Hero, Services, and Portfolio sections)
-- ============================================================================
create table if not exists public.activity_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists activity_photos_sort_order_idx on public.activity_photos (sort_order);

alter table public.activity_photos enable row level security;

drop policy if exists "Public can view activity photos" on public.activity_photos;
create policy "Public can view activity photos"
  on public.activity_photos for select to anon, authenticated using (true);

drop policy if exists "Authenticated can insert activity photos" on public.activity_photos;
create policy "Authenticated can insert activity photos"
  on public.activity_photos for insert to authenticated with check (true);

drop policy if exists "Authenticated can delete activity photos" on public.activity_photos;
create policy "Authenticated can delete activity photos"
  on public.activity_photos for delete to authenticated using (true);

-- ============================================================================
-- 1P. PROPOSALS ("Penawaran") — sent to prospective clients after a
-- discovery conversation: concept, strategy, and pricing in one document.
-- ============================================================================
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  proposal_number text not null unique,
  client_name text not null,
  client_company text,
  project_title text not null,
  objective text,                       -- e.g. "Meningkatkan Engagement Instagram"
  background text,                       -- context: why this proposal exists
  account_analysis text,                 -- optional: findings from auditing their current account
  strategy text,                         -- the core concept / recommended approach
  scope_items jsonb not null default '[]',       -- [{ label }]
  investment_items jsonb not null default '[]',  -- [{ description, price }]
  investment_note text,                  -- e.g. "Harga berlaku untuk 1 bulan pertama"
  timeline text,                         -- phases / working timeline, freeform
  valid_until date,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.proposals enable row level security;
drop policy if exists "Authenticated can manage proposals" on public.proposals;
create policy "Authenticated can manage proposals" on public.proposals for all to authenticated using (true) with check (true);

drop trigger if exists proposals_set_updated_at on public.proposals;
create trigger proposals_set_updated_at before update on public.proposals
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 1Q. EXPENSES ("Pengeluaran") — money going OUT of Kontenin.yk: paying
-- freelancers, designers, salaries. Each one can print as a payment voucher.
-- ============================================================================
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  voucher_number text not null unique,
  category text not null default 'General',   -- e.g. "Freelancer Payment", "Salary", "Design Service"
  paid_to text not null,
  role text,                            -- e.g. "Freelance Video Editor" — their role on the project
  work_period text,                     -- e.g. "1 - 31 July 2026"
  description text,
  amount numeric not null default 0,
  payment_date date not null default current_date,
  payment_method text,                  -- e.g. "Transfer BCA", "Cash", "QRIS"
  transaction_code text,                -- bank transfer reference number
  sender_bank text,                     -- the bank Kontenin.yk sent from
  receiver_bank text,                   -- the recipient's bank
  proof_url text,                       -- optional uploaded transfer receipt
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run: brings an earlier version of this table up to the full shape above.
alter table public.expenses add column if not exists role text;
alter table public.expenses add column if not exists work_period text;
alter table public.expenses add column if not exists transaction_code text;
alter table public.expenses add column if not exists sender_bank text;
alter table public.expenses add column if not exists receiver_bank text;
alter table public.expenses add column if not exists expense_type text not null default 'operational';
alter table public.expenses add column if not exists personal_note text;
alter table public.expenses drop constraint if exists expenses_expense_type_check;
alter table public.expenses add constraint expenses_expense_type_check
  check (expense_type in ('operational', 'capital'));

alter table public.expenses enable row level security;
drop policy if exists "Authenticated can manage expenses" on public.expenses;
create policy "Authenticated can manage expenses" on public.expenses for all to authenticated using (true) with check (true);

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at before update on public.expenses
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 1R. MOU DOCUMENTS — Memorandum of Understanding for clients or
-- freelancers, printable and ready to sign.
-- ============================================================================
create table if not exists public.mou_documents (
  id uuid primary key default gen_random_uuid(),
  mou_number text not null unique,
  party_type text not null default 'client' check (party_type in ('client', 'freelancer')),
  party_name text not null,
  party_company text,
  project_title text not null,
  scope text,                           -- description of work covered
  terms text,                           -- terms & conditions, freeform
  compensation text,                    -- payment terms
  duration text,                        -- project duration / timeline
  effective_date date not null default current_date,
  status text not null default 'draft' check (status in ('draft', 'sent', 'signed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mou_documents enable row level security;
drop policy if exists "Authenticated can manage mou documents" on public.mou_documents;
create policy "Authenticated can manage mou documents" on public.mou_documents for all to authenticated using (true) with check (true);

drop trigger if exists mou_documents_set_updated_at on public.mou_documents;
create trigger mou_documents_set_updated_at before update on public.mou_documents
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 1S. FREELANCER OFFERS — a work offer sent to a freelancer before a
-- project starts: price, job scope, specifications, and deadline.
-- Styled like a payment voucher (big price up top) but it's an offer,
-- not a completed payment.
-- ============================================================================
create table if not exists public.freelancer_offers (
  id uuid primary key default gen_random_uuid(),
  offer_number text not null unique,
  freelancer_name text not null,
  job_title text not null,              -- e.g. "Design Carousel"
  price numeric not null default 0,
  specifications text,                  -- detailed scope / requirements
  project_deadline date,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.freelancer_offers enable row level security;
drop policy if exists "Authenticated can manage freelancer offers" on public.freelancer_offers;
create policy "Authenticated can manage freelancer offers" on public.freelancer_offers for all to authenticated using (true) with check (true);

drop trigger if exists freelancer_offers_set_updated_at on public.freelancer_offers;
create trigger freelancer_offers_set_updated_at before update on public.freelancer_offers
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 1T. CHIP SUGGESTIONS — remembers custom values you've typed into chip
-- fields (category, paid_to, role, payment_method, etc.) across the admin,
-- so they show up as clickable suggestions next time. One shared table,
-- keyed by a "field_key" so every chip field can grow its own list.
-- ============================================================================
create table if not exists public.chip_suggestions (
  id uuid primary key default gen_random_uuid(),
  field_key text not null,
  value text not null,
  created_at timestamptz not null default now(),
  unique (field_key, value)
);

create index if not exists chip_suggestions_field_key_idx on public.chip_suggestions (field_key);

alter table public.chip_suggestions enable row level security;
drop policy if exists "Authenticated can manage chip suggestions" on public.chip_suggestions;
create policy "Authenticated can manage chip suggestions" on public.chip_suggestions for all to authenticated using (true) with check (true);

-- Storage bucket for About-page images (gallery photos + tool logos)
insert into storage.buckets (id, name, public)
values ('about-assets', 'about-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public read about-assets" on storage.objects;
create policy "Public read about-assets"
  on storage.objects for select to anon, authenticated using (bucket_id = 'about-assets');

drop policy if exists "Authenticated upload about-assets" on storage.objects;
create policy "Authenticated upload about-assets"
  on storage.objects for insert to authenticated with check (bucket_id = 'about-assets');

drop policy if exists "Authenticated update about-assets" on storage.objects;
create policy "Authenticated update about-assets"
  on storage.objects for update to authenticated using (bucket_id = 'about-assets');

drop policy if exists "Authenticated delete about-assets" on storage.objects;
create policy "Authenticated delete about-assets"
  on storage.objects for delete to authenticated using (bucket_id = 'about-assets');

-- ============================================================================
-- 2. CATEGORIES & SERVICES (dynamic, admin-manageable lookup lists)
-- ============================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  stage text not null default 'production',
  created_at timestamptz not null default now()
);

-- Safe to re-run: adds the `stage` column for installs created before it existed.
alter table public.services add column if not exists stage text not null default 'production';

insert into public.categories (name) values
  ('F&B'), ('Property'), ('Personal Branding'), ('Corporate'),
  ('Event'), ('Fashion'), ('Digital Marketing')
on conflict (name) do nothing;

insert into public.services (name, stage) values
  ('Strategy', 'strategy'),
  ('Creative Direction', 'strategy'),
  ('Shooting', 'production'),
  ('Editing', 'production'),
  ('Photography', 'production'),
  ('Motion Graphic', 'production'),
  ('Copywriting', 'production'),
  ('Content Production', 'production'),
  ('Social Media Management', 'growth')
on conflict (name) do nothing;

-- Backfill sensible stages for known service names on installs that already
-- had these rows before the `stage` column existed (safe to re-run).
update public.services set stage = 'strategy' where name in ('Strategy', 'Creative Direction') and stage = 'production';
update public.services set stage = 'growth' where name in ('Social Media Management') and stage = 'production';

-- ============================================================================
-- 3. CLIENTS (formerly "projects" — one page per brand)
-- ============================================================================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  cover_thumbnail_url text,          -- landscape cover, shown on the portfolio grid
  category text not null,
  industry text,
  description text not null default '',
  period text,                        -- e.g. "Jan 2023 - Sekarang"
  services text[] not null default '{}',
  brand_color text,                   -- optional hex accent color for the client page
  website_url text,
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  case_study_challenge text,          -- optional Case Study section, shown on the client page
  case_study_strategy text,
  case_study_production text,
  case_study_result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run: adds fields used by the admin dashboard's client map and contacts panel.
alter table public.clients add column if not exists city text;
alter table public.clients add column if not exists whatsapp_number text;

-- Safe to re-run: adds the Case Study columns for installs created before they existed.
alter table public.clients add column if not exists case_study_challenge text;
alter table public.clients add column if not exists case_study_strategy text;
alter table public.clients add column if not exists case_study_production text;
alter table public.clients add column if not exists case_study_result text;

create index if not exists clients_status_created_at_idx
  on public.clients (status, created_at desc);
create index if not exists clients_sort_order_idx
  on public.clients (sort_order);

-- ============================================================================
-- 4. VIDEOS (many per client — portrait short-form content)
-- ============================================================================
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text,
  description text,
  thumbnail_url text not null,        -- portrait image (first slide, for carousels)
  content_type text not null default 'video' check (content_type in ('video', 'carousel')),
  carousel_images text[] not null default '{}',   -- additional slides, only used when content_type = 'carousel'
  platform text check (platform in ('instagram', 'tiktok', 'youtube', 'other')),
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  views_count bigint,
  tags text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run: adds carousel support for installs created before it existed.
alter table public.videos add column if not exists content_type text not null default 'video';
alter table public.videos add column if not exists carousel_images text[] not null default '{}';

create index if not exists videos_client_id_idx on public.videos (client_id);
create index if not exists videos_sort_order_idx on public.videos (client_id, sort_order);

-- ============================================================================
-- 5. UPDATED_AT TRIGGERS
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

drop trigger if exists videos_set_updated_at on public.videos;
create trigger videos_set_updated_at
  before update on public.videos
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 6. MIGRATION FROM v1 (`projects` table), if it exists
-- ============================================================================
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'projects') then

    -- Migrate any categories used in the old table that aren't in the new list yet
    insert into public.categories (name)
    select distinct category from public.projects
    where category is not null
    on conflict (name) do nothing;

    -- Migrate any services used in the old table that aren't in the new list yet
    insert into public.services (name)
    select distinct s from public.projects, unnest(services) as s
    on conflict (name) do nothing;

    -- Migrate each old project into a new client (reusing the same id)
    insert into public.clients (
      id, name, logo_url, cover_thumbnail_url, category, description,
      services, instagram_url, tiktok_url, youtube_url, status,
      created_at, updated_at
    )
    select
      id, client_name, logo_url, thumbnail_url, category, description,
      services, instagram_url, tiktok_url, youtube_url, status,
      created_at, updated_at
    from public.projects
    on conflict (id) do nothing;

    -- Carry over each old project's thumbnail + links as a starter video,
    -- so no existing content link is lost. Admin should replace the
    -- thumbnail with a proper portrait image afterwards.
    insert into public.videos (
      client_id, title, thumbnail_url, instagram_url, tiktok_url, youtube_url, created_at
    )
    select
      id, title, coalesce(thumbnail_url, ''), instagram_url, tiktok_url, youtube_url, created_at
    from public.projects
    where thumbnail_url is not null
    on conflict do nothing;

    -- Never drop the original data — just rename it out of the way.
    alter table public.projects rename to projects_legacy;
  end if;
end $$;

-- ============================================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================================
alter table public.site_settings enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.clients enable row level security;
alter table public.videos enable row level security;

-- site_settings: everyone can read, only authenticated can update
drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "Authenticated can update site settings" on public.site_settings;
create policy "Authenticated can update site settings"
  on public.site_settings for update to authenticated using (true) with check (true);

-- categories / services: everyone can read, only authenticated can manage
drop policy if exists "Public can view categories" on public.categories;
create policy "Public can view categories"
  on public.categories for select to anon, authenticated using (true);
drop policy if exists "Authenticated can manage categories" on public.categories;
create policy "Authenticated can manage categories"
  on public.categories for all to authenticated using (true) with check (true);

drop policy if exists "Public can view services" on public.services;
create policy "Public can view services"
  on public.services for select to anon, authenticated using (true);
drop policy if exists "Authenticated can manage services" on public.services;
create policy "Authenticated can manage services"
  on public.services for all to authenticated using (true) with check (true);

-- clients: public sees only published; authenticated sees/manages everything
drop policy if exists "Public can view published clients" on public.clients;
create policy "Public can view published clients"
  on public.clients for select to anon using (status = 'published');
drop policy if exists "Authenticated can view all clients" on public.clients;
create policy "Authenticated can view all clients"
  on public.clients for select to authenticated using (true);
drop policy if exists "Authenticated can manage clients" on public.clients;
create policy "Authenticated can manage clients"
  on public.clients for all to authenticated using (true) with check (true);

-- videos: public sees videos of published clients only; authenticated sees/manages everything
drop policy if exists "Public can view videos of published clients" on public.videos;
create policy "Public can view videos of published clients"
  on public.videos for select to anon
  using (exists (select 1 from public.clients c where c.id = client_id and c.status = 'published'));
drop policy if exists "Authenticated can view all videos" on public.videos;
create policy "Authenticated can view all videos"
  on public.videos for select to authenticated using (true);
drop policy if exists "Authenticated can manage videos" on public.videos;
create policy "Authenticated can manage videos"
  on public.videos for all to authenticated using (true) with check (true);

-- ============================================================================
-- 8. STORAGE BUCKETS
-- ============================================================================
insert into storage.buckets (id, name, public) values
  ('site-assets', 'site-assets', true),
  ('client-logos', 'client-logos', true),
  ('client-covers', 'client-covers', true),
  ('video-thumbnails', 'video-thumbnails', true)
on conflict (id) do nothing;

do $$
declare
  bucket text;
begin
  foreach bucket in array array['site-assets', 'client-logos', 'client-covers', 'video-thumbnails']
  loop
    execute format(
      'drop policy if exists %I on storage.objects',
      'Public read ' || bucket
    );
    execute format(
      'create policy %I on storage.objects for select to anon, authenticated using (bucket_id = %L)',
      'Public read ' || bucket, bucket
    );

    execute format('drop policy if exists %I on storage.objects', 'Authenticated upload ' || bucket);
    execute format(
      'create policy %I on storage.objects for insert to authenticated with check (bucket_id = %L)',
      'Authenticated upload ' || bucket, bucket
    );

    execute format('drop policy if exists %I on storage.objects', 'Authenticated update ' || bucket);
    execute format(
      'create policy %I on storage.objects for update to authenticated using (bucket_id = %L)',
      'Authenticated update ' || bucket, bucket
    );

    execute format('drop policy if exists %I on storage.objects', 'Authenticated delete ' || bucket);
    execute format(
      'create policy %I on storage.objects for delete to authenticated using (bucket_id = %L)',
      'Authenticated delete ' || bucket, bucket
    );
  end loop;
end $$;

-- ============================================================================
-- 9. SEED DATA (only inserted if `clients` is empty — safe to re-run)
-- ============================================================================
insert into public.clients (name, category, description, services, status, featured)
select 'Kopi Kenangan', 'F&B', 'Ongoing short-form content partner producing daily social content.', array['Strategy','Shooting','Editing'], 'published', true
where not exists (select 1 from public.clients);
