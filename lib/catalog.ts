import { SEED_CATEGORIES, SEED_PRODUCTS } from "@/lib/catalog-seed";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, ProductFilters } from "@/types/catalog";

function matchesFilters(product: Product, filters: ProductFilters): boolean {
  if (!product.isPublished) return false;
  if (filters.featured && !product.isFeatured) return false;
  if (filters.category && product.category?.slug !== filters.category) {
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
  return SEED_PRODUCTS.filter((p) => matchesFilters(p, filters));
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
  revit_category: string;
  family_kind: Product["familyKind"];
  hosting: Product["hosting"];
  revit_versions: string[];
  file_format: string;
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
    revitCategory: row.revit_category,
    familyKind: row.family_kind,
    hosting: row.hosting,
    revitVersions: row.revit_versions ?? [],
    fileFormat: row.file_format,
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
  price_cents, compare_at_price_cents, category_id, discipline,
  revit_category, family_kind, hosting, revit_versions, file_format,
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
    products = products.filter((p) => p.category?.slug === filters.category);
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
