export type Discipline =
  | "hvac"
  | "plumbing"
  | "electrical"
  | "fire_protection"
  | "architectural"
  | "structural"
  | "clean_room"
  | "other";

export type FamilyKind = "loadable" | "nested";

export type HostingType = "unhosted" | "wall" | "ceiling" | "face" | "level";

export type UserRole = "customer" | "admin";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parentId: string | null;
  discipline: Discipline;
  sortOrder: number;
  isActive: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  categoryId: string;
  discipline: Discipline;
  manufacturer: string | null;
  revitCategory: string;
  familyKind: FamilyKind;
  hosting: HostingType;
  revitVersions: string[];
  fileFormat: string;
  cadFormats?: string[];
  hasDatasheet?: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  category?: Category;
  images: ProductImage[];
  fileSizeBytes?: number;
};

export type ProductFilters = {
  q?: string;
  category?: string;
  discipline?: Discipline;
  manufacturer?: string;
  revitVersion?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  featured?: boolean;
};

/** Depth of a category in the taxonomy tree. */
export type CategoryLevel = "department" | "category" | "product_type";

export const DISCIPLINE_LABELS: Record<Discipline, string> = {
  hvac: "HVAC",
  plumbing: "Plumbing",
  electrical: "Electrical",
  fire_protection: "Fire Protection",
  architectural: "Architectural",
  structural: "Structural",
  clean_room: "Clean Room / Pharmaceutical",
  other: "Other",
};

export const HOSTING_LABELS: Record<HostingType, string> = {
  unhosted: "Unhosted",
  wall: "Wall",
  ceiling: "Ceiling",
  face: "Face",
  level: "Level",
};

export const FAMILY_KIND_LABELS: Record<FamilyKind, string> = {
  loadable: "Loadable family",
  nested: "Nested family",
};

export const REVIT_VERSIONS = ["2022", "2023", "2024", "2025", "2026"] as const;
