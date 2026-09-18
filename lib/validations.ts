import { z } from "zod";
import { CLIENT_STATUSES } from "@/types/client";
import { VIDEO_PLATFORMS, CONTENT_TYPES } from "@/types/video";
import { SERVICE_STAGES } from "@/types/settings";
import { INVOICE_STATUSES, INVOICE_DOC_TYPES, INVOICE_CURRENCIES } from "@/types/tools";
import { PROPOSAL_STATUSES, MOU_PARTY_TYPES, MOU_STATUSES, EXPENSE_TYPES, OFFER_STATUSES } from "@/types/documents";

const optionalUrl = z
  .string()
  .trim()
  .transform((val) => {
    if (!val) return "";
    return /^https?:\/\//i.test(val) ? val : `https://${val}`;
  })
  .refine((val) => val === "" || /^https?:\/\/[^\s]+\.[^\s]+/.test(val), {
    message: "Enter a valid URL, e.g. instagram.com/yourbrand",
  });

const optionalHexColor = z
  .string()
  .trim()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, { message: "Must be a valid hex color, e.g. #2563EB" })
  .optional()
  .or(z.literal(""));

export const clientFormSchema = z.object({
  name: z.string().trim().min(2, "Client name is required"),
  logo_url: z.string().nullable().optional(),
  cover_thumbnail_url: z.string().nullable().optional(),
  category: z.string().trim().min(1, "Select or create a category"),
  industry: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  period: z.string().trim().optional().or(z.literal("")),
  services: z.array(z.string()).min(1, "Select at least one service"),
  brand_color: optionalHexColor,
  website_url: optionalUrl,
  instagram_url: optionalUrl,
  tiktok_url: optionalUrl,
  youtube_url: optionalUrl,
  featured: z.boolean(),
  sort_order: z.coerce.number().int().default(0),
  city: z.string().trim().optional().or(z.literal("")),
  whatsapp_number: z.string().trim().optional().or(z.literal("")),
  status: z.enum(CLIENT_STATUSES),
  case_study_challenge: z.string().trim().optional().or(z.literal("")),
  case_study_strategy: z.string().trim().optional().or(z.literal("")),
  case_study_production: z.string().trim().optional().or(z.literal("")),
  case_study_result: z.string().trim().optional().or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const videoFormSchema = z.object({
  client_id: z.string().uuid("Invalid client"),
  title: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  thumbnail_url: z.string().trim().min(1, "Upload a portrait thumbnail"),
  content_type: z.enum(CONTENT_TYPES),
  carousel_images: z.array(z.string()),
  platform: z.enum(VIDEO_PLATFORMS).nullable().optional(),
  instagram_url: optionalUrl,
  tiktok_url: optionalUrl,
  youtube_url: optionalUrl,
  views_count: z.coerce.number().int().nonnegative().nullable().optional(),
  tags: z.array(z.string()),
});

export type VideoFormValues = z.infer<typeof videoFormSchema>;

export const siteSettingsFormSchema = z.object({
  site_logo_url: z.string().nullable().optional(),
  hero_logo_url: z.string().nullable().optional(),
  hero_logo_width: z.coerce.number().int().min(40, "Minimum 40px").max(600, "Maximum 600px"),
  hero_logo_height: z.coerce.number().int().min(20, "Minimum 20px").max(600, "Maximum 600px"),
  tagline_id: z.string().trim().min(3, "Wajib diisi"),
  tagline_en: z.string().trim().min(3, "Required"),
  hero_badge_text_id: z.string().trim().min(2, "Wajib diisi"),
  hero_badge_text_en: z.string().trim().min(2, "Required"),
  hero_heading_id: z.string().trim().min(1, "Wajib diisi"),
  hero_heading_en: z.string().trim().min(1, "Required"),
  hero_description_id: z.string().trim().min(3, "Wajib diisi"),
  hero_description_en: z.string().trim().min(3, "Required"),
  about_text_id: z.string().trim().min(10, "Minimal 10 karakter"),
  about_text_en: z.string().trim().min(10, "Must be at least 10 characters"),
  about_vision_id: z.string().trim().optional().or(z.literal("")),
  about_vision_en: z.string().trim().optional().or(z.literal("")),
  about_mission_id: z.string().trim().optional().or(z.literal("")),
  about_mission_en: z.string().trim().optional().or(z.literal("")),
  stats_text_id: z.string().trim().optional().or(z.literal("")),
  stats_text_en: z.string().trim().optional().or(z.literal("")),
  nav_portfolio_id: z.string().trim().min(1, "Required"),
  nav_portfolio_en: z.string().trim().min(1, "Required"),
  nav_process_id: z.string().trim().min(1, "Required"),
  nav_process_en: z.string().trim().min(1, "Required"),
  nav_services_id: z.string().trim().min(1, "Required"),
  nav_services_en: z.string().trim().min(1, "Required"),
  nav_about_id: z.string().trim().min(1, "Required"),
  nav_about_en: z.string().trim().min(1, "Required"),
  nav_cta_id: z.string().trim().min(1, "Required"),
  nav_cta_en: z.string().trim().min(1, "Required"),
  whatsapp_url: z
    .string()
    .trim()
    .url("Must be a valid URL, e.g. https://wa.me/62812xxxxxxx")
    .optional()
    .or(z.literal("")),
  chat_bot_logo_url: z.string().nullable().optional(),
  whatsapp_icon_url: z.string().nullable().optional(),
  gls_icon_url: z.string().nullable().optional(),
  invoice_company_name: z.string().trim().optional().or(z.literal("")),
  invoice_company_sub: z.string().trim().optional().or(z.literal("")),
  invoice_company_address: z.string().trim().optional().or(z.literal("")),
  invoice_company_email: z.string().trim().optional().or(z.literal("")),
  invoice_company_wa: z.string().trim().optional().or(z.literal("")),
  invoice_company_web: z.string().trim().optional().or(z.literal("")),
  invoice_company_npwp: z.string().trim().optional().or(z.literal("")),
  invoice_qris_url: z.string().nullable().optional(),
  invoice_footer_note: z.string().trim().optional().or(z.literal("")),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;

export const timelineItemSchema = z.object({
  year: z.string().trim().min(1, "Year is required").max(20, "Keep it short, e.g. 2023"),
  title: z.string().trim().min(1, "Title is required").max(100, "Keep it under 100 characters"),
  description: z.string().trim().optional().or(z.literal("")),
});

export const valueItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Keep it under 100 characters"),
  description: z.string().trim().optional().or(z.literal("")),
});

export const awardItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150, "Keep it under 150 characters"),
  issuer: z.string().trim().optional().or(z.literal("")),
  year: z.string().trim().max(20, "Keep it short, e.g. 2024").optional().or(z.literal("")),
});

