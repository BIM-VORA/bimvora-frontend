import type { Metadata } from "next";
import { PackCard } from "@/components/packs/pack-card";
import { StudentVerificationSection } from "@/components/packs/student-verification-section";
import { getDictionary } from "@/lib/i18n/server";
import { FAMILY_PACKS } from "@/lib/packs";

export const metadata: Metadata = {
  title: "Revit family packs",
  description:
    "Choose a BIMVORA Revit family pack for students, professionals, BIM specialists or companies. One-time prices in USD.",
};

export default async function PacksPage() {
  const { dict } = await getDictionary();
  const t = dict.packs;

  const facts = [
    [t.footerFacts.oneTimeTitle, t.footerFacts.oneTimeBody],
    [t.footerFacts.licenceTitle, t.footerFacts.licenceBody],
    [t.footerFacts.deliveryTitle, t.footerFacts.deliveryBody],
  ] as const;

  return (
    <>
      <section className="blueprint-grid border-b border-border bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-mono text-[11px] tracking-[0.2em] text-copper uppercase">
            {t.pageEyebrow}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl text-paper">{t.pageTitle}</h1>
          <p className="mt-4 max-w-2xl text-paper/70">{t.pageLead}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FAMILY_PACKS.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>

      <StudentVerificationSection />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 border border-border bg-card p-6 sm:grid-cols-3">
          {facts.map(([title, body]) => (
            <div key={title}>
              <h3 className="text-base">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
