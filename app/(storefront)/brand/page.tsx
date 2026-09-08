import type { Metadata } from "next";
import Link from "next/link";
import { BrandSymbol } from "@/components/brand/brand-symbol";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: "Brand & visual identity",
  description:
    "The BIMVORA visual identity: logo system, symbol, colour palette, typography and usage rules for a premium Revit families and BIM content brand.",
};

const PALETTE = [
  { name: "Ink", hex: "#0E1C2F", role: "Primary / text", dark: true },
  { name: "Copper", hex: "#B85C38", role: "Accent / airflow", dark: true },
  { name: "Paper", hex: "#F4F1EA", role: "Background", dark: false },
  { name: "Slate", hex: "#5C6578", role: "Muted / captions", dark: true },
  { name: "Sand", hex: "#C4A574", role: "Support", dark: false },
  { name: "Teal", hex: "#3D6B6A", role: "Support / clean room", dark: true },
];

const DOWNLOADS = [
  { label: "Primary (stacked)", file: "/brand/logo-primary.svg" },
  { label: "Horizontal", file: "/brand/logo-horizontal.svg" },
  { label: "Horizontal · dark bg", file: "/brand/logo-horizontal-dark-bg.svg" },
  { label: "Symbol", file: "/brand/symbol.svg" },
  { label: "Symbol · dark bg", file: "/brand/symbol-dark-bg.svg" },
  { label: "Monochrome black", file: "/brand/logo-mono-black.svg" },
  { label: "Monochrome white", file: "/brand/logo-mono-white.svg" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export default function BrandPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Intro */}
      <header className="max-w-3xl">
        <SectionLabel>Visual identity</SectionLabel>
        <h1 className="mt-1 text-3xl">The BIMVORA brand</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          A premium, engineering-led identity for a marketplace of Revit families
          and BIM content across HVAC, plumbing and pharmaceutical clean rooms.
          The system is minimal, geometric and technical — precise enough for a
          spec sheet, confident enough for an international brand.
        </p>
      </header>

      {/* The symbol */}
      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-10">
          <div className="flex items-center justify-center">
            <BrandSymbol className="size-40" />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <SectionLabel>The symbol</SectionLabel>
          <h2 className="mt-1 text-2xl">Isometric cube in a hexagon</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The mark is an isometric cube inscribed in a hexagon. The three faces
            read as a 3D BIM object; the copper face is the airflow / HVAC signal;
            the six vertex nodes represent parametric control points and the
            precision of clean-room engineering. It is original geometry — not
            derived from the Autodesk or Revit marks.
          </p>
        </div>
      </section>

      {/* Logo versions */}
      <section className="mt-16">
        <SectionLabel>Logo system</SectionLabel>
        <h2 className="mt-1 text-2xl">Versions</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Primary */}
          <figure className="rounded-xl border border-border bg-card p-8">
            <div className="flex h-40 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <BrandSymbol className="size-16" />
                <div className="text-center leading-none">
                  <div className="text-xl font-semibold tracking-[0.28em] uppercase text-ink">
                    BIM<span className="text-copper">VORA</span>
                  </div>
                  <div className="mt-2 font-mono text-[8px] tracking-[0.3em] text-muted-foreground uppercase">
                    Revit · BIM Content
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              Primary — symbol + wordmark, stacked. Use for hero, print and
              splash contexts.
            </figcaption>
          </figure>

          {/* Horizontal */}
          <figure className="rounded-xl border border-border bg-card p-8">
            <div className="flex h-40 items-center justify-center">
              <Logo className="scale-150" />
            </div>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              Horizontal — symbol + wordmark inline. The default lockup for
              headers and navigation.
            </figcaption>
          </figure>

          {/* Icon */}
          <figure className="rounded-xl border border-border bg-card p-8">
            <div className="flex h-40 items-center justify-center gap-8">
              <BrandSymbol className="size-20" />
              <BrandSymbol className="size-10" />
              <BrandSymbol className="size-6" />
            </div>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              Icon — symbol only. Favicon, app icon and avatar. Stays legible
              down to 16px.
            </figcaption>
          </figure>

          {/* Dark background */}
          <figure className="overflow-hidden rounded-xl border border-border">
            <div className="flex h-40 items-center justify-center bg-ink">
              <Logo onDark className="scale-150" />
            </div>
            <figcaption className="bg-card p-4 text-sm text-muted-foreground">
              Dark background — light wordmark, copper accent retained.
            </figcaption>
          </figure>

          {/* Mono black */}
          <figure className="rounded-xl border border-border bg-card p-8">
            <div className="flex h-40 items-center justify-center">
              <div className="flex items-center gap-3">
                <BrandSymbol
                  className="size-14"
                  stroke="#000"
                  accent="#000"
                  node="#000"
                />
                <span className="text-xl font-semibold tracking-[0.22em] text-black uppercase">
                  BIMVORA
                </span>
              </div>
            </div>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              Monochrome black — single-colour reproduction, stamps, engraving.
            </figcaption>
          </figure>

          {/* Mono white */}
          <figure className="overflow-hidden rounded-xl border border-border">
            <div className="flex h-40 items-center justify-center bg-ink">
              <div className="flex items-center gap-3">
                <BrandSymbol
                  className="size-14"
                  stroke="#fff"
                  accent="#fff"
                  node="#fff"
                />
                <span className="text-xl font-semibold tracking-[0.22em] text-white uppercase">
                  BIMVORA
                </span>
              </div>
            </div>
            <figcaption className="bg-card p-4 text-sm text-muted-foreground">
              Monochrome white — knockout on photography and dark solids.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Palette */}
      <section className="mt-16">
        <SectionLabel>Colour</SectionLabel>
        <h2 className="mt-1 text-2xl">Palette</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PALETTE.map((c) => (
            <div
              key={c.hex}
              className="overflow-hidden rounded-xl border border-border"
            >
              <div className="h-24" style={{ backgroundColor: c.hex }} />
              <div className="bg-card p-3">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground uppercase">
                  {c.hex}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {c.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mt-16">
        <SectionLabel>Typography</SectionLabel>
        <h2 className="mt-1 text-2xl">Type system</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              Geist · Interface & headings
            </p>
            <p className="mt-3 text-4xl">Coordinated BIM content</p>
            <p className="mt-2 text-lg text-muted-foreground">
              Clear, neutral and modern for product and UI.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              Geist Mono · Technical labels
            </p>
            <p className="mt-3 font-mono text-2xl tracking-widest uppercase">
              REVIT 2021–2025
            </p>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              Used for specs, versions and metadata.
            </p>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="mt-16">
        <SectionLabel>Application</SectionLabel>
        <h2 className="mt-1 text-2xl">Clear space & usage</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-600/30 bg-emerald-600/5 p-6">
            <p className="text-sm font-medium text-emerald-700">Do</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Keep clear space of at least the symbol height on all sides.</li>
              <li>Use the dark-background lockup on ink, photography or teal.</li>
              <li>Maintain the copper accent as the only brand highlight.</li>
              <li>Scale the symbol proportionally; minimum icon size 16px.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-sm font-medium text-destructive">Don&apos;t</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Don&apos;t recolour the wordmark or add gradients / shadows.</li>
              <li>Don&apos;t stretch, rotate or outline the symbol.</li>
              <li>Don&apos;t place the colour logo on low-contrast backgrounds.</li>
              <li>Don&apos;t rebuild the lockup with a different typeface.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="mt-16">
        <SectionLabel>Assets</SectionLabel>
        <h2 className="mt-1 text-2xl">Download (SVG)</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {DOWNLOADS.map((d) => (
            <Link
              key={d.file}
              href={d.file}
              target="_blank"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm hover:border-copper hover:text-copper"
            >
              {d.label}
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-14 text-sm text-muted-foreground">
        Autodesk and Revit are trademarks of Autodesk, Inc. BIMVORA is an
        independent publisher and is not affiliated with Autodesk. This identity
        is original work created for BIMVORA.
      </p>
    </div>
  );
}
