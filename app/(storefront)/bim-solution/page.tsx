import type { Metadata } from "next";
import Link from "next/link";
import {
  Boxes,
  ClipboardCheck,
  Layers,
  Ruler,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/catalog/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "BIM Solution",
  description:
    "BIMVORA BIM services: custom Revit family creation, MEP BIM coordination, clean-room design support and managed content libraries for engineering offices.",
};

const SERVICES = [
  {
    icon: Boxes,
    title: "Custom Revit families",
    body: "Parametric, connector-ready .rfa families built to your manufacturer data, LOD and naming standards.",
  },
  {
    icon: Layers,
    title: "MEP BIM coordination",
    body: "HVAC, plumbing and fire-protection modelling with clash detection and coordinated federated models.",
  },
  {
    icon: ShieldCheck,
    title: "Clean-room & pharma design",
    body: "HEPA/FFU layouts, pressure cascades, airlocks and hygienic equipment for controlled environments.",
  },
  {
    icon: Ruler,
    title: "Shop drawings & schedules",
    body: "Coordinated fabrication drawings, equipment schedules and quantity take-offs straight from the model.",
  },
  {
    icon: Wrench,
    title: "Content library management",
    body: "We build, standardise and maintain your company Revit library so every project starts consistent.",
  },
  {
    icon: ClipboardCheck,
    title: "BIM standards & training",
    body: "Templates, shared parameters, execution plans (BEP) and team training tailored to your workflows.",
  },
];

const STEPS = [
  { n: "01", title: "Brief", body: "Share your scope, standards and target Revit versions." },
  { n: "02", title: "Proposal", body: "We scope deliverables, timeline and a fixed quote." },
  { n: "03", title: "Production", body: "Modelling and QA against your BIM standards." },
  { n: "04", title: "Handover", body: "Coordinated files, documentation and support." },
];

export default function BimSolutionPage() {
  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "BIM Solution" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={crumbs} />

      <section className="mt-6 border border-border bg-ink px-6 py-12 text-paper sm:px-10">
        <p className="font-mono text-[11px] tracking-wider text-copper uppercase">
          BIM services
        </p>
        <h1 className="mt-2 max-w-3xl text-4xl leading-tight">
          BIM Solution — engineering-grade BIM delivered by our team
        </h1>
        <p className="mt-4 max-w-2xl text-paper/70">
          Beyond ready-made families, BIMVORA delivers custom BIM services for
          engineering offices, contractors and manufacturers — from bespoke
          Revit content to full MEP and clean-room coordination.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="">
            <Link href="/contact">Request a quote</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className=" border-paper/30 bg-transparent text-paper hover:bg-paper hover:text-ink"
          >
            <Link href="/bim-objects">Browse BIM-Objects</Link>
          </Button>
        </div>
      </section>

      <section className="mt-12">
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          What we deliver
        </p>
        <h2 className="mt-1 text-2xl">Services</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="flex flex-col gap-3 border border-border bg-card p-5"
            >
              <service.icon className="size-6 text-copper" />
              <h3 className="text-base">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          How it works
        </p>
        <h2 className="mt-1 text-2xl">A simple, predictable process</h2>
        <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="bg-card p-5">
              <p className="font-mono text-2xl text-copper">{step.n}</p>
              <h3 className="mt-2 text-base">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 flex flex-col items-start justify-between gap-4 border border-border bg-secondary/40 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl">Have a project in mind?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us your scope and standards — we&apos;ll come back with a plan
            and a quote.
          </p>
        </div>
        <Button asChild className="">
          <Link href="/contact">Contact the BIM team</Link>
        </Button>
      </section>
    </div>
  );
}
