import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'locales');
const load = (n) => JSON.parse(readFileSync(join(dir, `${n}.json`), 'utf8'));

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) => {
    const p = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) return [[`${p}.length`, `len:${v.length}`], ...flatten(Object.fromEntries(v.map((x, i) => [i, x])), p)];
    return v && typeof v === 'object' ? flatten(v, p) : [[p, typeof v === 'string' && v.trim() ? 'ok' : 'empty']];
  });

const en = new Map(flatten(load('en')));
const es = new Map(flatten(load('es')));
let errors = 0;
for (const [k, v] of en) {
  if (!es.has(k)) { console.error(`missing in es: ${k}`); errors++; }
  else if (v.startsWith('len:') && v !== es.get(k)) { console.error(`array length differs: ${k} (en ${v}, es ${es.get(k)})`); errors++; }
  if (v === 'empty') { console.error(`empty in en: ${k}`); errors++; }
}
for (const [k, v] of es) {
  if (!en.has(k)) { console.error(`missing in en: ${k}`); errors++; }
  if (v === 'empty') { console.error(`empty in es: ${k}`); errors++; }
}
if (errors) { console.error(`i18n check failed: ${errors} problem(s)`); process.exit(1); }
console.log(`i18n check ok: ${en.size} keys in sync (en/es)`);
