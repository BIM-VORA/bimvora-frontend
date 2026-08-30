export function formatEur(cents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const SITE_NAME = "BIM Lab";
export const SITE_TAGLINE =
  "Professional Revit families for MEP and BIM teams";
export const SITE_DESCRIPTION =
  "BIM Lab is a professional marketplace for Autodesk Revit families — HVAC, plumbing, fire protection and coordinated MEP content for engineers, BIM modelers and contractors.";
