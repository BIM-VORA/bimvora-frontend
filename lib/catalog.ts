import { SEED_CATEGORIES, SEED_PRODUCTS } from "@/lib/catalog-seed";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, ProductFilters } from "@/types/catalog";

/** Set of a category's own id plus every descendant id (any depth). */
function descendantIds(categories: Category[], rootId: string): Set<string> {
  const childrenByParent = new Map<string, string[]>();
  for (const c of categories) {
    if (!c.parentId) continue;
    const arr = childrenByParent.get(c.parentId) ?? [];
    arr.push(c.id);
    childrenByParent.set(c.parentId, arr);
  }
  const ids = new Set<string>([rootId]);
  const stack = [rootId];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    for (const child of childrenByParent.get(current) ?? []) {
      if (!ids.has(child)) {
        ids.add(child);
        stack.push(child);
      }
    }
  }
  return ids;
}

function matchesFilters(
  product: Product,
  filters: ProductFilters,
  acceptedCategoryIds: Set<string> | null,
): boolean {
  if (!product.isPublished) return false;
  if (filters.featured && !product.isFeatured) return false;
  if (acceptedCategoryIds && !acceptedCategoryIds.has(product.categoryId)) {
    return false;
  }
  if (filters.manufacturer && product.manufacturer !== filters.manufacturer) {
    return false;
  }
  if (filters.discipline && product.discipline !== filters.discipline) {
    return false;
  }
  if (
    filters.revitVersion &&
    !product.revitVersions.includes(filters.revitVersion)
  ) {
    return false;
  }
  if (
    filters.minPriceCents !== undefined &&
    product.priceCents < filters.minPriceCents
  ) {
    return false;
  }
  if (
    filters.maxPriceCents !== undefined &&
    product.priceCents > filters.maxPriceCents
  ) {
    return false;
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    const haystack = [
      product.name,
      product.sku,
      product.shortDescription,
      product.revitCategory,
      product.discipline,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

function fromSeed(filters: ProductFilters = {}): Product[] {
  let accepted: Set<string> | null = null;
  if (filters.category) {
    const selected = SEED_CATEGORIES.find((c) => c.slug === filters.category);
    accepted = selected
      ? descendantIds(SEED_CATEGORIES, selected.id)
      : new Set<string>();
  }
  return SEED_PRODUCTS.filter((p) => matchesFilters(p, filters, accepted));
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  short_description: string;
  description: string;
  price_cents: number;
  compare_at_price_cents: number | null;
  category_id: string;
  discipline: Product["discipline"];
  manufacturer: string | null;
  revit_category: string;
  family_kind: Product["familyKind"];
  hosting: Product["hosting"];
  revit_versions: string[];
  file_format: string;
  cad_formats: string[] | null;
  has_datasheet: boolean | null;
  is_published: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  categories: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    parent_id: string | null;
    discipline: Category["discipline"];
    sort_order: number;
    is_active: boolean;
  } | null;
  product_images: {
    id: string;
    url: string;
    alt: string;
    sort_order: number;
    is_primary: boolean;
  }[] | null;
};

function mapProduct(row: ProductRow): Product {
  const category = row.categories
    ? {
        id: row.categories.id,
        slug: row.categories.slug,
        name: row.categories.name,
        description: row.categories.description,
        parentId: row.categories.parent_id,
        discipline: row.categories.discipline,
        sortOrder: row.categories.sort_order,
        isActive: row.categories.is_active,
      }
    : undefined;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    shortDescription: row.short_description,
    description: row.description,
    priceCents: row.price_cents,
    compareAtPriceCents: row.compare_at_price_cents,
    categoryId: row.category_id,
    discipline: row.discipline,
    manufacturer: row.manufacturer ?? null,
    revitCategory: row.revit_category,
    familyKind: row.family_kind,
    hosting: row.hosting,
    revitVersions: row.revit_versions ?? [],
    fileFormat: row.file_format,
    cadFormats: row.cad_formats ?? undefined,
    hasDatasheet: row.has_datasheet ?? undefined,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    category,
    images: (row.product_images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sort_order,
        isPrimary: img.is_primary,
      })),
  };
}

