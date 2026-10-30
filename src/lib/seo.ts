import { useEffect } from 'react';
import { LANGS, pagePath, type Lang, type PageKey } from '../config/routes';
import { siteConfig } from '../config/site';

const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setLink = (selector: string, rel: string, href: string, hreflang?: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const abs = (path: string) => `${siteConfig.siteUrl || window.location.origin}${path}`;

export function useSeo(opts: { lang: Lang; page: PageKey | null; title: string; description: string }) {
  const { lang, page, title, description } = opts;
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', lang === 'es' ? 'es_ES' : 'en_US');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    if (page) {
      setLink('link[rel="canonical"]', 'canonical', abs(pagePath(lang, page)));
      setMeta('meta[property="og:url"]', 'property', 'og:url', abs(pagePath(lang, page)));
      for (const l of LANGS) {
        setLink(`link[rel="alternate"][hreflang="${l}"]`, 'alternate', abs(pagePath(l, page)), l);
      }
      setLink('link[rel="alternate"][hreflang="x-default"]', 'alternate', abs(pagePath('en', page)), 'x-default');
    }
  }, [lang, page, title, description]);
}
