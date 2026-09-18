import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getSiteSettings } from "@/lib/data/settings";
import { pickText } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/get-locale";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([getSiteSettings(), getLocale()]);
  const tagline = pickText(locale, settings.tagline_id, settings.tagline_en, settings.tagline);
  const aboutText = pickText(locale, settings.about_text_id, settings.about_text_en, settings.about_text);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} | ${tagline}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: aboutText || tagline,
    keywords: [
      "content agency Yogyakarta",
      "creative content agency",
      "jasa konten Jogja",
      "content marketing Yogyakarta",
      "video production Jogja",
      "personal branding agency",
      "social media management Indonesia",
      "Kontenin.yk",
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} | ${tagline}`,
      description: aboutText || tagline,
      locale: locale === "id" ? "id_ID" : "en_US",
      images: settings.site_logo_url ? [{ url: settings.site_logo_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} | ${tagline}`,
      description: aboutText || tagline,
      images: settings.site_logo_url ? [settings.site_logo_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    icons: {
      icon: [
        { url: "/images/kontenin-logo-mark.png", media: "(prefers-color-scheme: light)" },
        { url: "/images/kontenin-logo-mark-light.png", media: "(prefers-color-scheme: dark)" },
      ],
      apple: "/images/kontenin-logo-mark.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, settings] = await Promise.all([getLocale(), getSiteSettings()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description: pickText(locale, settings.about_text_id, settings.about_text_en, settings.about_text),
    url: SITE_URL,
    image: settings.site_logo_url || undefined,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Daerah Istimewa Yogyakarta",
      addressCountry: "ID",
    },
    areaServed: "ID",
    sameAs: settings.whatsapp_url ? [settings.whatsapp_url] : undefined,
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
