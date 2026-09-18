import type { Metadata } from "next";
import { MouForm } from "@/components/admin/mou-form";
import { createMouAction } from "@/lib/actions/documents";

export const metadata: Metadata = { title: "New MOU" };

export default function NewMouPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New MOU</h1>
        <p className="mt-1 text-sm text-muted-foreground">A standard terms draft is pre-filled — edit as needed.</p>
      </div>
      <MouForm action={createMouAction} />
    </div>
  );
}
