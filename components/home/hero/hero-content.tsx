import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HeroContentProps = {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** Main heading — rendered as an `<h1>` for SEO / a11y. */
  title: ReactNode;
  /** Supporting lead paragraph. */
  lead: ReactNode;
  /** Optional CTA area (typically a `<CTAButtons />`). */
  actions?: ReactNode;
  className?: string;
};

/**
 * Text column for the hero. Handles vertical rhythm and max-width so titles
 * never grow past a readable measure regardless of viewport width.
 */
export function HeroContent({
  eyebrow,
  title,
  lead,
  actions,
  className,
}: HeroContentProps) {
  return (
    <div className={cn("max-w-xl", className)}>
      {eyebrow ? (
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      ) : null}

      <h1
        className={cn(
          "mt-5 font-bold tracking-tight text-paper",
          "text-4xl sm:text-5xl lg:text-6xl",
          "text-balance leading-[1.05]",
        )}
      >
        {title}
      </h1>

      <p className="mt-6 max-w-lg text-base leading-relaxed text-paper/70 sm:text-lg">
        {lead}
      </p>

      {actions ? <div className="mt-10">{actions}</div> : null}
    </div>
  );
}
