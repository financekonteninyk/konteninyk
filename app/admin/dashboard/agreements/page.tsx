import type { Metadata } from "next";
import Link from "next/link";
import { FileText, FileSignature, Sparkles, Building2 } from "lucide-react";

export const metadata: Metadata = { title: "Agreements" };

const LINKS = [
  { href: "/admin/dashboard/clients", label: "Clients", desc: "Manage client profiles, logos, and case studies", icon: Building2 },
  { href: "/admin/dashboard/proposals", label: "Client Proposals", desc: "Concept, strategy, and pricing sent to prospective clients", icon: FileText },
  { href: "/admin/dashboard/agreements/offers", label: "Freelancer Offers", desc: "Job offers with rate, scope, and deadline for freelancers", icon: Sparkles },
  { href: "/admin/dashboard/mou", label: "MOU Documents", desc: "Formal agreements for clients or freelancers", icon: FileSignature },
];

export default function AgreementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Agreements & Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every client, and every document you send before, during, or to formalize a working relationship.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col gap-3 rounded-2xl border border-border p-5 transition-colors hover:border-foreground/30"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <link.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium">{link.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
