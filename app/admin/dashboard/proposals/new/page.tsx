import type { Metadata } from "next";
import { ProposalForm } from "@/components/admin/proposal-form";
import { createProposalAction } from "@/lib/actions/documents";

export const metadata: Metadata = { title: "New Proposal" };

export default function NewProposalPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Proposal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          After your discovery conversation with a prospective client, capture it here.
        </p>
      </div>
      <ProposalForm action={createProposalAction} />
    </div>
  );
}
