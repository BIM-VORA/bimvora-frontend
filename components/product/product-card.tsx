import Link from "next/link";
import { DisciplineBadge, VersionChips } from "@/components/product/meta";
import { formatEur } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <article className="flex flex-col border border-border bg-card">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="blueprint-grid relative aspect-[4/3] border-b border-border">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <DisciplineBadge discipline={product.discipline} />
          <span className="font-mono text-[10px] text-muted-foreground">
            {product.sku}
          </span>
        </div>
        <div>
          <h3 className="text-base leading-snug">
            <Link href={`/products/${product.slug}`} className="hover:text-copper">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>
        <VersionChips versions={product.revitVersions} />
        <div className="mt-auto flex items-baseline justify-between border-t border-border pt-3">
          <p className="text-lg text-copper">{formatEur(product.priceCents)}</p>
          {product.compareAtPriceCents ? (
            <p className="text-sm text-muted-foreground line-through">
              {formatEur(product.compareAtPriceCents)}
            </p>
          ) : (
            <p className="font-mono text-[10px] text-muted-foreground uppercase">
              {product.fileFormat}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
