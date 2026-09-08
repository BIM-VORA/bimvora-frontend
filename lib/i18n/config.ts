export const LOCALES = ["en", "fr", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Locales that read right-to-left. */
export const RTL_LOCALES: readonly Locale[] = ["ar"];

export const LOCALE_META: Record<
  Locale,
  { label: string; native: string; flag: string }
> = {
  en: { label: "English", native: "English", flag: "🇬🇧" },
  fr: { label: "French", native: "Français", flag: "🇫🇷" },
  ar: { label: "Arabic", native: "العربية", flag: "🇸🇦" },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}
