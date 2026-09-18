import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProposalForm } from "@/components/admin/proposal-form";
import { getProposalById } from "@/lib/data/documents";
import { updateProposalAction } from "@/lib/actions/documents";

export const metadata: Metadata = { title: "Edit Proposal" };
export const dynamic = "force-dynamic";

interface EditProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProposalPage({ params }: EditProposalPageProps) {
  const { id } = await params;
  const proposal = await getProposalById(id);
  if (!proposal) notFound();

  const boundAction = updateProposalAction.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Proposal</h1>
        <p className="mt-1 text-sm text-muted-foreground">{proposal.proposal_number}</p>
      </div>
      <ProposalForm proposal={proposal} action={boundAction} />
    </div>
  );
}
