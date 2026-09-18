import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMouDocumentById } from "@/lib/data/documents";
import { getSiteSettings } from "@/lib/data/settings";
import { PrintButton } from "@/components/admin/print-button";

export const metadata: Metadata = { title: "Print MOU" };
export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

interface PrintMouPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintMouPage({ params }: PrintMouPageProps) {
  const { id } = await params;
  const [mou, settings] = await Promise.all([getMouDocumentById(id), getSiteSettings()]);
  if (!mou) notFound();

  const companyName = settings.invoice_company_name || "Kontenin.yk";

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-4 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div id="mou-print-area" className="rounded-lg bg-white p-10 text-[13px] leading-relaxed text-slate-800 shadow-2xl sm:p-14">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">Memorandum of Understanding</h1>
          <p className="mt-1 text-xs text-slate-500">{mou.mou_number}</p>
        </div>

        <p className="mb-6 text-slate-700">
          Perjanjian ini dibuat dan disepakati pada tanggal <strong>{formatDate(mou.effective_date)}</strong>, antara:
        </p>

        <div className="mb-6 grid grid-cols-2 gap-8">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Pihak Pertama</p>
            <p className="font-bold text-slate-900">{companyName}</p>
            <p className="text-xs text-slate-500">{settings.invoice_company_address || "Yogyakarta, Indonesia"}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Pihak Kedua ({mou.party_type === "client" ? "Klien" : "Freelancer"})
            </p>
            <p className="font-bold text-slate-900">{mou.party_name}</p>
            {mou.party_company && <p className="text-xs text-slate-500">{mou.party_company}</p>}
          </div>
        </div>

        <p className="mb-8 text-slate-700">
          Kedua belah pihak sepakat untuk bekerja sama dalam proyek <strong>{mou.project_title}</strong>, dengan
          ketentuan sebagai berikut:
        </p>

        {mou.scope && (
          <section className="mb-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">1. Lingkup Kerja</h3>
            <p className="whitespace-pre-line text-slate-700">{mou.scope}</p>
          </section>
        )}

        {mou.compensation && (
          <section className="mb-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">2. Kompensasi</h3>
            <p className="whitespace-pre-line text-slate-700">{mou.compensation}</p>
          </section>
        )}

        {mou.duration && (
          <section className="mb-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">3. Durasi</h3>
            <p className="whitespace-pre-line text-slate-700">{mou.duration}</p>
          </section>
        )}

        {mou.terms && (
          <section className="mb-8">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">4. Ketentuan Umum</h3>
            <p className="whitespace-pre-line text-slate-700">{mou.terms}</p>
          </section>
        )}

        <p className="mb-10 text-slate-700">
          Demikian perjanjian ini dibuat untuk dipergunakan sebagaimana mestinya, ditandatangani oleh kedua belah
          pihak dalam keadaan sadar tanpa paksaan.
        </p>

        <div className="grid grid-cols-2 gap-8 text-center">
          <div>
            <p className="mb-16 text-slate-700">Pihak Pertama</p>
            <div className="mx-auto w-44 border-t border-slate-400 pt-1 text-sm font-medium text-slate-800">{companyName}</div>
          </div>
          <div>
            <p className="mb-16 text-slate-700">Pihak Kedua</p>
            <div className="mx-auto w-44 border-t border-slate-400 pt-1 text-sm font-medium text-slate-800">{mou.party_name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
