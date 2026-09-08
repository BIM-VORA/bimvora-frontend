import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Breadcrumbs, type Crumb } from "@/components/catalog/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { DisciplineBadge, VersionChips } from "@/components/product/meta";
import { ProductDownloads } from "@/components/product/product-downloads";
import { ProductSpecTable } from "@/components/product/product-spec-table";
import { getCategories, getProductBySlug, getProducts } from "@/lib/catalog";
import { formatEur, SITE_NAME } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Family not found" };
  return {
    title: { absolute: product.seoTitle ?? `${product.name} | ${SITE_NAME}` },
    description: product.seoDescription ?? product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categories = await getCategories();
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];
  if (product.category) {
    const type = product.category;
    const parent = type.parentId
      ? categories.find((c) => c.id === type.parentId)
      : undefined;
    const grandparent = parent?.parentId
      ? categories.find((c) => c.id === parent.parentId)
      : undefined;
    if (grandparent)
      crumbs.push({
        label: grandparent.name,
        href: `/categories/${grandparent.slug}`,
      });
    if (parent)
      crumbs.push({ label: parent.name, href: `/categories/${parent.slug}` });
    crumbs.push({ label: type.name, href: `/categories/${type.slug}` });
  }
  crumbs.push({ label: product.name });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    category: product.revitCategory,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={crumbs} />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <DisciplineBadge discipline={product.discipline} />
            {product.category ? (
              <Link
                href={`/categories/${product.category.slug}`}
                className="font-mono text-[11px] text-copper uppercase hover:underline"
              >
                {product.category.name}
              </Link>
            ) : null}
            <span className="font-mono text-[11px] text-muted-foreground">
              {product.sku}
            </span>
          </div>
          <h1 className="mt-3 text-3xl">{product.name}</h1>
          {product.manufacturer ? (
            <p className="mt-1 text-sm text-muted-foreground">
              by{" "}
              <span className="text-ink">{product.manufacturer}</span>
            </p>
          ) : null}
          <p className="mt-3 text-muted-foreground">{product.shortDescription}</p>
          <div className="mt-4">
            <VersionChips versions={product.revitVersions} />
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <p className="text-3xl text-copper">{formatEur(product.priceCents)}</p>
            {product.compareAtPriceCents ? (
              <p className="text-muted-foreground line-through">
                {formatEur(product.compareAtPriceCents)}
              </p>
            ) : null}
          </div>
          <div className="mt-6 max-w-sm">
            <AddToCartButton product={product} />
            <p className="mt-2 text-xs text-muted-foreground">
              Instant download is issued after payment. Checkout is prepared but
              not charging yet.
            </p>
          </div>
          <div className="mt-8">
            <ProductDownloads product={product} />
          </div>
          <div className="mt-8">
            <h2 className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              Technical specifications
            </h2>
            <div className="mt-2">
              <ProductSpecTable product={product} />
            </div>
          </div>
        </div>
      </div>
      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl">Family notes</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {product.description}
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}
