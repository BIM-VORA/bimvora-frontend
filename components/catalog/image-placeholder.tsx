import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  className?: string;
  label?: string;
  ratio?: string;
};

/**
 * Empty image slot for catalog cards and product pages.
 * Images will be added later; this reserves the space with a blueprint motif.
 */
export function ImagePlaceholder({
  className,
  label = "Image coming soon",
  ratio = "aspect-[4/3]",
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "blueprint-grid relative flex flex-col items-center justify-center gap-2 border-b border-border/40 bg-slate-50/50 text-muted-foreground",
        ratio,
        className,
      )}
    >
      <ImageIcon className="size-7 opacity-40" />
      <span className="font-mono text-[10px] tracking-wider uppercase opacity-70">
        {label}
      </span>
    </div>
  );
}
