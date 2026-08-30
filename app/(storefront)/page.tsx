import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { SITE_TAGLINE } from "@/lib/format";
import { DISCIPLINE_LABELS } from "@/types/catalog";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <section className="blueprint-grid border-b border-border bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-copper uppercase">
              Revit family marketplace
            </p>
            <h1 className="mt-4 max-w-xl text-4xl text-paper sm:text-5xl">
              {SITE_TAGLINE}
            </h1>
            <p className="mt-4 max-w-lg text-paper/70">
              Loadable .rfa content with nested connectors, shared parameters and
              version coverage for coordinated HVAC and MEP models — not
              generic 3D furniture.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-none bg-copper text-paper hover:bg-copper/90">
                <Link href="/shop">Browse families</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-paper/30 bg-transparent text-paper hover:bg-paper/10"
              >
                <Link href="/about">How we build content</Link>
              </Button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-px border border-paper/20 bg-paper/10 text-sm">
            {[
              ["Format", ".rfa loadable"],
              ["Versions", "2022–2026"],
              ["Currency", "EUR"],
              ["Delivery", "Account download"],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink px-4 py-5">
                <dt className="font-mono text-[10px] tracking-wider text-paper/50 uppercase">
                  {k}
                </dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              Disciplines
            </p>
            <h2 className="mt-1 text-2xl">Shop by MEP category</h2>
          </div>
          <Link href="/shop" className="text-sm text-copper hover:underline">
            All families
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="border border-border bg-card p-5 hover:border-ink"
            >
              <p className="font-mono text-[10px] tracking-wider text-copper uppercase">
                {DISCIPLINE_LABELS[c.discipline]}
              </p>
              <h3 className="mt-2 text-lg">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Featured
          </p>
          <h2 className="mt-1 text-2xl">Families used on live projects</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3">
        {[
          [
            "Project-ready parameters",
            "Airflow, duty, fire rating and electrical load are modelled as shared parameters so they schedule cleanly.",
          ],
          [
            "Connectors that coordinate",
            "Duct, pipe, electrical and nested families are placed for clash-detectable MEP models, not just pretty geometry.",
          ],
          [
            "Versioned files",
            "Each listing states supported Revit years. Downloads will be issued per purchase in a later phase.",
          ],
        ].map(([title, body]) => (
          <div key={title} className="border-t border-ink pt-4">
            <h3 className="text-base">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
