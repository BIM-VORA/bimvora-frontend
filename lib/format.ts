export function formatEur(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const SITE_NAME = "BIMVORA";
export const SITE_TAGLINE =
  "Professional Revit families for MEP and clean-room BIM teams";
export const SITE_DESCRIPTION =
  "BIMVORA is a professional BIM/Revit library — HVAC / Mechanical, Plumbing, and Clean Room / Pharmaceutical families organised by department, category and product type.";
