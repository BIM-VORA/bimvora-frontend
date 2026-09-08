export type PackAudience =
  | "student"
  | "professional"
  | "advanced"
  | "company"
  | "bim_pro"
  | "all_access";

/** Keys used to look up translated strings in `dict.packs.items[dictKey]`. */
export type PackDictKey =
  | "student"
  | "professional"
  | "familyGroup"
  | "company"
  | "premium"
  | "allAccess";

/** Keys used to look up translated badge labels in `dict.packs.badges[badgeKey]`. */
export type PackBadgeKey =
  | "freeWithVerification"
  | "bimSpecialist"
  | "completeLibrary";

export type FamilyPack = {
  id: string;
  slug: string;
  number: number;
  /** English fallback / internal name — the i18n dict is the source of truth for the UI. */
  name: string;
  /** Short label used e.g. in toasts (`"{shortName} Pack added to cart"`). */
  shortName: string;
  /** English fallback for the audience line. */
  audience: string;
  audienceType: PackAudience;
  /** English fallback for the description. */
  description: string;
  priceCents: number;
  /** English fallback for the features bullet list. */
  features: string[];
  /** i18n dictionary key. Required — used to fetch translated name/description/features. */
  dictKey: PackDictKey;
  /** Optional English fallback badge text. */
  badge?: string;
  /** i18n key used to render the badge in the current language. */
  badgeKey?: PackBadgeKey;
  requiresStudentProof?: boolean;
  featured?: boolean;
};
