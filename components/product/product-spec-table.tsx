import { FAMILY_KIND_LABELS, HOSTING_LABELS } from "@/types/catalog";
import type { Product } from "@/types/catalog";
import { formatFileSize } from "@/lib/format";

export function ProductSpecTable({ product }: { product: Product }) {
  const rows = [
    ["SKU", product.sku],
    product.manufacturer ? ["Manufacturer", product.manufacturer] : null,
    product.category ? ["Product type", product.category.name] : null,
    ["Revit category", product.revitCategory],
    ["Family type", FAMILY_KIND_LABELS[product.familyKind]],
    ["Hosting", HOSTING_LABELS[product.hosting]],
    ["File format", product.fileFormat],
    ["Revit versions", product.revitVersions.map((v) => `Revit ${v}`).join(", ")],
    product.cadFormats && product.cadFormats.length > 0
      ? ["CAD files", product.cadFormats.join(", ")]
      : null,
    product.fileSizeBytes
      ? ["Typical file size", formatFileSize(product.fileSizeBytes)]
      : null,
  ].filter(Boolean) as [string, string][];

  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="border-b border-border">
            <th className="w-40 py-2.5 pe-4 text-start font-mono text-[11px] font-normal tracking-wider text-muted-foreground uppercase">
              {label}
            </th>
            <td className="py-2.5">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
