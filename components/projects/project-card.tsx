"use client";

import { Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/catalog/image-placeholder";
import { useI18n } from "@/components/i18n/i18n-provider";
import { useCartStore } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

export type BimProjectCardData = {
  id: string;
  /** Slug also acts as the i18n key inside `dict.bimProject.projects`. */
  slug: string;
  /** English fallback name. */
  name: string;
  /** English fallback discipline. */
  discipline: string;
  /** English fallback description. */
  description: string;
  revitVersion: string;
  fileFormat: string;
  priceCents: number;
};

export function ProjectCard({ project }: { project: BimProjectCardData }) {
  const { dict } = useI18n();
  const t = dict.bimProject;
  // Fall back to the English data if a translation for this slug is missing
  const translated =
    (t.projects as Record<string, { name: string; discipline: string; description: string } | undefined>)[
      project.slug
    ] ?? project;

  const addProject = useCartStore((state) => state.addProject);
  const inCart = useCartStore((state) =>
    state.lines.some((line) => line.productId === project.id),
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/40">
      <ImagePlaceholder label={translated.name} className="border-x-0 border-t-0" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-[10px] font-medium tracking-wider text-primary uppercase">
            {translated.discipline}
          </p>
          <span className="font-mono text-[10px] text-muted-foreground">
            {t.labels.revitVersion} {project.revitVersion}
          </span>
        </div>
        <h2 className="text-base font-semibold leading-snug">{translated.name}</h2>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {translated.description}
        </p>
        <div className="mt-auto space-y-4 border-t border-border/50 pt-4">
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold text-primary">
              ${(project.priceCents / 100).toFixed(0)}
              <span className="ms-1 text-xs font-normal text-muted-foreground">
                {t.labels.oneTime}
              </span>
            </p>
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              {project.fileFormat}
            </span>
          </div>
          <Button
            size="lg"
            className={cn(
              "w-full text-sm font-semibold shadow-sm transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md",
              inCart &&
                "!bg-primary/15 !text-primary !opacity-100 !shadow-none cursor-default",
            )}
            disabled={inCart}
            onClick={() => {
              addProject({
                id: project.id,
                slug: project.slug,
                name: translated.name,
                priceCents: project.priceCents,
              });
              toast.success(
                t.labels.toastAdded.replace("{name}", translated.name),
              );
            }}
          >
            {inCart ? (
              <>
                <Check className="size-4" />
                {t.labels.inCart}
              </>
            ) : (
              <>
                <ShoppingCart className="size-4" />
                {t.labels.addToCart}
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
