export const INVOICE_STATUSES = ["draft", "unpaid", "paid", "partially_paid", "cancelled"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  unpaid: "Unpaid",
  paid: "Paid",
  partially_paid: "Partially Paid",
  cancelled: "Cancelled",
};

export const INVOICE_DOC_TYPES = ["keluar", "masuk"] as const;
export type InvoiceDocType = (typeof INVOICE_DOC_TYPES)[number];

export const INVOICE_DOC_TYPE_LABELS: Record<InvoiceDocType, string> = {
  keluar: "Invoice Out (Client Billing)",
  masuk: "Invoice In (Vendor/Freelancer Bill)",
};

export const INVOICE_CURRENCIES = ["IDR", "USD", "SGD", "EUR", "MYR"] as const;
export type InvoiceCurrency = (typeof INVOICE_CURRENCIES)[number];

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

/** Row shape of the `invoices` table. */
export interface Invoice {
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
}

/** Row shape of the `invoice_bank_accounts` table. */
export interface InvoiceBankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  description: string | null;
  created_at: string;
}

/** Row shape of the `tool_links` table — internal bookmark directory. */
export interface ToolLink {
  id: string;
  name: string;
  url: string;
  category: string | null;
  icon_url: string | null;
  sort_order: number;
  created_at: string;
}

/** Row shape of the `admin_notes` table — a lightweight task/notes widget for the dashboard. */
export interface AdminNote {
  id: string;
  content: string;
  is_done: boolean;
  sort_order: number;
  created_at: string;
}

/** Row shape of the `editing_standards` table — reference specs shown on the dashboard. */
export interface EditingStandard {
  id: string;
  category: string;
  label: string;
  value: string;
  sort_order: number;
  created_at: string;
}

/** Row shape of the `invoice_services` table — a price list to quickly add line items from. */
export interface InvoiceService {
  id: string;
  name: string;
  price: number;
  category: string | null;
  created_at: string;
}
