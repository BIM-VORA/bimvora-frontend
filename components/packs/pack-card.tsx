"use client";

import Link from "next/link";
import { Check, Layers3 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/i18n-provider";
import { useCartStore } from "@/lib/cart/store";
import { formatEur } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FamilyPack } from "@/types/packs";

export function PackCard({ pack }: { pack: FamilyPack }) {
  const { dict } = useI18n();
  const t = dict.packs;
  const item = t.items[pack.dictKey];
  const badgeLabel = pack.badgeKey ? t.badges[pack.badgeKey] : pack.badge;

  const addPack = useCartStore((state) => state.addPack);
  const inCart = useCartStore((state) =>
    state.lines.some((line) => line.productId === pack.id),
  );

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg",
        pack.featured
          ? "border-primary shadow-primary/20 ring-1 ring-primary/20"
          : "border-border/80 hover:border-primary/40",
      )}
    >
      {badgeLabel ? (
        <div
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase",
            pack.featured
              ? "bg-primary text-primary-foreground shadow-md"
              : "border border-border/80 bg-background text-foreground shadow-sm",
          )}
        >
          {badgeLabel}
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4 border-b border-border/50 p-6 pt-8">
        <div>
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{item.audience}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border/50 bg-secondary text-primary">
          <Layers3 className="size-5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-end gap-1">
          <p className="text-3xl font-bold text-primary">
            {pack.priceCents === 0 ? dict.common.free : formatEur(pack.priceCents)}
          </p>
          {pack.priceCents > 0 ? (
            <span className="pb-1 text-xs text-muted-foreground">
              {t.oneTime}
            </span>
          ) : null}
        </div>
        <p className="mt-3 min-h-[3rem] text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        <ul className="mt-6 space-y-3 border-t border-border/50 pt-5">
          {item.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm text-foreground/80">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>

        {pack.requiresStudentProof ? (
          <Button asChild size="lg" className="mt-auto w-full text-sm font-semibold">
            <Link href="#student-verification">{t.verifyStudent}</Link>
          </Button>
        ) : (
          <Button
            size="lg"
            className={cn(
              "mt-auto w-full text-sm font-semibold shadow-sm transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md",
              inCart && "!bg-primary/15 !text-primary !opacity-100 !shadow-none cursor-default",
            )}
            disabled={inCart}
            onClick={() => {
              addPack(pack);
              toast.success(t.toast.added.replace("{name}", pack.shortName));
            }}
          >
            {inCart ? (
              <>
                <Check className="size-4" />
                {t.inCart}
              </>
            ) : (
              t.addToCart
            )}
          </Button>
        )}
      </div>
    </article>
  );
}
