import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClientForm } from "@/components/admin/client-form";
import { getAdminClientById } from "@/lib/data/clients";
import { getCategories, getServices } from "@/lib/data/settings";
import { updateClientAction } from "@/lib/actions/clients";

export const metadata: Metadata = {
  title: "Edit Client",
};

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  const [client, categories, services] = await Promise.all([
    getAdminClientById(id),
    getCategories(),
    getServices(),
  ]);

  if (!client) notFound();

  const boundUpdateAction = updateClientAction.bind(null, id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
            <Link href="/admin/dashboard/clients">
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Client</h1>
          <p className="mt-1 text-sm text-muted-foreground">{client.name}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/admin/dashboard/clients/${id}/videos`}>
            <Film className="h-4 w-4" />
            Manage Videos
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <ClientForm
            client={client}
            action={boundUpdateAction}
            categories={categories}
            services={services}
          />
        </CardContent>
      </Card>
    </div>
  );
}
