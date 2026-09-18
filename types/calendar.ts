export const CALENDAR_ENTRY_STATUSES = ["planned", "confirmed", "published", "cancelled"] as const;
export type CalendarEntryStatus = (typeof CALENDAR_ENTRY_STATUSES)[number];
export const CALENDAR_ENTRY_STATUS_LABELS: Record<CalendarEntryStatus, string> = {
  planned: "Direncanakan",
  confirmed: "Terkonfirmasi",
  published: "Sudah Tayang",
  cancelled: "Dibatalkan",
};

export const CALENDAR_ENTRY_SOURCES = ["admin", "client_request", "initiative"] as const;
export type CalendarEntrySource = (typeof CALENDAR_ENTRY_SOURCES)[number];
export const CALENDAR_ENTRY_SOURCE_LABELS: Record<CalendarEntrySource, string> = {
  admin: "Rencana Reguler",
  client_request: "Request Klien",
  initiative: "Inisiatif Kontenin.yk",
};

export const CALENDAR_REQUEST_STATUSES = ["pending", "placed", "dismissed"] as const;
export type CalendarRequestStatus = (typeof CALENDAR_REQUEST_STATUSES)[number];

/** Row shape of the `content_calendars` table. */
export interface ContentCalendar {
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
}

/** Row shape of the `content_calendar_entries` table. */
export interface ContentCalendarEntry {
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
}

/** Row shape of the `calendar_strategies` table — one card in the Strategy Gallery. */
export interface CalendarStrategy {
  id: string;
  calendar_id: string;
  title: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Row shape of the `content_calendar_requests` table. */
export interface ContentCalendarRequest {
  id: string;
  calendar_id: string;
  message: string;
  reference_url: string | null;
  status: CalendarRequestStatus;
  linked_entry_id: string | null;
  created_at: string;
}

export const APPROVAL_STATUSES = ["pending", "approved", "rejected"] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];
export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: "Menunggu Review",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export const COMMENT_AUTHORS = ["client", "admin"] as const;
export type CommentAuthor = (typeof COMMENT_AUTHORS)[number];

/** Row shape of the `calendar_entry_comments` table. */
export interface CalendarEntryComment {
  id: string;
  entry_id: string;
  author: CommentAuthor;
  message: string;
  created_at: string;
}

/** Row shape of the `calendar_gls_entries` table — the Growth Loop System feedback log. */
export interface CalendarGlsEntry {
  id: string;
  calendar_id: string;
  client_comment: string;
  resolution: string | null;
  is_resolved: boolean;
  created_at: string;
  resolved_at: string | null;
}
