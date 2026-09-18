export const SITE_NAME = "Kontenin.yk";
export const SITE_URL = "https://konteninyk.agency";

export const STORAGE_BUCKETS = {
  SITE_ASSETS: "site-assets",
  CLIENT_LOGOS: "client-logos",
  CLIENT_COVERS: "client-covers",
  VIDEO_THUMBNAILS: "video-thumbnails",
  ABOUT_ASSETS: "about-assets",
} as const;

export const MAX_IMAGE_SIZE_MB = 5;

export const CLIENTS_PER_PAGE = 9;
export const ADMIN_CLIENTS_PER_PAGE = 10;
export const ADMIN_VIDEOS_PER_PAGE = 12;

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Clients", href: "/admin/dashboard/clients", icon: "Building2" },
  { label: "Categories & Services", href: "/admin/dashboard/taxonomy", icon: "Tags" },
  { label: "Settings", href: "/admin/dashboard/settings", icon: "Settings" },
] as const;
