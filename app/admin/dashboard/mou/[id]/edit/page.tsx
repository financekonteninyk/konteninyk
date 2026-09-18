import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MouForm } from "@/components/admin/mou-form";
import { getMouDocumentById } from "@/lib/data/documents";
import { updateMouAction } from "@/lib/actions/documents";

export const metadata: Metadata = { title: "Edit MOU" };
export const dynamic = "force-dynamic";

interface EditMouPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMouPage({ params }: EditMouPageProps) {
  const { id } = await params;
  const mou = await getMouDocumentById(id);
  if (!mou) notFound();

  const boundAction = updateMouAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit MOU</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mou.mou_number}</p>
      </div>
      <MouForm mou={mou} action={boundAction} />
    </div>
  );
}
