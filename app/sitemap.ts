import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPublishedClientIdsForSitemap } from "@/lib/data/clients";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const clients = await getPublishedClientIdsForSitemap();

  const clientEntries: MetadataRoute.Sitemap = clients.map((client) => ({
    url: `${SITE_URL}/client/${client.id}`,
    lastModified: client.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...clientEntries,
  ];
}
