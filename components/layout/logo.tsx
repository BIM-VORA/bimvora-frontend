import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Kept for API compatibility. The provided brand asset already includes both light and dark contexts. */
  onDark?: boolean;
  /** Kept for API compatibility. The wordmark is baked into the brand image. */
  showWordmark?: boolean;
};

export function Logo({ className = "", onDark = false }: LogoProps) {
  const src = onDark
    ? "/brand/bimvora/logo-horizontal-dark.svg"
    : "/brand/bimvora/logo-horizontal.svg";
  return (
    <span
      className={cn("inline-flex items-center", className)}
      aria-label="BIMVORA — HVAC & Clean Room Revit families"
    >
      {/* Plain <img> on a static SVG: ~1.4 KB vs. the previous 72 KB PNG,
          and it skips the image-optimization roundtrip entirely. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="BIMVORA — HVAC & Clean Room"
        width={474}
        height={128}
        decoding="async"
        fetchPriority="high"
        className="h-10 w-auto select-none"
      />
    </span>
  );
}
