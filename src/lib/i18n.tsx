import { createContext, useContext, useMemo, type ReactNode } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';
import type { Lang } from '../config/routes';

type Node = string | Node[] | Dict;
type Dict = { [k: string]: Node };

const dictionaries: Record<Lang, Dict> = { en: en as Dict, es: es as Dict };

const lookup = (dict: Dict, key: string): Node | undefined => {
  let cur: Node | undefined = dict;
  for (const part of key.split('.')) {
    if (cur === undefined || typeof cur === 'string' || Array.isArray(cur)) return undefined;
    cur = cur[part];
  }
  return cur;
};

export interface I18n {
  lang: Lang;
  t: (key: string) => string;
  list: (key: string) => string[];
  raw: <T = Dict>(key: string) => T;
}

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo<I18n>(() => {
    const dict = dictionaries[lang];
    return {
      lang,
      t: (key) => {
        const v = lookup(dict, key);
        if (typeof v !== 'string') {
          if (import.meta.env.DEV) console.warn(`[i18n] missing string: ${lang}:${key}`);
          return key;
        }
        return v;
      },
      list: (key) => {
        const v = lookup(dict, key);
        return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
      },
      raw: <T,>(key: string) => lookup(dict, key) as unknown as T,
    };
  }, [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

const STORAGE_KEY = 'dualcode.lang';

export function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'en' || v === 'es' ? v : null;
  } catch {
    return null;
  }
}

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable: preference simply isn't persisted */
  }
}

export function detectLang(): Lang {
  const stored = readStoredLang();
  if (stored) return stored;
  const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
  return nav.startsWith('es') ? 'es' : 'en';
}
