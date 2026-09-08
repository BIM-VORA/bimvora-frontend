import { cn } from "@/lib/utils";

export type PreviewBadgePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type PreviewBadgeProps = {
  /** Short label shown inside the badge (e.g. "Clean-room · Revit model"). */
  label: string;
  /** Optional lead pill color (defaults to the theme --primary). */
  dotClassName?: string;
  /** Which corner of the parent element the badge sticks to. */
  position?: PreviewBadgePosition;
  className?: string;
};

const POSITION_CLASSES: Record<PreviewBadgePosition, string> = {
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
};

/**
 * Small pill-shaped label that overlays a `RevitPreview` (or any parent
 * with `relative` positioning). Purely presentational.
 */
export function PreviewBadge({
  label,
  dotClassName,
  position = "bottom-left",
  className,
}: PreviewBadgeProps) {
  return (
    <span
      className={cn(
        "absolute z-10 inline-flex items-center gap-2 rounded-full",
        "bg-ink/70 px-3 py-1.5 backdrop-blur",
        "font-mono text-[10px] font-medium uppercase tracking-wider text-paper/90",
        POSITION_CLASSES[position],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full bg-primary", dotClassName)}
      />
      {label}
    </span>
  );
}
