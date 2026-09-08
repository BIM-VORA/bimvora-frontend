import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { getCategories, getManufacturers, getProducts } from "@/lib/catalog";
import type { Discipline } from "@/types/catalog";

export const metadata: Metadata = {
  title: "Shop Revit families",
  description:
    "Browse professional HVAC, plumbing and fire protection Revit families. Filter by category, discipline and Revit version.",
};

type ShopSearch = {
  q?: string;
  category?: string;
  discipline?: string;
  manufacturer?: string;
  revitVersion?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearch>;
}) {
  const params = await searchParams;
  const discipline = params.discipline as Discipline | undefined;
  const [categories, manufacturers, products] = await Promise.all([
    getCategories(),
    getManufacturers(),
    getProducts({
      q: params.q,
      category: params.category,
      discipline,
      manufacturer: params.manufacturer,
      revitVersion: params.revitVersion,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        Catalog
      </p>
      <h1 className="mt-1 text-3xl">Shop Revit families</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Filter by discipline, Revit category and version. Prices in USD. Digital
        delivery after payment is enabled.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <ProductFilters
          categories={categories}
          manufacturers={manufacturers}
          values={params}
        />
        <div>
          <p className="mb-4 font-mono text-xs text-muted-foreground">
            {products.length} {products.length === 1 ? "family" : "families"}
          </p>
          {products.length === 0 ? (
            <p className="border border-border bg-card p-8 text-sm">
              No families match those filters.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
