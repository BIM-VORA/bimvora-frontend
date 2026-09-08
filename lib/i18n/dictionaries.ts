import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import { ar } from "./dictionaries/ar";

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { en, fr, ar };

export function getDictionaryFor(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? en;
}
