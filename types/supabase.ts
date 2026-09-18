import type { ClientStatus } from "./client";
import type { VideoPlatform, ContentType } from "./video";
import type { ServiceStage } from "./settings";
import type { InvoiceLineItem, InvoiceStatus, InvoiceDocType, InvoiceCurrency } from "./tools";
import type { PricingTier } from "./pricing";
import type { ProposalStatus, ScopeItem, InvestmentItem, MouPartyType, MouStatus, ExpenseType, OfferStatus } from "./documents";
import type { CalendarEntryStatus, CalendarEntrySource, CalendarRequestStatus, ApprovalStatus, CommentAuthor } from "./calendar";

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: number;
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
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Relationships: [];
      };
      categories: {
        Row: { id: string; name: string; created_at: string };
        Insert: { id?: string; name: string; created_at?: string };
        Update: { id?: string; name?: string; created_at?: string };
        Relationships: [];
      };
      services: {
        Row: { id: string; name: string; stage: ServiceStage; created_at: string };
        Insert: { id?: string; name: string; stage?: ServiceStage; created_at?: string };
        Update: { id?: string; name?: string; stage?: ServiceStage; created_at?: string };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          cover_thumbnail_url: string | null;
          category: string;
          industry: string | null;
          description: string;
          period: string | null;
          services: string[];
          brand_color: string | null;
          website_url: string | null;
          instagram_url: string | null;
          tiktok_url: string | null;
          youtube_url: string | null;
          featured: boolean;
          status: ClientStatus;
          sort_order: number;
          city: string | null;
          whatsapp_number: string | null;
          case_study_challenge: string | null;
          case_study_strategy: string | null;
          case_study_production: string | null;
          case_study_result: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["clients"]["Row"]> & {
          name: string;
          category: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
        Relationships: [];
      };
      videos: {
        Row: {
          id: string;
          client_id: string;
          title: string | null;
          description: string | null;
          thumbnail_url: string;
          content_type: ContentType;
          carousel_images: string[];
          platform: VideoPlatform | null;
          instagram_url: string | null;
          tiktok_url: string | null;
          youtube_url: string | null;
          views_count: number | null;
          tags: string[];
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["videos"]["Row"]> & {
          client_id: string;
          thumbnail_url: string;
        };
        Update: Partial<Database["public"]["Tables"]["videos"]["Row"]>;
        Relationships: [];
      };
      about_timeline: {
        Row: {
          id: string;
          year: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["about_timeline"]["Row"]> & {
          year: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["about_timeline"]["Row"]>;
        Relationships: [];
      };
      about_values: {
        Row: { id: string; title: string; description: string | null; sort_order: number; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["about_values"]["Row"]> & { title: string };
        Update: Partial<Database["public"]["Tables"]["about_values"]["Row"]>;
        Relationships: [];
      };
      about_awards: {
        Row: {
          id: string;
          title: string;
          issuer: string | null;
          year: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["about_awards"]["Row"]> & { title: string };
        Update: Partial<Database["public"]["Tables"]["about_awards"]["Row"]>;
        Relationships: [];
      };
      about_gallery: {
        Row: { id: string; image_url: string; caption: string | null; sort_order: number; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["about_gallery"]["Row"]> & { image_url: string };
        Update: Partial<Database["public"]["Tables"]["about_gallery"]["Row"]>;
        Relationships: [];
      };
      about_tools: {
        Row: { id: string; name: string; logo_url: string | null; sort_order: number; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["about_tools"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["about_tools"]["Row"]>;
        Relationships: [];
      };
      chat_qa_entries: {
        Row: {
          id: string;
          keywords: string[];
          answer_1: string;
          answer_2: string | null;
          answer_3: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["chat_qa_entries"]["Row"]> & { answer_1: string };
        Update: Partial<Database["public"]["Tables"]["chat_qa_entries"]["Row"]>;
        Relationships: [];
      };
      chat_unmatched_queries: {
        Row: { id: string; query_text: string; locale: string | null; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["chat_unmatched_queries"]["Row"]> & {
          query_text: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_unmatched_queries"]["Row"]>;
        Relationships: [];
      };
      invoice_bank_accounts: {
        Row: {
          id: string;
          bank_name: string;
          account_number: string;
          account_holder: string;
          description: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["invoice_bank_accounts"]["Row"]> & {
          bank_name: string;
          account_number: string;
          account_holder: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoice_bank_accounts"]["Row"]>;
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          doc_type: InvoiceDocType;
          currency: InvoiceCurrency;
          client_id: string | null;
          client_name: string;
          client_company: string | null;
          client_whatsapp: string | null;
          client_email: string | null;
          client_logo_url: string | null;
          payment_purpose: string | null;
          items: InvoiceLineItem[];
          discount_percent: number;
          tax_percent: number;
          total: number;
          bank_account_id: string | null;
          show_qris: boolean;
          status: InvoiceStatus;
          issue_date: string;
          due_date: string | null;
          paid_date: string | null;
          transaction_code: string | null;
          sender_bank: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["invoices"]["Row"]> & {
          invoice_number: string;
          client_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Row"]>;
        Relationships: [];
      };
      tool_links: {
        Row: {
          id: string;
          name: string;
          url: string;
          category: string | null;
          icon_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tool_links"]["Row"]> & { name: string; url: string };
        Update: Partial<Database["public"]["Tables"]["tool_links"]["Row"]>;
        Relationships: [];
      };
      admin_notes: {
        Row: {
          id: string;
          content: string;
          is_done: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_notes"]["Row"]> & { content: string };
        Update: Partial<Database["public"]["Tables"]["admin_notes"]["Row"]>;
        Relationships: [];
      };
      editing_standards: {
        Row: {
          id: string;
          category: string;
          label: string;
          value: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["editing_standards"]["Row"]> & {
          label: string;
          value: string;
        };
        Update: Partial<Database["public"]["Tables"]["editing_standards"]["Row"]>;
        Relationships: [];
      };
      invoice_services: {
        Row: {
          id: string;
          name: string;
          price: number;
          category: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["invoice_services"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["invoice_services"]["Row"]>;
        Relationships: [];
      };
      pricing_categories: {
        Row: {
          id: string;
          name: string;
          subtitle: string | null;
          tiers: PricingTier[];
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["pricing_categories"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["pricing_categories"]["Row"]>;
        Relationships: [];
      };
      activity_photos: {
        Row: {
          id: string;
          image_url: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["activity_photos"]["Row"]> & { image_url: string };
        Update: Partial<Database["public"]["Tables"]["activity_photos"]["Row"]>;
        Relationships: [];
      };
      proposals: {
        Row: {
          id: string;
          proposal_number: string;
          client_name: string;
          client_company: string | null;
          project_title: string;
          objective: string | null;
          background: string | null;
          account_analysis: string | null;
          strategy: string | null;
          scope_items: ScopeItem[];
          investment_items: InvestmentItem[];
          investment_note: string | null;
          timeline: string | null;
          valid_until: string | null;
          status: ProposalStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["proposals"]["Row"]> & {
          proposal_number: string;
          client_name: string;
          project_title: string;
        };
        Update: Partial<Database["public"]["Tables"]["proposals"]["Row"]>;
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          voucher_number: string;
          category: string;
          paid_to: string;
          role: string | null;
          work_period: string | null;
          description: string | null;
          amount: number;
          payment_date: string;
          payment_method: string | null;
          transaction_code: string | null;
          sender_bank: string | null;
          receiver_bank: string | null;
          expense_type: ExpenseType;
          personal_note: string | null;
          proof_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["expenses"]["Row"]> & {
          voucher_number: string;
          paid_to: string;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Row"]>;
        Relationships: [];
      };
      mou_documents: {
        Row: {
          id: string;
          mou_number: string;
          party_type: MouPartyType;
          party_name: string;
          party_company: string | null;
          project_title: string;
          scope: string | null;
          terms: string | null;
          compensation: string | null;
          duration: string | null;
          effective_date: string;
          status: MouStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["mou_documents"]["Row"]> & {
          mou_number: string;
          party_name: string;
          project_title: string;
        };
        Update: Partial<Database["public"]["Tables"]["mou_documents"]["Row"]>;
        Relationships: [];
      };
      freelancer_offers: {
        Row: {
          id: string;
          offer_number: string;
          freelancer_name: string;
          job_title: string;
          price: number;
          specifications: string | null;
          project_deadline: string | null;
          status: OfferStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["freelancer_offers"]["Row"]> & {
          offer_number: string;
          freelancer_name: string;
          job_title: string;
        };
        Update: Partial<Database["public"]["Tables"]["freelancer_offers"]["Row"]>;
        Relationships: [];
      };
      chip_suggestions: {
        Row: {
          id: string;
          field_key: string;
          value: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["chip_suggestions"]["Row"]> & {
          field_key: string;
          value: string;
        };
        Update: Partial<Database["public"]["Tables"]["chip_suggestions"]["Row"]>;
        Relationships: [];
      };
      content_calendars: {
        Row: {
          id: string;
          client_id: string | null;
          client_name: string;
          client_logo_url: string | null;
          strategy_note: string | null;
          share_token: string;
          background_color: string | null;
          page_title: string | null;
          whatsapp_number: string | null;
          contract_start_date: string | null;
          contract_end_date: string | null;
          notes: string | null;
          strategy_title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["content_calendars"]["Row"]> & {
          client_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["content_calendars"]["Row"]>;
        Relationships: [];
      };
      content_calendar_entries: {
        Row: {
          id: string;
          calendar_id: string;
          entry_date: string;
          content_type: string;
          description: string | null;
          reference_url: string | null;
          reference_image_url: string | null;
          drive_url: string | null;
          function_tag: string | null;
          function_color: string | null;
          approval_status: ApprovalStatus;
          approval_updated_at: string | null;
          client_confirmed: boolean;
          status: CalendarEntryStatus;
          source: CalendarEntrySource;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["content_calendar_entries"]["Row"]> & {
          calendar_id: string;
          entry_date: string;
          content_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["content_calendar_entries"]["Row"]>;
        Relationships: [];
      };
      content_calendar_requests: {
        Row: {
          id: string;
          calendar_id: string;
          message: string;
          reference_url: string | null;
          status: CalendarRequestStatus;
          linked_entry_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["content_calendar_requests"]["Row"]> & {
          calendar_id: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["content_calendar_requests"]["Row"]>;
        Relationships: [];
      };
      calendar_strategies: {
        Row: {
          id: string;
          calendar_id: string;
          title: string;
          content: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["calendar_strategies"]["Row"]> & {
          calendar_id: string;
          title: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["calendar_strategies"]["Row"]>;
        Relationships: [];
      };
      calendar_entry_comments: {
        Row: {
          id: string;
          entry_id: string;
          author: CommentAuthor;
          message: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["calendar_entry_comments"]["Row"]> & {
          entry_id: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["calendar_entry_comments"]["Row"]>;
        Relationships: [];
      };
      calendar_gls_entries: {
        Row: {
          id: string;
          calendar_id: string;
          client_comment: string;
          resolution: string | null;
          is_resolved: boolean;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["calendar_gls_entries"]["Row"]> & {
          calendar_id: string;
          client_comment: string;
        };
        Update: Partial<Database["public"]["Tables"]["calendar_gls_entries"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
