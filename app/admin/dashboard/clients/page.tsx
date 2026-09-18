import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientsControls } from "@/components/admin/clients-controls";
import { ClientsTable } from "@/components/admin/clients-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { getAdminClients } from "@/lib/data/clients";
import { getCategories } from "@/lib/data/settings";
import { ADMIN_CLIENTS_PER_PAGE } from "@/lib/constants";
import type { ClientStatus } from "@/types/client";

export const metadata: Metadata = {
  title: "Clients",
};

export const dynamic = "force-dynamic";

interface AdminClientsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminClientsPage({ searchParams }: AdminClientsPageProps) {
  const resolved = await searchParams;
  const search = resolved.search ?? "";
  const category = resolved.category ?? "All";
  const status = (resolved.status as ClientStatus | undefined) ?? "All";
  const page = Math.max(1, Number(resolved.page ?? "1") || 1);

  const [{ clients, total }, categories] = await Promise.all([
    getAdminClients({ search, category, status, page, perPage: ADMIN_CLIENTS_PER_PAGE }),
    getCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / ADMIN_CLIENTS_PER_PAGE));
  const hasActiveFilters = Boolean(search || category !== "All" || status !== "All");

  return (
    <div className="space-y-6">
      <Link href="/admin/dashboard/agreements" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Agreements & Clients
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all clients — {total} total.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/clients/new">
            <Plus className="h-4 w-4" />
            New Client
          </Link>
        </Button>
      </div>

      <ClientsControls initialSearch={search} categories={categories.map((c) => c.name)} />

      {clients.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No matching clients" : "No clients yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your search or filters."
              : "Get started by creating your first client."
          }
          action={
            !hasActiveFilters && (
              <Button asChild>
                <Link href="/admin/dashboard/clients/new">
                  <Plus className="h-4 w-4" />
                  New Client
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <ClientsTable clients={clients} />
      )}

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
