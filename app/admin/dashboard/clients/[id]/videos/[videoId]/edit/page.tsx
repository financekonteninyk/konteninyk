import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoForm } from "@/components/admin/video-form";
import { getAdminClientById } from "@/lib/data/clients";
import { getAdminVideoById } from "@/lib/data/videos";
import { updateVideoAction } from "@/lib/actions/videos";

export const metadata: Metadata = {
  title: "Edit Video",
};

interface EditVideoPageProps {
  params: Promise<{ id: string; videoId: string }>;
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const { id, videoId } = await params;
  const [client, video] = await Promise.all([getAdminClientById(id), getAdminVideoById(videoId)]);

  if (!client || !video || video.client_id !== id) notFound();

  const boundUpdateAction = updateVideoAction.bind(null, videoId, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
          <Link href={`/admin/dashboard/clients/${id}/videos`}>
            <ArrowLeft className="h-4 w-4" />
            Back to {client.name} Videos
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Video</h1>
        <p className="mt-1 text-sm text-muted-foreground">{video.title ?? "Untitled video"}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <VideoForm video={video} action={boundUpdateAction} />
        </CardContent>
      </Card>
    </div>
  );
}