export const galleryItemSchema = z.object({
  image_url: z.string().trim().min(1, "Upload an image"),
  caption: z.string().trim().optional().or(z.literal("")),
});

export const activityPhotoSchema = z.object({
  image_url: z.string().trim().min(1, "Upload an image"),
  caption: z.string().trim().optional().or(z.literal("")),
});

export const toolItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60, "Keep it under 60 characters"),
  logo_url: z.string().nullable().optional(),
});

export const chatQaEntrySchema = z.object({
  keywords: z.array(z.string().trim().min(1)).min(1, "Add at least one keyword"),
  answer_1: z.string().trim().min(1, "At least one answer is required"),
  answer_2: z.string().trim().optional().or(z.literal("")),
  answer_3: z.string().trim().optional().or(z.literal("")),
});

export const invoiceLineItemSchema = z.object({
  description: z.string().trim().min(1, "Required"),
  quantity: z.coerce.number().positive("Must be greater than 0"),
  unit_price: z.coerce.number().nonnegative("Can't be negative"),
});

export const invoiceFormSchema = z.object({
  invoice_number: z.string().trim().min(1, "Invoice number is required"),
  doc_type: z.enum(INVOICE_DOC_TYPES),
  currency: z.enum(INVOICE_CURRENCIES),
  client_id: z.string().nullable().optional(),
  client_name: z.string().trim().min(1, "Name is required"),
  client_company: z.string().trim().optional().or(z.literal("")),
  client_whatsapp: z.string().trim().optional().or(z.literal("")),
  client_email: z.string().trim().optional().or(z.literal("")),
  client_logo_url: z.string().nullable().optional(),
  payment_purpose: z.string().trim().optional().or(z.literal("")),
  items: z.array(invoiceLineItemSchema).min(1, "Add at least one line item"),
  discount_percent: z.coerce.number().min(0).max(100).default(0),
  tax_percent: z.coerce.number().min(0).max(100).default(0),
  bank_account_id: z.string().nullable().optional(),
  show_qris: z.coerce.boolean().default(true),
  status: z.enum(INVOICE_STATUSES),
  issue_date: z.string().min(1, "Required"),
  due_date: z.string().trim().optional().or(z.literal("")),
  paid_date: z.string().trim().optional().or(z.literal("")),
  transaction_code: z.string().trim().optional().or(z.literal("")),
  sender_bank: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export const bankAccountSchema = z.object({
  bank_name: z.string().trim().min(1, "Required"),
  account_number: z.string().trim().min(1, "Required"),
  account_holder: z.string().trim().min(1, "Required"),
  description: z.string().trim().optional().or(z.literal("")),
});

export const adminNoteSchema = z.object({
  content: z.string().trim().min(1, "Required"),
});

export const editingStandardSchema = z.object({
  category: z.string().trim().min(1, "Required"),
  label: z.string().trim().min(1, "Required"),
  value: z.string().trim().min(1, "Required"),
});

export const invoiceServiceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  price: z.coerce.number().nonnegative("Can't be negative"),
  category: z.string().trim().optional().or(z.literal("")),
});

