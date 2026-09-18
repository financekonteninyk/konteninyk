import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Instagram, Music2, Youtube, Globe, ImageOff, PlayCircle } from "lucide-react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Cursor } from "@/components/shared/cursor";
import { ChatWidget } from "@/components/shared/chat-widget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialLinkButton } from "@/components/client-detail/social-link-button";
import { VideoGrid } from "@/components/client-detail/video-grid";
import { CaseStudySection } from "@/components/client-detail/case-study-section";
import { getPublishedClientById } from "@/lib/data/clients";
import { getPublishedVideosByClientId } from "@/lib/data/videos";
import { getSiteSettings } from "@/lib/data/settings";
import { getChatQaEntries } from "@/lib/data/chat";
import { pickText } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/get-locale";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ClientDetailPageProps) {
  const { id } = await params;
  const client = await getPublishedClientById(id);

  if (!client) return { title: "Client Not Found" };

  return {
    title: client.name,
    description: client.description || `${client.name} — a Kontenin.yk client case study.`,
    alternates: { canonical: `/client/${id}` },
    openGraph: {
      title: client.name,
      description: client.description,
      images: client.cover_thumbnail_url ? [{ url: client.cover_thumbnail_url }] : undefined,
    },
  };
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;

  const [client, settings, locale, qaEntries] = await Promise.all([
    getPublishedClientById(id),
    getSiteSettings(),
    getLocale(),
    getChatQaEntries(),
  ]);

  if (!client) notFound();

  const videos = await getPublishedVideosByClientId(id);

  return (
    <div className="flex min-h-screen flex-col">
      <Cursor />
      <SiteHeader settings={settings} locale={locale} />
      <main className="flex-1">
        <div className="container py-10 md:py-14">
          <Button asChild variant="ghost" size="sm" className="mb-8 -ml-3">
            <Link href="/#portfolio">
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>

          {/* Overview */}
          <div className="relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            {client.cover_thumbnail_url ? (
              <Image
                src={client.cover_thumbnail_url}
                alt={client.name}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageOff className="h-10 w-10" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{client.category}</Badge>
                {client.industry && <Badge variant="outline">{client.industry}</Badge>}
                {client.period && (
                  <span className="text-xs text-muted-foreground">{client.period}</span>
                )}
              </div>

              <span className="eyebrow mt-4 block text-xs text-muted-foreground">Case Overview</span>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Kontenin.yk × {client.name}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                  {client.logo_url ? (
                    <Image
                      src={client.logo_url}
                      alt={client.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="font-medium">{client.name}</span>
              </div>

              <p className="mt-8 whitespace-pre-line leading-relaxed text-muted-foreground">
                {client.description}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatBlock icon={PlayCircle} label="Videos Produced" value={videos.length} />
              </div>
            </div>

            <aside className="space-y-8">
              {client.services.length > 0 && (
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Services
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {client.services.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(client.instagram_url || client.tiktok_url || client.youtube_url || client.website_url) && (
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Links
                  </h2>
                  <div className="flex flex-col gap-3">
                    {client.website_url && (
                      <SocialLinkButton href={client.website_url} icon={Globe} label="Visit Website" />
                    )}
                    {client.instagram_url && (
                      <SocialLinkButton
                        href={client.instagram_url}
                        icon={Instagram}
                        label="View on Instagram"
                      />
                    )}
                    {client.tiktok_url && (
                      <SocialLinkButton href={client.tiktok_url} icon={Music2} label="View on TikTok" />
                    )}
                    {client.youtube_url && (
                      <SocialLinkButton
                        href={client.youtube_url}
                        icon={Youtube}
                        label="Watch on YouTube"
                      />
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Gallery */}
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Gallery</h2>
            <VideoGrid videos={videos} />
          </div>

          <CaseStudySection client={client} />
        </div>
      </main>
      <SiteFooter tagline={pickText(locale, settings.tagline_id, settings.tagline_en, settings.tagline)} locale={locale} settings={settings} />
      <ChatWidget
        whatsappUrl={settings.whatsapp_url}
        locale={locale}
        botLogoUrl={settings.chat_bot_logo_url}
        qaEntries={qaEntries}
      />
    </div>
  );
}

function StatBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
