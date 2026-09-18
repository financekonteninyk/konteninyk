import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProposalById } from "@/lib/data/documents";
import { getSiteSettings } from "@/lib/data/settings";
import { PrintButton } from "@/components/admin/print-button";

export const metadata: Metadata = { title: "Print Proposal" };
export const dynamic = "force-dynamic";

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

interface PrintProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintProposalPage({ params }: PrintProposalPageProps) {
  const { id } = await params;
  const [proposal, settings] = await Promise.all([getProposalById(id), getSiteSettings()]);
  if (!proposal) notFound();

  const investmentTotal = proposal.investment_items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-4 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div id="proposal-print-area" className="rounded-lg bg-white p-8 text-[13px] leading-relaxed text-slate-800 shadow-2xl sm:p-12">
        <div className="mb-10 flex items-start justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            {settings.site_logo_url && (
              <span className="relative h-10 w-10">
                <Image src={settings.site_logo_url} alt="" fill sizes="40px" className="object-contain" />
              </span>
            )}
            <div>
              <p className="text-lg font-extrabold text-slate-900">{settings.invoice_company_name || "Kontenin.yk"}</p>
              <p className="text-xs text-slate-500">{settings.invoice_company_sub || "Creative Agency"}</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-slate-900">PROPOSAL</h1>
            <p className="text-xs text-slate-500">{proposal.proposal_number}</p>
          </div>
        </div>

        <div className="mb-9 grid grid-cols-2 gap-8">
          <div>
            <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Prepared For</h4>
            <p className="font-bold text-slate-900">{proposal.client_name}</p>
            {proposal.client_company && <p className="text-slate-600">{proposal.client_company}</p>}
          </div>
          <div className="text-right">
            <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Valid Until</h4>
            <p className="text-slate-700">{formatDate(proposal.valid_until)}</p>
          </div>
        </div>

        <h2 className="mb-6 text-2xl font-bold text-slate-900">{proposal.project_title}</h2>

        {proposal.objective && (
          <div className="mb-6 rounded-lg bg-slate-50 p-4">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Objective</h4>
            <p className="font-medium text-slate-800">{proposal.objective}</p>
          </div>
        )}

        {proposal.background && (
          <section className="mb-7">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-800">Background</h3>
            <p className="whitespace-pre-line text-slate-700">{proposal.background}</p>
          </section>
        )}

        {proposal.account_analysis && (
          <section className="mb-7">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-800">Account Analysis</h3>
            <p className="whitespace-pre-line text-slate-700">{proposal.account_analysis}</p>
          </section>
        )}

        {proposal.strategy && (
          <section className="mb-7">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-800">Proposed Strategy</h3>
            <p className="whitespace-pre-line text-slate-700">{proposal.strategy}</p>
          </section>
        )}

        {proposal.scope_items.length > 0 && (
          <section className="mb-7">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-800">Scope of Work</h3>
            <ul className="space-y-1.5">
              {proposal.scope_items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-800" />
                  {item.label}
                </li>
              ))}
            </ul>
          </section>
        )}

        {proposal.investment_items.length > 0 && (
          <section className="mb-7">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-800">Investment</h3>
            <table className="w-full border-collapse">
              <tbody>
                {proposal.investment_items.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 text-slate-700">{item.description}</td>
                    <td className="py-2 text-right font-medium text-slate-900">{formatIDR(item.price)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-3 text-base font-bold text-blue-800">Total</td>
                  <td className="pt-3 text-right text-base font-bold text-blue-800">{formatIDR(investmentTotal)}</td>
                </tr>
              </tbody>
            </table>
            {proposal.investment_note && <p className="mt-2 text-xs italic text-slate-500">{proposal.investment_note}</p>}
          </section>
        )}

        {proposal.timeline && (
          <section className="mb-7">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-800">Timeline</h3>
            <p className="whitespace-pre-line text-slate-700">{proposal.timeline}</p>
          </section>
        )}

        <div className="mt-10 grid grid-cols-2 gap-8 border-t border-slate-200 pt-8 text-center">
          <div>
            <p className="mb-12 text-xs text-slate-500">{settings.invoice_company_name || "Kontenin.yk"}</p>
            <div className="mx-auto w-40 border-t border-slate-400 pt-1 text-xs text-slate-500">Authorized Signature</div>
          </div>
          <div>
            <p className="mb-12 text-xs text-slate-500">{proposal.client_name}</p>
            <div className="mx-auto w-40 border-t border-slate-400 pt-1 text-xs text-slate-500">Client Approval</div>
          </div>
        </div>
      </div>
    </div>
  );
}
