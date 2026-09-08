import type { FamilyPack } from "@/types/packs";

export const FAMILY_PACKS: FamilyPack[] = [
  {
    id: "pack-student",
    slug: "student",
    number: 1,
    name: "Student",
    shortName: "Student",
    audience: "Students and BIM learners",
    audienceType: "student",
    description:
      "Core Revit families, training projects and templates for learning BIM workflows.",
    priceCents: 0,
    dictKey: "student",
    badge: "Free with verification",
    badgeKey: "freeWithVerification",
    requiresStudentProof: true,
    features: [
      "Essential HVAC and MEP families",
      "Training project files",
      "Starter templates",
      "Student certificate verification",
    ],
  },
  {
    id: "pack-professional",
    slug: "professional",
    number: 2,
    name: "Employee / Professional",
    shortName: "Professional",
    audience: "Employees, technicians and designers",
    audienceType: "professional",
    description:
      "Professional families ready for immediate use in coordinated projects.",
    priceCents: 1000,
    dictKey: "professional",
    features: [
      "Project-ready Revit families",
      "HVAC and MEP essentials",
      "Shared parameters",
      "Commercial-use licence",
    ],
  },
  {
    id: "pack-family-group",
    slug: "family-group",
    number: 3,
    name: "Employee Family Group",
    shortName: "Family Group",
    audience: "Advanced employees and specialists",
    audienceType: "advanced",
    description:
      "A focused family collection for one department: HVAC / Mechanical, Plumbing or Clean Room / Pharmaceutical.",
    priceCents: 2000,
    dictKey: "familyGroup",
    features: [
      "One complete discipline collection",
      "HVAC, Plumbing or Clean Room",
      "Coordinated connectors",
      "Consistent naming and parameters",
    ],
  },
  {
    id: "pack-company",
    slug: "company",
    number: 4,
    name: "Company",
    shortName: "Company",
    audience: "Engineering and construction companies",
    audienceType: "company",
    description:
      "A large Revit family library licensed for professional use inside one company.",
    priceCents: 10000,
    dictKey: "company",
    features: [
      "Large multi-discipline library",
      "Company-wide internal use",
      "MEP coordination content",
      "Priority issue reporting",
    ],
  },
  {
    id: "pack-premium",
    slug: "premium-pro-bim",
    number: 5,
    name: "Premium / Pro BIM",
    shortName: "Premium",
    audience: "BIM modelers and engineers",
    audienceType: "bim_pro",
    description:
      "Advanced parametric families with documentation and BIM standards for demanding projects.",
    priceCents: 10000,
    dictKey: "premium",
    badge: "BIM specialist",
    badgeKey: "bimSpecialist",
    featured: true,
    features: [
      "Advanced parametric families",
      "Technical documentation",
      "BIM naming standards",
      "Type catalogues and schedules",
    ],
  },
  {
    id: "pack-all-access",
    slug: "ultimate-all-access",
    number: 6,
    name: "Ultimate / All Access",
    shortName: "All Access",
    audience: "Professionals and companies",
    audienceType: "all_access",
    description:
      "Every pack, plus catalog updates and future additions in one complete BIM library.",
    priceCents: 20000,
    dictKey: "allAccess",
    badge: "Complete library",
    badgeKey: "completeLibrary",
    features: [
      "All current packs included",
      "Future family additions",
      "Catalog updates",
      "Multi-discipline access",
    ],
  },
];

export function getPackBySlug(slug: string): FamilyPack | undefined {
  return FAMILY_PACKS.find((pack) => pack.slug === slug);
}
