import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const routesSource = readFileSync(join(root, 'src/config/routes.ts'), 'utf8');
const implementedSource = readFileSync(join(root, 'src/config/implemented.ts'), 'utf8');

const readEnvSiteUrl = () => {
  const fromProcess = process.env.VITE_SITE_URL?.trim();
  if (fromProcess) return fromProcess;
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return '';
  const match = readFileSync(envPath, 'utf8').match(/^\s*(?:export\s+)?VITE_SITE_URL\s*=\s*(.*?)\s*$/m);
  return match?.[1]?.replace(/^['"]|['"]$/g, '').trim() ?? '';
};

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const siteUrl = readEnvSiteUrl().replace(/\/$/, '');
if (!siteUrl) {
  console.warn('[sitemap] VITE_SITE_URL is not set; sitemap.xml was not generated.');
  process.exit(0);
}

let parsedUrl;
try {
  parsedUrl = new URL(siteUrl);
} catch {
  console.error(`[sitemap] Invalid VITE_SITE_URL: ${siteUrl}`);
  process.exit(1);
}
if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
  console.error('[sitemap] VITE_SITE_URL must use http or https.');
  process.exit(1);
}

const routes = Object.fromEntries(
  [...routesSource.matchAll(/^\s{2}(\w+): \{ en: '([^']*)', es: '([^']*)' \},$/gm)]
    .map(([, key, en, es]) => [key, { en, es }]),
);
const implementedKeys = [...implementedSource.matchAll(/^\s+'([^']+)',?$/gm)].map(([, key]) => key);
const keys = implementedKeys.filter((key) => routes[key]);
if (keys.length !== implementedKeys.length) {
  console.error('[sitemap] IMPLEMENTED_KEYS contains a page missing from ROUTES.');
  process.exit(1);
}

const pageUrl = (lang, key) => {
  const slug = routes[key][lang];
  return `${siteUrl}/${lang}/${slug}`.replace(/\/\/$/, '/');
};
const urls = keys.map((key) => ['en', 'es'].map((lang) => {
  const alternates = ['en', 'es'].map((alternate) =>
    `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${escapeXml(pageUrl(alternate, key))}" />`,
  ).join('\n');
  return [
    '  <url>',
    `    <loc>${escapeXml(pageUrl(lang, key))}</loc>`,
    alternates,
    '  </url>',
  ].join('\n');
}).join('\n')).join('\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  urls,
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(root, 'public/sitemap.xml'), sitemap, 'utf8');
console.log(`[sitemap] generated public/sitemap.xml with ${keys.length * 2} localized URLs.`);
