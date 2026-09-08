import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Droplets, ShieldCheck, Wrench, Layers, FolderCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "About",
  description:
    "BIMVORA is a specialized BIM platform providing high-quality Revit families for HVAC, Plumbing, MEP and clean-room projects — practical, accurate and ready to use.",
};

/** Icons matched 1-to-1 to `dict.about.offerings` by index. */
const OFFERING_ICONS = [Boxes, Droplets, ShieldCheck, Wrench, Layers, FolderCheck] as const;

export default async function AboutPage() {
  const { dict } = await getDictionary();
  const t = dict.about;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="font-mono text-[11px] tracking-wider text-copper uppercase">
        {t.eyebrow}
      </p>
      <h1 className="mt-2 max-w-3xl text-4xl leading-tight">{t.title}</h1>

      <div className="mt-6 max-w-3xl space-y-4 text-muted-foreground leading-relaxed">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl">{t.offerTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.offerings.map((item, i) => {
            const Icon = OFFERING_ICONS[i] ?? Boxes;
            return (
              <article
                key={item.title}
                className="flex flex-col gap-3 border border-border bg-card p-5"
              >
                <Icon className="size-6 text-copper" />
                <h3 className="text-base">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-12 border border-border bg-ink px-6 py-10 text-paper sm:px-10">
        <p className="font-mono text-[11px] tracking-wider text-copper uppercase">
          {t.missionEyebrow}
        </p>
        <h2 className="mt-2 max-w-2xl text-2xl leading-snug">{t.missionTitle}</h2>
        <p className="mt-4 max-w-2xl text-paper/70 leading-relaxed">{t.missionBody}</p>
        <p className="mt-6 font-mono text-sm tracking-wide text-copper">
          {t.missionSignature}
        </p>
      </section>

      <section className="mt-12 flex flex-col items-start justify-between gap-4 border border-border bg-secondary/40 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl">{t.ctaTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.ctaBody}</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="rounded-none">
            <Link href="/bim-objects">{t.ctaBrowse}</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <Link href="/contact">{t.ctaContact}</Link>
          </Button>
        </div>
      </section>

      <p className="mt-10 text-sm text-muted-foreground">{t.disclaimer}</p>
    </div>
  );
}
