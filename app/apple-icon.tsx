import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/data/settings";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
        }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} width={130} height={130} style={{ objectFit: "contain" }} alt="" />
        ) : (
          <span style={{ color: "#fff", fontSize: 90, fontWeight: 800 }}>K</span>
        )}
      </div>
    ),
    { ...size }
  );
}
