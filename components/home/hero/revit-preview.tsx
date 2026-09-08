import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevitPreviewProps = {
  /** Absolute or root-relative image URL (e.g. `/hero/clean-room-model.png`). */
  src: string;
  /** Descriptive alt text — required for a11y. */
  alt: string;
  /** Intrinsic width of the source image, used for aspect-ratio + LCP hints. */
  width: number;
  /** Intrinsic height of the source image. */
  height: number;
  /**
   * Optional overlay content (typically a `<PreviewBadge />`).
   * Rendered inside the same `<figure>` for correct stacking.
   */
  overlay?: ReactNode;
  /** Optional caption rendered *below* the image (visually hidden by default). */
  caption?: string;
  /**
   * When true, disables the soft blue glow behind the frame.
   * Useful on light backgrounds.
   */
  disableGlow?: boolean;
  /** When true, image is fetched eagerly (recommended for above-the-fold hero). */
  priority?: boolean;
  className?: string;
};

/**
 * Framed preview of a Revit model rendering. Purely presentational —
 * consumers control the source image, alt text and overlay content.
 *
 * Uses a plain `<img>` so we skip Next.js image optimization for a static
 * hero asset (already sized correctly on disk).
 */
export function RevitPreview({
  src,
  alt,
  width,
  height,
  overlay,
  caption,
  disableGlow = false,
  priority = false,
  className,
}: RevitPreviewProps) {
  return (
    <div className={cn("relative", className)}>
      {!disableGlow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-2xl bg-primary/10 blur-2xl"
        />
      ) : null}

      <figure
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "border border-paper/15 bg-paper/5",
          "shadow-2xl ring-1 ring-paper/10",
        )}
      >
        {overlay}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="block h-auto w-full"
        />
        {caption ? (
          <figcaption className="sr-only">{caption}</figcaption>
        ) : null}
      </figure>
    </div>
  );
}
