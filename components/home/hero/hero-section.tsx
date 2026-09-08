import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HeroSectionProps = {
  /** Left column — typically `<HeroContent />`. */
  content: ReactNode;
  /** Right column — typically `<RevitPreview />`. */
  visual: ReactNode;
  /**
   * When true, applies the blueprint dotted grid background used across
   * BIMVORA marketing surfaces. Defaults to `true`.
   */
  patterned?: boolean;
  className?: string;
};

/**
 * Two-column hero shell. Semantic `<section>` element. Collapses to a single
 * stacked column below the `lg` breakpoint. All spacing lives here — child
 * components never own outer margins.
 */
export function HeroSection({
  content,
  visual,
  patterned = true,
  className,
}: HeroSectionProps) {
  return (
    <section
      aria-label="Introduction"
      className={cn(
        "border-b border-border bg-ink text-paper",
        patterned && "blueprint-grid",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-12 px-4",
          "py-20 lg:gap-16 lg:py-24",
          "lg:grid-cols-[1fr_1.05fr]",
        )}
      >
        {content}
        {visual}
      </div>
    </section>
  );
}
