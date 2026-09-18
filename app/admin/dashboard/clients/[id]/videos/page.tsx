import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminVideoCard } from "@/components/admin/admin-video-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getAdminClientById } from "@/lib/data/clients";
import { getAdminVideosByClientId } from "@/lib/data/videos";

export const metadata: Metadata = {
  title: "Client Videos",
};

export const dynamic = "force-dynamic";

interface ClientVideosPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientVideosPage({ params }: ClientVideosPageProps) {
  const { id } = await params;
  const client = await getAdminClientById(id);

  if (!client) notFound();

  const videos = await getAdminVideosByClientId(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
            <Link href="/admin/dashboard/clients">
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">{client.name} — Videos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{videos.length} videos</p>
        </div>
        <Button asChild>
          <Link href={`/admin/dashboard/clients/${id}/videos/new`}>
            <Plus className="h-4 w-4" />
            New Video
          </Link>
        </Button>
      </div>

      {videos.length === 0 ? (
        <EmptyState
          title="No videos yet"
          description="Upload your first portrait thumbnail to start building this client's gallery."
          action={
            <Button asChild>
              <Link href={`/admin/dashboard/clients/${id}/videos/new`}>
                <Plus className="h-4 w-4" />
                New Video
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {videos.map((video) => (
            <AdminVideoCard key={video.id} video={video} clientId={id} />
          ))}
        </div>
      )}
    </div>
  );
}
