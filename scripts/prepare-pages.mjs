import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const index = resolve(dist, 'index.html');

if (!existsSync(index)) {
  throw new Error('dist/index.html is missing; run the Vite build before preparing Pages.');
}

writeFileSync(resolve(dist, '_redirects'), '/* /index.html 200\n', 'utf8');
console.log('Pages artifact ready: dist/_redirects added for SPA fallback.');