export const pricingFeatureSchema = z.object({
  label: z.string().trim().min(1, "Required"),
  value: z.string().trim(),
});

/* Tier's optional text fields (period/badge/description) come from the
   admin form as JS `null` whenever they're empty — not `undefined`, not
   "". z.string().optional() only accepts `undefined`, so a perfectly
   normal tier with no badge/period set would fail validation with a
   useless "Invalid input". .nullable() added so null is accepted too. */
export const pricingTierSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  price: z.coerce.number().nonnegative("Can't be negative"),
  period: z.string().trim().nullable().optional().or(z.literal("")),
  badge: z.string().trim().nullable().optional().or(z.literal("")),
  description: z.string().trim().nullable().optional().or(z.literal("")),
  features: z.array(pricingFeatureSchema),
});

export const pricingCategorySchema = z.object({
  name: z.string().trim().min(1, "Required"),
  subtitle: z.string().trim().optional().or(z.literal("")),
  tiers: z.array(pricingTierSchema).min(1, "Add at least one tier"),
  sort_order: z.coerce.number().int().default(0),
  is_published: z.coerce.boolean().default(true),
});

export const proposalFormSchema = z.object({
  proposal_number: z.string().trim().min(1, "Required"),
  client_name: z.string().trim().min(1, "Required"),
  client_company: z.string().trim().optional().or(z.literal("")),
  project_title: z.string().trim().min(1, "Required"),
  objective: z.string().trim().optional().or(z.literal("")),
  background: z.string().trim().optional().or(z.literal("")),
  account_analysis: z.string().trim().optional().or(z.literal("")),
  strategy: z.string().trim().optional().or(z.literal("")),
  scope_items: z.array(z.object({ label: z.string().trim().min(1) })),
  investment_items: z.array(
    z.object({ description: z.string().trim().min(1), price: z.coerce.number().nonnegative() })
  ),
  investment_note: z.string().trim().optional().or(z.literal("")),
  timeline: z.string().trim().optional().or(z.literal("")),
  valid_until: z.string().trim().optional().or(z.literal("")),
  status: z.enum(PROPOSAL_STATUSES),
});

export const expenseFormSchema = z.object({
  voucher_number: z.string().trim().min(1, "Required"),
  category: z.string().trim().min(1, "Required"),
  paid_to: z.string().trim().min(1, "Required"),
  role: z.string().trim().optional().or(z.literal("")),
  work_period: z.string().trim().optional().or(z.literal("")),
  transaction_code: z.string().trim().optional().or(z.literal("")),
  sender_bank: z.string().trim().optional().or(z.literal("")),
  receiver_bank: z.string().trim().optional().or(z.literal("")),
  expense_type: z.enum(EXPENSE_TYPES),
  personal_note: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  amount: z.coerce.number().nonnegative("Can't be negative"),
  payment_date: z.string().trim().min(1, "Required"),
  payment_method: z.string().trim().optional().or(z.literal("")),
  proof_url: z.string().nullable().optional(),
  notes: z.string().trim().optional().or(z.literal("")),
});

