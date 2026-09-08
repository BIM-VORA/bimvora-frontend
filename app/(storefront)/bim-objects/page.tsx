import type { Metadata } from "next";
import { Breadcrumbs, type Crumb } from "@/components/catalog/breadcrumbs";
import { CategoryCard } from "@/components/catalog/category-card";
import {
  getCategories,
  getCategoryProductCounts,
  getChildCategories,
} from "@/lib/catalog";
import { DISCIPLINE_LABELS } from "@/types/catalog";

export const metadata: Metadata = {
  title: "BIM-Objects",
  description:
    "Browse the BIMVORA library of Revit families by department, product category and product type — HVAC / Mechanical, Plumbing and Clean Room / Pharmaceutical.",
};

export default async function BimObjectsPage() {
  const categories = await getCategories();
  const counts = await getCategoryProductCounts();
  const departments = categories
    .filter((category) => !category.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, { label: "BIM-Objects" }];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={crumbs} />
      <div className="mt-4">
        <p className="font-mono text-[11px] tracking-wider text-copper uppercase">
          Revit family library
        </p>
        <h1 className="mt-1 text-3xl">BIM-Objects</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Browse loadable Revit families organised as Department → Product
          category → Product type. Pick a department to drill into categories
          and specific product types.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <CategoryCard
            key={department.id}
            category={department}
            count={counts[department.id] ?? 0}
            eyebrow={DISCIPLINE_LABELS[department.discipline]}
          />
        ))}
      </div>

      {departments.map((department) => {
        const children = getChildCategories(categories, department.id);
        return (
          <section key={`list-${department.id}`} className="mt-12">
            <h2 className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              {department.name}
            </h2>
            <div className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <a
                  key={child.id}
                  href={`/categories/${child.slug}`}
                  className="flex items-center justify-between gap-2 bg-card px-4 py-3 text-sm hover:bg-secondary"
                >
                  <span>{child.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {counts[child.id] ?? 0}
                  </span>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
