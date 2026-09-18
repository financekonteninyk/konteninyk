import { Circle, CircleDot, RotateCcw, Check, CheckCheck } from "lucide-react";
import type { ContentCalendarEntry } from "@/types/calendar";

export type WorkflowStage = "production" | "review" | "revision" | "approved" | "published";

export const WORKFLOW_STAGE_LABELS: Record<WorkflowStage, string> = {
  production: "In Production",
  review: "Pending Review",
  revision: "Revision Requested",
  approved: "Approved",
  published: "Published",
};

export const WORKFLOW_STAGE_ORDER: WorkflowStage[] = ["production", "review", "revision", "approved", "published"];

/** Shared icon per stage — used by the calendar grid, Upcoming Content list, and anywhere else a stage needs a visual. */
export const STAGE_ICON: Record<WorkflowStage, typeof Circle> = {
  production: Circle,
  review: CircleDot,
  revision: RotateCcw,
  approved: Check,
  published: CheckCheck,
};

/** Shared text-color class per stage, for the same reason. */
export const STAGE_COLOR: Record<WorkflowStage, string> = {
  production: "text-muted-foreground",
  review: "text-primary",
  revision: "text-destructive",
  approved: "text-emerald-500",
  published: "text-emerald-500",
};

/** Background-color variant of STAGE_COLOR — used for small dot indicators (e.g. mobile calendar cells). */
export const STAGE_DOT: Record<WorkflowStage, string> = {
  production: "bg-muted-foreground",
  review: "bg-primary",
  revision: "bg-destructive",
  approved: "bg-emerald-500",
  published: "bg-emerald-500",
};

/**
 * Derives a 5-stage workflow position from the two fields that already
 * exist — `status` (the admin's production state) and `approval_status`
 * (the client's decision) — instead of adding a new column. `planned`
 * means still being put together; `confirmed` means it's ready and has
 * been sent for the client's review.
 */
export function getWorkflowStage(entry: ContentCalendarEntry): WorkflowStage {
  if (entry.status === "published") return "published";
  if (entry.approval_status === "rejected") return "revision";
  if (entry.approval_status === "approved") return "approved";
  if (entry.status === "planned") return "production";
  return "review";
}

export function countByStage(entries: ContentCalendarEntry[]): Record<WorkflowStage, number> {
  const counts: Record<WorkflowStage, number> = { production: 0, review: 0, revision: 0, approved: 0, published: 0 };
  for (const entry of entries) counts[getWorkflowStage(entry)] += 1;
  return counts;
}
