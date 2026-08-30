import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Search",
  description: "Search BIM Lab Revit families by name, SKU or category.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = q ? await getProducts({ q }) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">Search</h1>
      <form action="/search" className="mt-6 max-w-xl">
        <label className="sr-only" htmlFor="q">
          Search families
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Name, SKU, category…"
          className="h-11 w-full border border-border bg-card px-3 outline-none focus:border-ink"
        />
      </form>
      {q ? (
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {products.length} result{products.length === 1 ? "" : "s"} for “{q}”
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Enter a family name, SKU or Revit category.
        </p>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
