import { REVIT_VERSIONS, type Category, type Discipline } from "@/types/catalog";
import { DISCIPLINE_LABELS } from "@/types/catalog";
import { Button } from "@/components/ui/button";

const DISCIPLINES: Discipline[] = [
  "hvac",
  "plumbing",
  "electrical",
  "fire_protection",
];

export function ProductFilters({
  categories,
  values,
}: {
  categories: Category[];
  values: {
    q?: string;
    category?: string;
    discipline?: string;
    revitVersion?: string;
  };
}) {
  return (
    <form
      action="/shop"
      method="get"
      className="flex flex-col gap-4 border border-border bg-card p-4"
    >
      <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        Filter families
      </p>
      <label className="grid gap-1 text-sm">
        <span>Search</span>
        <input
          name="q"
          defaultValue={values.q}
          placeholder="Name or SKU"
          className="h-9 border border-border bg-background px-3 text-sm outline-none focus:border-ink"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Category</span>
        <select
          name="category"
          defaultValue={values.category ?? ""}
          className="h-9 border border-border bg-background px-3 text-sm outline-none focus:border-ink"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span>Discipline</span>
        <select
          name="discipline"
          defaultValue={values.discipline ?? ""}
          className="h-9 border border-border bg-background px-3 text-sm outline-none focus:border-ink"
        >
          <option value="">All disciplines</option>
          {DISCIPLINES.map((d) => (
            <option key={d} value={d}>
              {DISCIPLINE_LABELS[d]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span>Revit version</span>
        <select
          name="revitVersion"
          defaultValue={values.revitVersion ?? ""}
          className="h-9 border border-border bg-background px-3 text-sm outline-none focus:border-ink"
        >
          <option value="">All versions</option>
          {REVIT_VERSIONS.map((v) => (
            <option key={v} value={v}>
              Revit {v}
            </option>
          ))}
        </select>
      </label>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 rounded-none">
          Apply
        </Button>
        <Button type="button" variant="outline" className="rounded-none" asChild>
          <a href="/shop">Reset</a>
        </Button>
      </div>
    </form>
  );
}
