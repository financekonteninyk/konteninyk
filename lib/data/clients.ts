import { createClient } from "@/lib/supabase/server";
import type { Client, ClientStatus } from "@/types/client";

interface PublicClientsFilters {
  search?: string;
  category?: string;
  page?: number;
  perPage?: number;
}

interface ClientsResult {
  clients: Client[];
  total: number;
}

/** Fetch published clients for the public portfolio grid, with search/filter/pagination. */
export async function getPublishedClients(
  filters: PublicClientsFilters = {}
): Promise<ClientsResult> {
  const { search = "", category = "All", page = 1, perPage = 9 } = filters;
  const supabase = await createClient();

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category !== "All") query = query.eq("category", category);
  if (search.trim()) query = query.ilike("name", `%${search}%`);

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch published clients:", error.message);
    return { clients: [], total: 0 };
  }

  return { clients: (data ?? []) as Client[], total: count ?? 0 };
}

/** Fetch featured, published clients for the "Trusted By" logo strip. */
export async function getFeaturedClients(limit = 12): Promise<Client[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("status", "published")
    .not("logo_url", "is", null)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch featured clients:", error.message);
    return [];
  }

  return (data ?? []) as Client[];
}

/** Fetch a single published client by id for the public client page. */
export async function getPublishedClientById(id: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch client:", error.message);
    return null;
  }

  return data as Client | null;
}

interface AdminClientsFilters {
  search?: string;
  category?: string;
  status?: ClientStatus | "All";
  page?: number;
  perPage?: number;
}

/** Fetch all clients (any status) for the admin dashboard table. */
export async function getAdminClients(
  filters: AdminClientsFilters = {}
): Promise<ClientsResult> {
  const {
    search = "",
    category = "All",
    status = "All",
    page = 1,
    perPage = 10,
  } = filters;
  const supabase = await createClient();

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (category !== "All") query = query.eq("category", category);
  if (status !== "All") query = query.eq("status", status);
  if (search.trim()) query = query.ilike("name", `%${search}%`);

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch admin clients:", error.message);
    return { clients: [], total: 0 };
  }

  return { clients: (data ?? []) as Client[], total: count ?? 0 };
}

/** Fetch a single client by id (any status) for the admin edit form. */
export async function getAdminClientById(id: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch client:", error.message);
    return null;
  }

  return data as Client | null;
}

/** Lightweight list of all clients (id + name), used for pickers. */
export async function getAllClientsBasic(): Promise<Pick<Client, "id" | "name">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch client list:", error.message);
    return [];
  }

  return data ?? [];
}

/** Client list with logo + WhatsApp, used by the Invoice form's client picker. */
export async function getClientsForInvoice(): Promise<
  Pick<Client, "id" | "name" | "logo_url" | "whatsapp_number">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, logo_url, whatsapp_number")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch clients for invoice picker:", error.message);
    return [];
  }

  return data ?? [];
}

/** Client list with logo/WhatsApp/city, used by the dashboard's map and contacts panel. */
export async function getClientsForDashboard(): Promise<
  Pick<Client, "id" | "name" | "logo_url" | "whatsapp_number" | "city">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, logo_url, whatsapp_number, city")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch clients for dashboard:", error.message);
    return [];
  }

  return data ?? [];
}

/** Published client IDs + last-updated timestamps, used to build the sitemap. */
export async function getPublishedClientIdsForSitemap(): Promise<
  Pick<Client, "id" | "updated_at">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, updated_at")
    .eq("status", "published");

  if (error) {
    console.error("Failed to fetch client IDs for sitemap:", error.message);
    return [];
  }

  return data ?? [];
}
