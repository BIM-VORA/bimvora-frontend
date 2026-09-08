import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/catalog/image-placeholder";
import type { Category } from "@/types/catalog";

type CategoryCardProps = {
  category: Category;
  count?: number;
  eyebrow?: string;
};

/** ARCAT-style category card: image placeholder, name, description, count. */
export function CategoryCard({ category, count, eyebrow }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30"
    >
      <ImagePlaceholder label={category.name} />
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {eyebrow ? (
          <p className="font-mono text-[10px] font-medium tracking-wider text-primary uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-primary">
          {category.name}
        </h3>
        {category.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {category.description}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
          <span className="font-mono text-[11px] font-medium text-muted-foreground">
            {count ?? 0} {count === 1 ? "product" : "products"}
          </span>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary rtl:group-hover:-translate-x-0.5 rtl:rotate-180" />
        </div>
      </div>
    </Link>
  );
}