export const mouFormSchema = z.object({
  mou_number: z.string().trim().min(1, "Required"),
  party_type: z.enum(MOU_PARTY_TYPES),
  party_name: z.string().trim().min(1, "Required"),
  party_company: z.string().trim().optional().or(z.literal("")),
  project_title: z.string().trim().min(1, "Required"),
  scope: z.string().trim().optional().or(z.literal("")),
  terms: z.string().trim().optional().or(z.literal("")),
  compensation: z.string().trim().optional().or(z.literal("")),
  duration: z.string().trim().optional().or(z.literal("")),
  effective_date: z.string().trim().min(1, "Required"),
  status: z.enum(MOU_STATUSES),
});

export const freelancerOfferFormSchema = z.object({
  offer_number: z.string().trim().min(1, "Required"),
  freelancer_name: z.string().trim().min(1, "Required"),
  job_title: z.string().trim().min(1, "Required"),
  price: z.coerce.number().nonnegative("Can't be negative"),
  specifications: z.string().trim().optional().or(z.literal("")),
  project_deadline: z.string().trim().optional().or(z.literal("")),
  status: z.enum(OFFER_STATUSES),
});

export const toolLinkSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  url: z.string().trim().url("Must be a valid URL"),
  category: z.string().trim().optional().or(z.literal("")),
  icon_url: z.string().nullable().optional(),
});

export const taxonomyItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Keep it under 50 characters"),
});

export const serviceItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Keep it under 50 characters"),
  stage: z.enum(SERVICE_STAGES),
});

export const loginFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const calendarFormSchema = z.object({
  client_id: z.string().nullable().optional(),
  client_name: z.string().trim().min(1, "Required"),
  client_logo_url: z.string().nullable().optional(),
  strategy_note: z.string().trim().optional().or(z.literal("")),
  background_color: z
    .string()
    .trim()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, { message: "Must be a valid hex color, e.g. #6075F1" })
    .nullable()
    .optional()
    .or(z.literal("")),
  page_title: z.string().trim().optional().or(z.literal("")),
  whatsapp_number: z.string().trim().optional().or(z.literal("")),
  contract_start_date: z.string().trim().optional().or(z.literal("")),
  contract_end_date: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
  strategy_title: z.string().trim().optional().or(z.literal("")),
});

export const calendarEntryFormSchema = z.object({
  entry_date: z.string().trim().min(1, "Required"),
  content_type: z.string().trim().min(1, "Required"),
  description: z.string().trim().optional().or(z.literal("")),
  reference_url: z.string().trim().optional().or(z.literal("")),
  reference_image_url: z.string().nullable().optional(),
  drive_url: z.string().trim().optional().or(z.literal("")),
  function_tag: z.string().trim().optional().or(z.literal("")),
  function_color: z
    .string()
    .trim()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, { message: "Must be a valid hex color" })
    .optional()
    .or(z.literal("")),
  status: z.enum(["planned", "confirmed", "published", "cancelled"]),
  source: z.enum(["admin", "client_request", "initiative"]),
});

export const calendarStrategyFormSchema = z.object({
  title: z.string().trim().min(1, "Required"),
  content: z.string().trim().min(1, "Required"),
  sort_order: z.coerce.number().int().default(0),
});

export const calendarRequestFormSchema = z.object({
  message: z.string().trim().min(1, "Please write your request or reference"),
  reference_url: z.string().trim().optional().or(z.literal("")),
});

export const entryCommentFormSchema = z.object({
  message: z.string().trim().min(1, "Tulis komentar dulu ya"),
});

export const glsCommentFormSchema = z.object({
  client_comment: z.string().trim().min(1, "Tulis komentar dulu ya"),
});

export const glsResolutionFormSchema = z.object({
  resolution: z.string().trim().min(1, "Tulis solusi/penyelesaiannya dulu"),
});
