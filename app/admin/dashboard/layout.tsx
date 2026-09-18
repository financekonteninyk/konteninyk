import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getSiteSettings } from "@/lib/data/settings";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already protects this route group,
  // but we guard here too in case middleware is bypassed or misconfigured.
  if (!user) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar userEmail={user.email ?? "Admin"} logoUrl={settings.site_logo_url} />
      <main className="min-w-0 flex-1 bg-secondary/20 p-4 print:bg-white print:p-0 md:p-8">{children}</main>
    </div>
  );
}
