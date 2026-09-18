export const PROPOSAL_STATUSES = ["draft", "sent", "accepted", "declined"] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];
export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
};

export interface ScopeItem {
  label: string;
}

export interface InvestmentItem {
  description: string;
  price: number;
}

/** Row shape of the `proposals` table. */
export interface Proposal {
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
}

export const EXPENSE_TYPES = ["operational", "capital"] as const;
export type ExpenseType = (typeof EXPENSE_TYPES)[number];
export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  operational: "Operational",
  capital: "Capital / Investment",
};

/** Row shape of the `expenses` table. */
export interface Expense {
  id: string;
  voucher_number: string;
  category: string;
  paid_to: string;
  role: string | null;
  work_period: string | null;
  transaction_code: string | null;
  sender_bank: string | null;
  receiver_bank: string | null;
  expense_type: ExpenseType;
  personal_note: string | null;
  description: string | null;
  amount: number;
  payment_date: string;
  payment_method: string | null;
  proof_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const OFFER_STATUSES = ["draft", "sent", "accepted", "declined"] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];
export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
};

/** Row shape of the `freelancer_offers` table. */
export interface FreelancerOffer {
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
}

export const MOU_PARTY_TYPES = ["client", "freelancer"] as const;
export type MouPartyType = (typeof MOU_PARTY_TYPES)[number];

export const MOU_STATUSES = ["draft", "sent", "signed"] as const;
export type MouStatus = (typeof MOU_STATUSES)[number];
export const MOU_STATUS_LABELS: Record<MouStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  signed: "Signed",
};

/** Row shape of the `mou_documents` table. */
export interface MouDocument {
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
}
