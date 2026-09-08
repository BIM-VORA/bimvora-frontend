import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, type Crumb } from "@/components/catalog/breadcrumbs";
import { CategoryCard } from "@/components/catalog/category-card";
import { ImagePlaceholder } from "@/components/catalog/image-placeholder";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getCategories,
  getCategoryLevel,
  getCategoryProductCounts,
  getChildCategories,
  getProducts,
} from "@/lib/catalog";
import { DISCIPLINE_LABELS } from "@/types/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.description ?? `${category.name} Revit families`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const level = getCategoryLevel(categories, category);
  const counts = await getCategoryProductCounts();
  const children = getChildCategories(categories, category.id);

  const parent = category.parentId
    ? categories.find((c) => c.id === category.parentId)
    : undefined;
  const grandparent = parent?.parentId
    ? categories.find((c) => c.id === parent.parentId)
    : undefined;

  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];
  if (grandparent)
    crumbs.push({
      label: grandparent.name,
      href: `/categories/${grandparent.slug}`,
    });
  if (parent)
    crumbs.push({ label: parent.name, href: `/categories/${parent.slug}` });
  crumbs.push({ label: category.name });

  const eyebrow =
    level === "department"
      ? `Department · ${DISCIPLINE_LABELS[category.discipline]}`
      : level === "category"
        ? `${parent?.name ?? ""} · Product category`
        : `${parent?.name ?? ""} · Product type`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={crumbs} />
      <div className="mt-4">
        <p className="font-mono text-[11px] tracking-wider text-copper uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-3xl">{category.name}</h1>
        {category.description ? (
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {category.description}
          </p>
        ) : null}
      </div>

      {/* Department or category: show child cards (ARCAT grid) */}
      {level !== "product_type" && children.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            {level === "department" ? "Product categories" : "Product types"}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <CategoryCard
                key={child.id}
                category={child}
                count={counts[child.id] ?? 0}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Product type: show products */}
      {level === "product_type" ? (
        <ProductTypeProducts slug={slug} categoryName={category.name} />
      ) : null}
    </div>
  );
}

async function ProductTypeProducts({
  slug,
  categoryName,
}: {
  slug: string;
  categoryName: string;
}) {
  const products = await getProducts({ category: slug });

  if (products.length === 0) {
    return (
      <section className="mt-8">
        <div className="grid gap-6 border border-border bg-card p-8 sm:grid-cols-[1fr_1.4fr] sm:items-center">
          <ImagePlaceholder label={categoryName} ratio="aspect-[4/3]" />
          <div>
            <h2 className="text-lg">No products in this type yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Revit families for {categoryName} are being prepared. Images and
              downloadable content will be added here soon.
            </p>
            <div className="mt-4 flex gap-2">
              <Button asChild className="">
                <Link href="/shop">Browse all families</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <p className="font-mono text-xs text-muted-foreground">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}
