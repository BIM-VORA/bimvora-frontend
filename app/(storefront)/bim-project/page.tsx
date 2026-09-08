import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, type Crumb } from "@/components/catalog/breadcrumbs";
import { ProjectCard, type BimProjectCardData } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "BIM-Project",
  description:
    "Example BIM projects from BIMVORA — complete Revit models for HVAC, plumbing and clean-room systems. $100 each, secure checkout.",
};

const PROJECT_PRICE_CENTS = 10000;

/**
 * Language-neutral project registry. UI text (name/discipline/description) comes
 * from the i18n dictionary keyed by slug — this file only owns the structural
 * data (id, slug, revit version, file format, price).
 */
const PROJECTS: BimProjectCardData[] = [
  {
    id: "prj-hospital-mep-model",
    slug: "hospital-mep-model",
    name: "Hospital MEP Model",
    discipline: "HVAC · Plumbing · Fire",
    description:
      "Full multidisciplinary MEP model for a 120-bed hospital wing with coordinated services and plant rooms.",
    revitVersion: "2024",
    fileFormat: ".rvt",
    priceCents: PROJECT_PRICE_CENTS,
  },
  {
    id: "prj-pharma-clean-room-suite",
    slug: "pharma-clean-room-suite",
    name: "Pharmaceutical Clean Room Suite",
    discipline: "Clean Room / Pharma",
    description:
      "ISO-classified clean-room suite with HEPA/FFU layout, pressure cascade, airlocks and gowning rooms.",
    revitVersion: "2025",
    fileFormat: ".rvt",
    priceCents: PROJECT_PRICE_CENTS,
  },
  {
    id: "prj-office-chilled-water-plant",
    slug: "office-chilled-water-plant",
    name: "Office Chilled Water Plant",
    discipline: "HVAC / Mechanical",
    description:
      "Central chilled-water plant room with chillers, pumps, headers and full hydronic distribution.",
    revitVersion: "2024",
    fileFormat: ".rvt",
    priceCents: PROJECT_PRICE_CENTS,
  },
  {
    id: "prj-data-center-cooling",
    slug: "data-center-cooling",
    name: "Data Center Cooling System",
    discipline: "HVAC / Mechanical",
    description:
      "CRAC/CRAH cooling model with hot/cold aisle containment, chilled water loops and redundancy.",
    revitVersion: "2026",
    fileFormat: ".rvt",
    priceCents: PROJECT_PRICE_CENTS,
  },
  {
    id: "prj-hotel-plumbing-drainage",
    slug: "hotel-plumbing-drainage",
    name: "Hotel Plumbing & Drainage",
    discipline: "Plumbing",
    description:
      "Domestic water, hot-water return and gravity drainage model for a 15-storey hotel tower.",
    revitVersion: "2023",
    fileFormat: ".rvt",
    priceCents: PROJECT_PRICE_CENTS,
  },
  {
    id: "prj-mall-ventilation-model",
    slug: "mall-ventilation-model",
    name: "Shopping Mall Ventilation",
    discipline: "HVAC / Mechanical",
    description:
      "Smoke-extraction and air-distribution model for a retail mall with AHUs, ducts and fire dampers.",
    revitVersion: "2025",
    fileFormat: ".rvt",
    priceCents: PROJECT_PRICE_CENTS,
  },
];

export default async function BimProjectPage() {
  const { dict } = await getDictionary();
  const t = dict.bimProject;

  const crumbs: Crumb[] = [
    { label: dict.common.breadcrumbHome, href: "/" },
    { label: t.breadcrumb },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={crumbs} />
      <div className="mt-4">
        <p className="font-mono text-[11px] tracking-wider text-primary uppercase">
          {t.eyebrow}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t.lead}</p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <section className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-border/80 bg-secondary/40 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">{t.ctaTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.ctaBody}</p>
        </div>
        <Button asChild size="lg">
          <Link href="/bim-solution">{t.ctaButton}</Link>
        </Button>
      </section>
    </div>
  );
}
