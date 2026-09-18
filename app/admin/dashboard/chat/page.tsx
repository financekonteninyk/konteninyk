import type { Metadata } from "next";
import { ChatManager } from "@/components/admin/chat-manager";
import { getChatQaEntries, getUnmatchedQueries } from "@/lib/data/chat";

export const metadata: Metadata = {
  title: "Chat Assistant",
};

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const [qaEntries, unmatchedQueries] = await Promise.all([getChatQaEntries(), getUnmatchedQueries()]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Chat Assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review what CS Kontenin.yk couldn't answer, and teach it new responses.
        </p>
      </div>

      <ChatManager qaEntries={qaEntries} unmatchedQueries={unmatchedQueries} />
    </div>
  );
}
