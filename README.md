# Kontenin.yk — Agency Website (Fase 1: Client + Video Foundation)

A premium, fully-CMS-driven portfolio and admin dashboard for **Kontenin.yk**, a short-form content production studio. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase, and Framer Motion.

> This is **Fase 1** of a longer roadmap toward a full "Agency Operating System" (see [Roadmap](#-roadmap) below). It replaces the earlier single-level "Projects" model with a **Client → Video** structure and moves core site content (logo, tagline, hero copy, about text, categories, services) into the database so it's editable from the dashboard — no code changes required.

---

## ✨ What's in Fase 1

**Public site**
- Premium animated hero: gradient motion, noise texture, scroll indicator, and a **CMS-editable 3D slot** (paste a Spline scene URL in Settings — no redeploy needed)
- "Trusted By" client logo marquee
- Portfolio grid of **Clients** — search, dynamic category filter, pagination
- Client detail page: brand overview, stats, services, social/website links, and a **portrait video gallery** (built for short-form content — 9:16 thumbnails)
- About section, fed from Settings
- Dark mode, fully responsive

**Admin dashboard** (Supabase Auth protected)
- Dashboard: total clients, total videos, published clients, recent clients
- **Clients**: full CRUD — logo, landscape overview thumbnail, category (pick or add new), industry, description, period, services (pick or add custom), brand color, website/social links, featured toggle, status
- **Videos**: nested per client — portrait thumbnail upload, platform, links, views, tags
- **Categories & Services**: add/remove the reusable lists offered in the Client form
- **Settings**: site logo, tagline, hero copy, Spline 3D scene URL, About text — all editable without touching code
- Toasts, skeletons, delete confirmations, responsive sidebar throughout

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) |
| Animation | Framer Motion |
| 3D | Embedded Spline scene (URL-based, admin-editable — no heavy 3D bundle) |
| Icons | Lucide React |
| Backend | Supabase (Postgres, Auth, Storage) |
| Forms/Validation | Zod + native Server Actions (`useActionState`) |
| Hosting | Vercel |

---

## 📁 Project Structure

```
app/
  page.tsx                              # Public home (Hero, TrustedBy, Portfolio, About, Footer)
  client/[id]/page.tsx                  # Public client detail (overview + video gallery)
  admin/
    login/page.tsx
    dashboard/
      layout.tsx                        # Sidebar shell, auth guard
      page.tsx                          # Dashboard stats
      clients/
        page.tsx                        # Clients table (search/filter/pagination)
        new/page.tsx
        [id]/edit/page.tsx
        [id]/videos/page.tsx            # Video gallery manager for one client
        [id]/videos/new/page.tsx
        [id]/videos/[videoId]/edit/page.tsx
      taxonomy/page.tsx                 # Categories & Services manager
      settings/page.tsx                 # Site-wide settings
components/
  ui/                                   # shadcn/ui primitives
  shared/                               # Logo, Header, Footer, EmptyState, Pagination, ThemeToggle
  home/                                 # Hero, Hero3D (Spline slot), TrustedBy, About
  portfolio/                            # ClientCard, ClientGrid, PortfolioControls, PortfolioSection
  client-detail/                        # SocialLinkButton, YouTubeEmbed, VideoCard, VideoGrid
  admin/                                # Sidebar, ClientForm, VideoForm, SettingsForm, TaxonomyManager, ...
lib/
  supabase/                             # client.ts, server.ts, middleware.ts
  actions/                              # Server Actions: auth, clients, videos, settings (+ taxonomy)
  data/                                 # Server-side data fetching: clients, videos, settings
  constants.ts, utils.ts, validations.ts
types/
  client.ts, video.ts, settings.ts, supabase.ts
supabase/
  schema.sql                            # Full schema, RLS, storage buckets, v1→v2 migration
middleware.ts                           # Route protection for /admin/dashboard
```

---

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key (see below)
npm run dev
```

Visit `http://localhost:3000` for the public site and `/admin/login` for the dashboard.

---

## 🗄️ Supabase Setup

### 1. Create a project
Go to [supabase.com](https://supabase.com), create a project, then open **Project Settings → API** and copy the **Project URL** and **anon/public key**.

### 2. Run the SQL schema
Open **SQL Editor → New query**, paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it.

This single script:
- Creates `site_settings` (singleton), `categories`, `services`, `clients`, and `videos` tables
- **If you're upgrading from the earlier "Projects" version**: automatically migrates every row from the old `projects` table into the new `clients` table (same IDs, so links keep working), carries over each project's old thumbnail/links as a starter video, and renames the old table to `projects_legacy` — it is never dropped, so nothing is lost.
- Enables Row Level Security: public visitors only see published clients (and videos belonging to them); logged-in admins see and manage everything
- Creates 4 public Storage buckets: `site-assets`, `client-logos`, `client-covers`, `video-thumbnails`
- Seeds a starter category/service list and one example client if the table is empty

You can re-run this script safely — every statement is idempotent (`if not exists` / `on conflict do nothing`).

### 3. Create your admin user
**Authentication → Users → Add user → Create new user.** Check **Auto Confirm User**. Use these credentials at `/admin/login`. There is no public sign-up page by design.

### 4. Disable public sign-ups (recommended)
**Authentication → Providers → Email** → turn off "Allow new users to sign up".

---

## 📦 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public API key |

Both are safe to expose to the browser — access control is enforced by Row Level Security, not by hiding the key.

---

## 🎨 Using the 3D Hero Slot

The hero has a dedicated space for a 3D logo, exactly as requested — built to be swapped from the dashboard, not the codebase:

1. Build/upload your scene at [spline.design](https://spline.design)
2. Publish it and copy the embed URL (looks like `https://my.spline.design/xxxxx/`)
3. Paste it into **Admin → Settings → Hero Section → 3D Scene URL**
4. Save — the homepage now shows your scene. Leave it empty to keep the animated placeholder orb.

---

## ☁️ Deploying to Vercel

1. Push to GitHub → import into Vercel (auto-detects Next.js)
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables
3. Deploy
4. In Supabase → **Authentication → URL Configuration**, add your Vercel domain to Site URL and Redirect URLs

---

## 🗺️ Roadmap

Fase 1 is the foundation. Planned next (see project conversation for the full breakdown):

- **Fase 2** — About page (founder story, timeline, awards), Services page, Case Study pages, Trusted-By stats/testimonials, richer CTA
- **Fase 3** — Website Builder: preset themes, color/font switching, section reordering
- **Fase 4** — Media Library + File Manager
- **Fase 5** — Blog + SEO panel, full Contact page
- **Fase 6** — Invoice system (PDF, QRIS, status tracking), Analytics
- **Future** — Client portal, approval/revision workflow, content calendar, CRM, booking, payments, AI writing tools, notifications, roles & permissions

The `clients` / `videos` / `site_settings` schema was designed so these can be added later without breaking existing data.

---

## 🔒 Security Notes

- `/admin/dashboard` is protected at two layers: `middleware.ts` (redirects before render) and the dashboard `layout.tsx` (re-checks server-side)
- Only images are stored in Supabase Storage — no video files are ever uploaded; Instagram/TikTok/YouTube are linked or embedded by URL
- All writes go through Server Actions using the Supabase server client, which respects Row Level Security
