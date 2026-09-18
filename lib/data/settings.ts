import { createClient } from "@/lib/supabase/server";
import type { SiteSettings, Category, Service, ServiceStage } from "@/types/settings";
import type { Client } from "@/types/client";

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_logo_url: null,
  hero_logo_url: null,
  hero_logo_width: 200,
  hero_logo_height: 80,
  tagline: "Helping Brands Build Consistent Content That Grows.",
  hero_badge_text: "Content Production Studio",
  hero_heading: "Kontenin.yk",
  hero_description: "We help brands turn ideas into scroll-stopping short-form content.",
  spline_scene_url: null,
  about_text:
    "Kontenin.yk is a content production studio helping brands build consistent, growth-driven content across social platforms.",
  about_vision: null,
  about_mission: null,
  tagline_id: "Membangun Identitas Brand yang Konsisten, Didukung Sistem Evaluasi Mingguan.",
  tagline_en: "Building Consistent Brand Identity, Backed By A Weekly Evaluation System.",
  hero_badge_text_id: "Creative Growth Agency",
  hero_badge_text_en: "Creative Growth Agency",
  hero_heading_id: "Kontenin.yk",
  hero_heading_en: "Kontenin.yk",
  hero_description_id:
    "Kami membangun strategi, produksi, dan evaluasi konten dalam satu sistem — bukan sekadar edit video. Growth Loop System kami memastikan setiap konten terus disempurnakan berdasarkan data.",
  hero_description_en:
    "We build strategy, production, and evaluation into one system — not just video editing. Our Growth Loop System ensures every piece of content keeps improving based on data.",
  about_text_id:
    "Kontenin.yk adalah Creative Growth Agency yang membantu UMKM, bisnis, dan personal brand membangun identitas digital yang konsisten. Setiap proyek dijalankan lewat Growth Loop System — evaluasi mingguan yang memastikan strategi konten Anda terus relevan, bukan sekadar terlihat bagus.",
  about_text_en:
    "Kontenin.yk is a Creative Growth Agency helping UMKM, businesses, and personal brands build a consistent digital identity. Every project runs through our Growth Loop System — a weekly evaluation that keeps your content strategy relevant, not just good-looking.",
  about_vision_id: null,
  about_vision_en: null,
  about_mission_id: null,
  about_mission_en: null,
  stats_text_id: "100+ Konten Diproduksi Untuk Klien Kami",
  stats_text_en: "100+ Pieces Of Content Produced For Our Clients",
  stat_1_value: "100+",
  stat_1_label_id: "Konten Dibuat",
  stat_1_label_en: "Pieces of Content",
  stat_2_value: "20+",
  stat_2_label_id: "Brand Dipercaya",
  stat_2_label_en: "Brands Trusted",
  stat_3_value: "7",
  stat_3_label_id: "Growth Loop System Mingguan",
  stat_3_label_en: "Weekly Growth Loop Cycles",
  stat_4_value: "100%",
  stat_4_label_id: "Fokus Strategi & Kreatif",
  stat_4_label_en: "Strategy & Creative Focus",
  nav_portfolio_id: "Portofolio",
  nav_portfolio_en: "Portfolio",
  nav_process_id: "Cara Kerja",
  nav_process_en: "How We Work",
  nav_services_id: "Layanan",
  nav_services_en: "Services",
  nav_about_id: "Tentang",
  nav_about_en: "About",
  nav_cta_id: "Konsultasi Gratis",
  nav_cta_en: "Free Consultation",
  whatsapp_url: null,
  whatsapp_icon_url: null,
  gls_icon_url: null,
  chat_bot_logo_url: null,
  chat_knowledge_text: null,
  invoice_company_name: "Kontenin.yk",
  invoice_company_sub: "Creative Agency",
  invoice_company_address: "Yogyakarta, Indonesia",
  invoice_company_email: null,
  invoice_company_wa: null,
  invoice_company_web: null,
  invoice_company_npwp: null,
  invoice_qris_url: null,
  invoice_footer_note:
    "Thank you for partnering your digital marketing and media creation with Kontenin.yk. Timely remittance ensures sustained creative output of the highest caliber.",
  updated_at: new Date().toISOString(),
};

/** Fetch the single site_settings row, falling back to sensible defaults. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to fetch site settings:", error.message);
    return DEFAULT_SETTINGS;
  }

  return data as SiteSettings;
}

/** Fetch all categories, alphabetically. */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", error.message);
    return [];
  }

  return data ?? [];
}

/** Fetch all services, alphabetically. */
export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch services:", error.message);
    return [];
  }

  return data ?? [];
}

/** Groups services by stage (Strategy / Production / Growth Loop), in that fixed order. */
export async function getServicesGroupedByStage(): Promise<Record<ServiceStage, Service[]>> {
  const services = await getServices();

  const grouped: Record<ServiceStage, Service[]> = {
    strategy: [],
    production: [],
    growth: [],
  };

  for (const service of services) {
    grouped[service.stage].push(service);
  }

  return grouped;
}

export interface DashboardStats {
  totalClients: number;
  totalVideos: number;
  publishedClients: number;
  recentClients: Client[];
}

/** Aggregate stats for the admin dashboard overview cards. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [{ data: allClients, error }, { count: publishedCount }, { count: videoCount }] =
    await Promise.all([
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
      supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase.from("videos").select("*", { count: "exact", head: true }),
    ]);

  if (error || !allClients) {
    console.error("Failed to fetch dashboard stats:", error?.message);
    return { totalClients: 0, totalVideos: 0, publishedClients: 0, recentClients: [] };
  }

  return {
    totalClients: allClients.length,
    totalVideos: videoCount ?? 0,
    publishedClients: publishedCount ?? 0,
    recentClients: (allClients as Client[]).slice(0, 5),
  };
}
