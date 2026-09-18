import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // Vercel's free plan caps Image Optimization at 5,000 transformations/month,
    // and that quota won't reset for a while. Turning optimization off serves
    // images as-is — larger file sizes, but no quota to run into and nothing
    // that can silently break. Compress images before uploading to minimize
    // the impact. Re-enable once on a paid plan or once the quota resets.
    unoptimized: true,
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
