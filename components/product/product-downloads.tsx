import { Box, FileText, Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/catalog";

type Asset = {
  icon: typeof Box;
  label: string;
  meta: string;
};

export function ProductDownloads({ product }: { product: Product }) {
  const assets: Asset[] = [
    {
      icon: Box,
      label: "BIM / Revit Family",
      meta: `${product.fileFormat} · Revit ${product.revitVersions[0] ?? ""}–${
        product.revitVersions[product.revitVersions.length - 1] ?? ""
      }`,
    },
  ];

  if (product.cadFormats && product.cadFormats.length > 0) {
    assets.push({
      icon: Box,
      label: "CAD files",
      meta: product.cadFormats.join(", "),
    });
  }

  if (product.hasDatasheet) {
    assets.push({
      icon: FileText,
      label: "PDF datasheet",
      meta: ".pdf",
    });
  }

  return (
    <div className="border border-border bg-card">
      <p className="border-b border-border px-4 py-3 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        Files & downloads
      </p>
      <ul className="divide-y divide-border">
        {assets.map((asset) => (
          <li
            key={asset.label}
            className="flex items-center gap-3 px-4 py-3 text-sm"
          >
            <asset.icon className="size-4 shrink-0 text-copper" />
            <span className="flex-1">
              {asset.label}
              <span className="ms-2 font-mono text-[11px] text-muted-foreground">
                {asset.meta}
              </span>
            </span>
            <Button
              size="sm"
              variant="outline"
              className=""
              disabled
            >
              <Lock className="size-3.5" />
              After purchase
            </Button>
          </li>
        ))}
      </ul>
      <div className="border-t border-border px-4 py-3">
        <Button className="w-full " disabled>
          <Download className="size-4" />
          Download (available after checkout)
        </Button>
      </div>
    </div>
  );
}
