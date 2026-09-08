import Link from "next/link";
import { ImagePlaceholder } from "@/components/catalog/image-placeholder";
import { DisciplineBadge, VersionChips } from "@/components/product/meta";
import { formatEur } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30">
      <Link href={`/products/${product.slug}`} className="block">
        {image ? (
          <div className="blueprint-grid relative aspect-[4/3] border-b border-border/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <ImagePlaceholder
            label={product.name}
            ratio="aspect-[4/3]"
            className="border-x-0 border-t-0"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <DisciplineBadge discipline={product.discipline} />
          <span className="font-mono text-[10px] text-muted-foreground">
            {product.sku}
          </span>
        </div>
        <div>
          <h3 className="text-base font-semibold leading-snug">
            <Link href={`/products/${product.slug}`} className="transition-colors hover:text-primary">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>
        <div className="mt-1">
          <VersionChips versions={product.revitVersions} />
        </div>
        <div className="mt-auto flex items-baseline justify-between border-t border-border/50 pt-4">
          <p className="text-lg font-semibold text-primary">{formatEur(product.priceCents)}</p>
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
