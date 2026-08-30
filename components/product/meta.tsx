import { Badge } from "@/components/ui/badge";
import { DISCIPLINE_LABELS, type Discipline } from "@/types/catalog";

export function DisciplineBadge({ discipline }: { discipline: Discipline }) {
  return (
    <Badge variant="outline" className="rounded-none font-mono text-[10px] tracking-wider uppercase">
      {DISCIPLINE_LABELS[discipline]}
    </Badge>
  );
}

export function VersionChips({ versions }: { versions: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {versions.map((v) => (
        <span
          key={v}
          className="border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-ink"
        >
          R{v}
        </span>
      ))}
    </div>
  );
}