const productSelect = `
  id, slug, name, sku, short_description, description,
  price_cents, compare_at_price_cents, category_id, discipline, manufacturer,
  revit_category, family_kind, hosting, revit_versions, file_format,
  cad_formats, has_datasheet,
  is_published, is_featured, seo_title, seo_description,
  categories ( id, slug, name, description, parent_id, discipline, sort_order, is_active ),
  product_images ( id, url, alt, sort_order, is_primary )
`;

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return SEED_CATEGORIES.filter((c) => c.isActive);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, slug, name, description, parent_id, discipline, sort_order, is_active",
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return SEED_CATEGORIES.filter((c) => c.isActive);
  }

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    parentId: row.parent_id,
    discipline: row.discipline,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return fromSeed(filters);
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(productSelect)
    .eq("is_published", true)
    .order("name", { ascending: true });

  if (filters.featured) query = query.eq("is_featured", true);
  if (filters.discipline) query = query.eq("discipline", filters.discipline);
  if (filters.manufacturer) {
    query = query.eq("manufacturer", filters.manufacturer);
  }
  if (filters.revitVersion) {
    query = query.contains("revit_versions", [filters.revitVersion]);
  }
  if (filters.minPriceCents !== undefined) {
    query = query.gte("price_cents", filters.minPriceCents);
  }
  if (filters.maxPriceCents !== undefined) {
    query = query.lte("price_cents", filters.maxPriceCents);
  }
  if (filters.q) {
    const q = filters.q.replaceAll(",", " ");
    query = query.or(
      `name.ilike.%${q}%,sku.ilike.%${q}%,short_description.ilike.%${q}%,revit_category.ilike.%${q}%`,
    );
  }

  const { data, error } = await query;
  if (error || !data) return fromSeed(filters);

  let products = (data as unknown as ProductRow[]).map(mapProduct);

  if (filters.category) {
    const categories = await getCategories();
    const selected = categories.find(
      (category) => category.slug === filters.category,
    );
    if (selected) {
      const acceptedIds = descendantIds(categories, selected.id);
      products = products.filter((product) =>
        acceptedIds.has(product.categoryId),
      );
    } else {
      products = [];
    }
  }

  return products;
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return SEED_PRODUCTS.find((p) => p.slug === slug && p.isPublished) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return SEED_PRODUCTS.find((p) => p.slug === slug && p.isPublished) ?? null;
  }

  return mapProduct(data as unknown as ProductRow);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true });
}

/** Direct children of a category, ordered by sortOrder. */
export function getChildCategories(
  categories: Category[],
  parentId: string,
): Category[] {
  return categories
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Depth of a category in the taxonomy tree. */
export function getCategoryLevel(
  categories: Category[],
  category: Category,
): "department" | "category" | "product_type" {
  if (!category.parentId) return "department";
  const parent = categories.find((c) => c.id === category.parentId);
  if (parent && !parent.parentId) return "category";
  return "product_type";
}

/** Distinct manufacturers across published products. */
export async function getManufacturers(): Promise<string[]> {
  const products = await getProducts();
  const set = new Set<string>();
  for (const p of products) {
    if (p.manufacturer) set.add(p.manufacturer);
  }
  return [...set].sort();
}

/**
 * Published product count per category id, aggregated up the tree so a
 * department/category count includes products in all descendant types.
 */
export async function getCategoryProductCounts(): Promise<
  Record<string, number>
> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const parentOf = new Map(categories.map((c) => [c.id, c.parentId] as const));
  const counts: Record<string, number> = {};
  for (const product of products) {
    let id: string | null = product.categoryId;
    const seen = new Set<string>();
    while (id && !seen.has(id)) {
      seen.add(id);
      counts[id] = (counts[id] ?? 0) + 1;
      id = parentOf.get(id) ?? null;
    }
  }
  return counts;
}
