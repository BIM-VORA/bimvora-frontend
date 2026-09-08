import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CTAAction = {
  label: string;
  href: string;
  /** Visual style. `primary` = filled brand; `ghost` = outlined-on-dark. */
  variant?: "primary" | "ghost";
};

export type CTAButtonsProps = {
  actions: [CTAAction, ...CTAAction[]];
  className?: string;
};

/**
 * Row of call-to-action buttons for the hero.
 * Designed to sit on a dark surface — the `ghost` variant uses paper-tinted
 * borders. Wraps automatically on narrow viewports.
 */
export function CTAButtons({ actions, className }: CTAButtonsProps) {
  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {actions.map((action) => {
        const isPrimary = action.variant !== "ghost";
        return (
          <Button
            key={action.href + action.label}
            asChild
            size="lg"
            variant={isPrimary ? "default" : "outline"}
            className={
              isPrimary
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                : "border-paper/30 bg-transparent text-paper hover:bg-paper/10 hover:text-paper"
            }
          >
            <Link href={action.href}>{action.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
