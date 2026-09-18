import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPricingCategoryById } from "@/lib/data/pricing";
import { getSiteSettings } from "@/lib/data/settings";
import { PrintButton } from "@/components/admin/print-button";

export const metadata: Metadata = {
  title: "Print Pricing",
};

export const dynamic = "force-dynamic";

const ACCENT_COLORS = ["#5B8FB9", "#9CAF6B", "#E39A5D", "#B3273E", "#7C6FA6"];

function formatIDR(value: number): string {
  const rounded = Math.round(value / 1000);
  return `${rounded.toLocaleString("id-ID")}`;
}

interface PrintPricingPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintPricingPage({ params }: PrintPricingPageProps) {
  const { id } = await params;
  const [category, settings] = await Promise.all([getPricingCategoryById(id), getSiteSettings()]);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-4 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div
        id="pricing-print-area"
        className="relative overflow-hidden rounded-2xl bg-[#171717] px-10 py-14 text-white shadow-2xl sm:px-14"
      >
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              {category.name.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h1>
            {category.subtitle && <p className="mt-3 max-w-sm text-sm text-white/60">{category.subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {settings.site_logo_url && (
              <span className="relative h-7 w-7">
                <Image src={settings.site_logo_url} alt="" fill sizes="28px" className="object-contain invert" />
              </span>
            )}
            <span className="text-lg font-medium text-white/90">
              konten<span className="font-bold">in.yk</span>
            </span>
          </div>
        </div>

        {/* Tier cards */}
        <div className="space-y-5">
          {category.tiers.map((tier, i) => {
            const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
            return (
              <div key={i} className="flex overflow-hidden rounded-xl bg-[#faf3e8] text-[#171717]">
                <div className="w-2 shrink-0" style={{ backgroundColor: accent }} />
                <div className="flex flex-1 flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="sm:max-w-[220px]">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{tier.name}</h2>
                      {tier.badge && (
                        <span className="rounded-full bg-[#171717] px-2 py-0.5 text-[10px] font-semibold text-white">
                          ★ {tier.badge}
                        </span>
                      )}
                    </div>
                    {tier.description && <p className="mt-1.5 text-xs text-[#171717]/70">{tier.description}</p>}
                  </div>

                  <div className="shrink-0">
                    <span className="text-sm font-semibold">Rp</span>{" "}
                    <span className="text-3xl font-extrabold tracking-tight">{formatIDR(tier.price)}</span>
                    <span className="text-sm font-semibold">rb{tier.period ? ` ${tier.period}` : ""}</span>
                  </div>

                  <ul className="min-w-0 flex-1 space-y-1 text-sm sm:pl-6">
                    {tier.features.map((feature, j) => {
                      const isFalse = feature.value === "false";
                      const isTrue = feature.value === "true";
                      if (isFalse) return null;
                      return (
                        <li key={j} className="flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0">•</span>
                          <span className={isTrue ? "" : "font-semibold"}>
                            {feature.label}
                            {!isTrue && <span className="font-normal"> — {feature.value}</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-14 text-right">
          <p className="text-2xl font-medium leading-tight text-white/90">
            Your <span className="font-bold">Brand's</span> Creative Partner
          </p>
        </div>
      </div>
    </div>
  );
}
