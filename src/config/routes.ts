export const LANGS = ['en', 'es'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const isLang = (v: string | undefined): v is Lang => LANGS.includes(v as Lang);

/** Page key -> localized URL slug. '' is the home page. */
export const ROUTES = {
  home: { en: '', es: '' },
  product: { en: 'product', es: 'producto' },
  technology: { en: 'technology', es: 'tecnologia' },
  privacy: { en: 'privacy', es: 'privacidad' },
  transparency: { en: 'transparency', es: 'transparencia' },
  roadmap: { en: 'roadmap', es: 'hoja-de-ruta' },
  community: { en: 'community', es: 'comunidad' },
  team: { en: 'team', es: 'equipo' },
  enterprise: { en: 'enterprise', es: 'empresas' },
  download: { en: 'download', es: 'descarga' },
  preview: { en: 'preview', es: 'demostracion' },
  faq: { en: 'faq', es: 'preguntas-frecuentes' },
  contact: { en: 'contact', es: 'contacto' },
} as const;

export type PageKey = keyof typeof ROUTES;

export const NAV_KEYS: PageKey[] = ['product', 'technology', 'privacy', 'transparency', 'roadmap', 'team', 'enterprise'];

/** Extra entries that only appear in the mobile menu. */
export const MOBILE_EXTRA_KEYS: PageKey[] = ['preview', 'community', 'download', 'faq', 'contact'];

export const pagePath = (lang: Lang, key: PageKey): string => {
  const slug = ROUTES[key][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}/`;
};

export const pageKeyFromSlug = (lang: Lang, slug: string): PageKey | null => {
  const hit = (Object.keys(ROUTES) as PageKey[]).find((k) => ROUTES[k][lang] === slug);
  return hit ?? null;
};
