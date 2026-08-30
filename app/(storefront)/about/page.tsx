import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "BIM Lab publishes professional Autodesk Revit families for HVAC, plumbing and fire protection.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        Studio
      </p>
      <h1 className="mt-1 text-3xl">About BIM Lab</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        BIM Lab is a professional catalog of Revit families for engineers, BIM
        modelers, architects and contractors who coordinate mechanical, electrical
        and plumbing systems. We sell loadable content — not stock 3D props.
      </p>
      <h2 className="mt-10 text-xl">What we model</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Each family is built around how it is used in a live model: Revit
        category, hosting, connectors, nested components, shared parameters and
        type catalogues. Listings state supported Revit versions so you can
        match the file to the project year.
      </p>
      <h2 className="mt-10 text-xl">Who it is for</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        HVAC designers, MEP coordinators, and BIM managers who need consistent
        plant, terminals and accessories rather than rebuilding the same
        equipment on every job.
      </p>
      <p className="mt-8 text-sm text-muted-foreground">
        Autodesk and Revit are trademarks of Autodesk, Inc. BIM Lab is an
        independent publisher and is not affiliated with Autodesk.
      </p>
    </article>
  );
}
