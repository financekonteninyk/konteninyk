import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoForm } from "@/components/admin/video-form";
import { getAdminClientById } from "@/lib/data/clients";
import { createVideoAction } from "@/lib/actions/videos";

export const metadata: Metadata = {
  title: "New Video",
};

interface NewVideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewVideoPage({ params }: NewVideoPageProps) {
  const { id } = await params;
  const client = await getAdminClientById(id);

  if (!client) notFound();

  const boundCreateAction = createVideoAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
          <Link href={`/admin/dashboard/clients/${id}/videos`}>
            <ArrowLeft className="h-4 w-4" />
            Back to {client.name} Videos
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">New Video</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a video to {client.name}&apos;s gallery.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <VideoForm action={boundCreateAction} />
        </CardContent>
      </Card>
    </div>
  );
}
