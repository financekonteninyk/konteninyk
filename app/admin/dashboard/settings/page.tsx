import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/data/settings";
import { getTimelineItems, getValues, getAwards, getGalleryImages, getTools } from "@/lib/data/about";
import { getActivityPhotos } from "@/lib/data/activity";

export const metadata: Metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, timelineItems, values, awards, galleryImages, tools, activityPhotos] = await Promise.all([
    getSiteSettings(),
    getTimelineItems(),
    getValues(),
    getAwards(),
    getGalleryImages(),
    getTools(),
    getActivityPhotos(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Control your site's global content — no code required.
        </p>
      </div>

      <SettingsForm
        settings={settings}
        timelineItems={timelineItems}
        values={values}
        awards={awards}
        galleryImages={galleryImages}
        tools={tools}
        activityPhotos={activityPhotos}
      />
    </div>
  );
}
