import type { Locale } from './config';
import { type Dictionary, en } from './dictionaries/en';
import { vi } from './dictionaries/vi';

const dictionaries: Record<Locale, Dictionary> = { en, vi };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** A value with one entry per locale, used for translated content in data files. */
export type Localized<T = string> = Record<Locale, T>;

export type { Dictionary };
export * from './config';
