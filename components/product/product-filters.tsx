import { REVIT_VERSIONS, type Category, type Discipline } from "@/types/catalog";
import { DISCIPLINE_LABELS } from "@/types/catalog";
import { Button } from "@/components/ui/button";

const DISCIPLINES: Discipline[] = ["hvac", "plumbing", "clean_room"];

export function ProductFilters({
  categories,
  manufacturers,
  values,
}: {
  categories: Category[];
  manufacturers: string[];
  values: {
    q?: string;
    category?: string;
    discipline?: string;
    manufacturer?: string;
    revitVersion?: string;
  };
}) {
  const departments = categories.filter((category) => !category.parentId);
  const childrenOf = (parentId: string) =>
    categories
      .filter((category) => category.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

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
        <span>Category &amp; type</span>
        <select
          name="category"
          defaultValue={values.category ?? ""}
          className="h-9 border border-border bg-background px-3 text-sm outline-none focus:border-ink"
        >
          <option value="">All categories</option>
          {departments.map((department) => (
            <optgroup key={department.id} label={department.name}>
              <option value={department.slug}>All {department.name}</option>
              {childrenOf(department.id).map((category) => [
                <option key={category.id} value={category.slug}>
                  {"\u00A0\u00A0"}
                  {category.name}
                </option>,
                ...childrenOf(category.id).map((type) => (
                  <option key={type.id} value={type.slug}>
                    {"\u00A0\u00A0\u00A0\u00A0\u2013\u00A0"}
                    {type.name}
                  </option>
                )),
              ])}
            </optgroup>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span>Manufacturer</span>
        <select
          name="manufacturer"
          defaultValue={values.manufacturer ?? ""}
          className="h-9 border border-border bg-background px-3 text-sm outline-none focus:border-ink"
        >
          <option value="">All manufacturers</option>
          {manufacturers.map((m) => (
            <option key={m} value={m}>
              {m}
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
        <Button type="submit" className="flex-1 ">
          Apply
        </Button>
        <Button type="button" variant="outline" className="" asChild>
          <a href="/shop">Reset</a>
        </Button>
      </div>
    </form>
  );
}
