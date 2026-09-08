import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import {
  CTAButtons,
  HeroContent,
  HeroSection,
  PreviewBadge,
  RevitPreview,
} from "@/components/home/hero";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/server";
import { FAMILY_PACKS } from "@/lib/packs";
import { DISCIPLINE_LABELS } from "@/types/catalog";

export default async function HomePage() {
  const [featured, categories, { dict }] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getDictionary(),
  ]);
  const home = dict.home;
  const departments = categories.filter((category) => !category.parentId);

  return (
    <>
      <HeroSection
        content={
          <HeroContent
            eyebrow={home.heroEyebrow}
            title={home.heroTitle}
            lead={home.heroLead}
            actions={
              <CTAButtons
                actions={[
                  { label: home.browse, href: "/shop", variant: "primary" },
                  { label: home.comparePacks, href: "/packs", variant: "ghost" },
                ]}
              />
            }
          />
        }
        visual={
          <RevitPreview
            src="/hero/clean-room-model.png"
            alt="Coordinated Revit clean-room project model — isometric view"
            width={1024}
            height={640}
            priority
            overlay={<PreviewBadge label="Clean-room · Revit model" />}
          />
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              {home.deptEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">{home.deptTitle}</h2>
          </div>
          <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
            {home.allFamilies}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {departments.map((department, index) => {
            const children = categories.filter(
              (category) => category.parentId === department.id,
            );
            return (
              <article
                key={department.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30"
              >
                <Link
                  href={`/categories/${department.slug}`}
                  className="border-b border-border/50 p-6 transition-colors hover:bg-secondary/40"
                >
                  <p className="font-mono text-[10px] font-medium tracking-wider text-primary uppercase">
                    0{index + 1} · {DISCIPLINE_LABELS[department.discipline]}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{department.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {department.description}
                  </p>
                </Link>
                <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 p-6 text-sm">
                  {children.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-medium tracking-wider text-primary uppercase">
                {home.packsEyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-paper">{home.packsTitle}</h2>
            </div>
            <Link href="/packs" className="text-sm font-medium text-primary hover:underline">
              {home.packsCompare}
            </Link>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-paper/20 bg-paper/20 sm:grid-cols-3 shadow-lg">
            {FAMILY_PACKS.slice(0, 3).map((pack) => (
              <Link
                key={pack.id}
                href="/packs"
                className="bg-ink p-8 transition-colors hover:bg-paper/5"
              >
                <p className="font-mono text-[10px] font-medium tracking-wider text-paper/50 uppercase">
                  Pack {pack.number} · {pack.audience}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-paper">{pack.shortName}</h3>
                <p className="mt-4 font-semibold text-primary">
                  {pack.priceCents === 0
                    ? home.packFree
                    : `$${(pack.priceCents / 100).toFixed(0)} ${home.packOneTime}`}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            {home.featuredEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">{home.featuredTitle}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-20 md:grid-cols-3">
        {home.features.map((feature) => (
          <div key={feature.title} className="border-t-2 border-primary/20 pt-5">
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
