import { cn } from "@/lib/utils";

type BrandSymbolProps = {
  className?: string;
  stroke?: string;
  accent?: string;
  node?: string;
  title?: string;
};

/**
 * BIMVORA mark: an isometric cube inscribed in a hexagon.
 * - Hexagon + inner "Y" reads as a 3D BIM cube (modeling / 3D).
 * - One copper face is the HVAC airflow accent.
 * - Vertex nodes signal parametric control points and precision.
 * Original geometry — not derived from Autodesk/Revit marks.
 */
export function BrandSymbol({
  className,
  stroke = "var(--ink)",
  accent = "var(--copper)",
  node = "var(--ink)",
  title = "BIMVORA",
}: BrandSymbolProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn("block", className)}
      fill="none"
    >
      {/* copper accent face (right) — the airflow / HVAC signal */}
      <polygon points="54.5,19 54.5,45 32,58 32,32" fill={accent} />
      {/* subtle left face tint for depth */}
      <polygon
        points="9.5,19 9.5,45 32,58 32,32"
        fill={stroke}
        fillOpacity="0.08"
      />
      {/* cube / hexagon edges */}
      <g stroke={stroke} strokeWidth="2.1" strokeLinejoin="round">
        <polygon points="32,6 54.5,19 54.5,45 32,58 9.5,45 9.5,19" />
        <path d="M32 6 V32 M9.5 19 L32 32 M54.5 19 L32 32 M32 32 V58" />
      </g>
      {/* parametric control-point nodes */}
      <g fill={node}>
        <circle cx="32" cy="6" r="2.1" />
        <circle cx="54.5" cy="19" r="2.1" />
        <circle cx="54.5" cy="45" r="2.1" />
        <circle cx="32" cy="58" r="2.1" />
        <circle cx="9.5" cy="45" r="2.1" />
        <circle cx="9.5" cy="19" r="2.1" />
      </g>
    </svg>
  );
}
