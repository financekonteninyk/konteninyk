import type { Metadata } from "next";
import { ToolLinksManager } from "@/components/admin/tool-links-manager";
import { getToolLinks } from "@/lib/data/tools";

export const metadata: Metadata = {
  title: "Tools",
};

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const links = await getToolLinks();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick links to everything your team uses day-to-day.
        </p>
      </div>
      <ToolLinksManager items={links} />
    </div>
  );
}
