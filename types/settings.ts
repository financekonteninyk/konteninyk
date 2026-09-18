/** Row shape of the singleton `site_settings` table — global editable content. */
export interface SiteSettings {
  id: 1;
  site_logo_url: string | null;
  hero_logo_url: string | null;
  hero_logo_width: number;
  hero_logo_height: number;
  tagline: string;
  hero_badge_text: string;
  hero_heading: string;
  hero_description: string;
  spline_scene_url: string | null;
  about_text: string;
  about_vision: string | null;
  about_mission: string | null;
  // Bilingual fields (Indonesian / English). The single-language fields
  // above are kept as legacy fallbacks only — new code should read these.
  tagline_id: string | null;
  tagline_en: string | null;
  hero_badge_text_id: string | null;
  hero_badge_text_en: string | null;
  hero_heading_id: string | null;
  hero_heading_en: string | null;
  hero_description_id: string | null;
  hero_description_en: string | null;
  about_text_id: string | null;
  about_text_en: string | null;
  about_vision_id: string | null;
  about_vision_en: string | null;
  about_mission_id: string | null;
  about_mission_en: string | null;
  stats_text_id: string | null;
  stats_text_en: string | null;
  stat_1_value: string | null;
  stat_1_label_id: string | null;
  stat_1_label_en: string | null;
  stat_2_value: string | null;
  stat_2_label_id: string | null;
  stat_2_label_en: string | null;
  stat_3_value: string | null;
  stat_3_label_id: string | null;
  stat_3_label_en: string | null;
  stat_4_value: string | null;
  stat_4_label_id: string | null;
  stat_4_label_en: string | null;
  nav_portfolio_id: string | null;
  nav_portfolio_en: string | null;
  nav_process_id: string | null;
  nav_process_en: string | null;
  nav_services_id: string | null;
  nav_services_en: string | null;
  nav_about_id: string | null;
  nav_about_en: string | null;
  nav_cta_id: string | null;
  nav_cta_en: string | null;
  whatsapp_url: string | null;
  whatsapp_icon_url: string | null;
  gls_icon_url: string | null;
  chat_bot_logo_url: string | null;
  chat_knowledge_text: string | null;
  invoice_company_name: string | null;
  invoice_company_sub: string | null;
  invoice_company_address: string | null;
  invoice_company_email: string | null;
  invoice_company_wa: string | null;
  invoice_company_web: string | null;
  invoice_company_npwp: string | null;
  invoice_qris_url: string | null;
  invoice_footer_note: string | null;
  updated_at: string;
}

export type SiteSettingsInput = Omit<SiteSettings, "id" | "updated_at">;

/** Row shape of the `categories` lookup table (admin-manageable, extensible). */
export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export const SERVICE_STAGES = ["strategy", "production", "growth"] as const;
export type ServiceStage = (typeof SERVICE_STAGES)[number];

export const SERVICE_STAGE_LABELS: Record<ServiceStage, string> = {
  strategy: "Strategy",
  production: "Production",
  growth: "Growth Loop",
};

/** Row shape of the `services` lookup table (admin-manageable, extensible). */
export interface Service {
  id: string;
  name: string;
  stage: ServiceStage;
  created_at: string;
}
