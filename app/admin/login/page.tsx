import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { LoginForm } from "@/components/admin/login-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default async function LoginPage() {
  const settings = await getSiteSettings();

  return (
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-16 text-white">
      {/* Grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]"
      />

      {/* Scanning line sweep */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        <div
          className="h-24 w-full bg-gradient-to-b from-transparent via-white/40 to-transparent"
          style={{ animation: "scan-line 6s linear infinite" }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo href="/" logoUrl={settings.site_logo_url} />
          <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
            <ShieldCheck className="h-3 w-3" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
            System Access
          </span>
        </div>

        {/* HUD-bracketed card */}
        <div className="relative">
          <span className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-white/40" />
          <span className="absolute -right-2 -top-2 h-6 w-6 border-r-2 border-t-2 border-white/40" />
          <span className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-white/40" />
          <span className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-white/40" />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_80px_-20px_rgba(255,255,255,0.15)] backdrop-blur-xl">
            <div className="mb-6 text-center">
              <h1 className="text-xl font-semibold tracking-tight">Admin Dashboard</h1>
              <p className="mt-1 font-mono text-xs text-white/50">
                Authenticate to access the control panel
              </p>
            </div>

            <div className="[&_input]:border-white/15 [&_input]:bg-white/5 [&_input]:text-white [&_input::placeholder]:text-white/30 [&_label]:text-white/70">
              <LoginForm />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Kontenin.yk // Secure Portal
        </p>
      </div>
    </div>
  );
}
