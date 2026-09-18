import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClientForm } from "@/components/admin/client-form";
import { createClientAction } from "@/lib/actions/clients";
import { getCategories, getServices } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "New Client",
};

export default async function NewClientPage() {
  const [categories, services] = await Promise.all([getCategories(), getServices()]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
          <Link href="/admin/dashboard/clients">
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">New Client</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a new client to your portfolio.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <ClientForm action={createClientAction} categories={categories} services={services} />
        </CardContent>
      </Card>
    </div>
  );
}
