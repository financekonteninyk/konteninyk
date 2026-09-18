import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/data/settings";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const settings = await getSiteSettings();
  const logoUrl = settings.site_logo_url;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 6,
        }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} width={26} height={26} style={{ objectFit: "contain" }} alt="" />
        ) : (
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>K</span>
        )}
      </div>
    ),
    { ...size }
  );
}
