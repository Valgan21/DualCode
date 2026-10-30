import type { PageKey } from './routes';

// Single source of truth for which pages exist. pages/index.ts must provide a component for each
// entry (enforced by type), and nav/footer/CTAs only link to pages listed here.
export const IMPLEMENTED_KEYS = [
  'home',
  'community',
  'privacy',
  'transparency',
  'technology',
  'product',
  'preview',
  'roadmap',
  'team',
  'enterprise',
  'download',
  'faq',
  'contact',
] as const satisfies readonly PageKey[];
export type ImplementedKey = (typeof IMPLEMENTED_KEYS)[number];

export const isImplemented = (k: PageKey): k is ImplementedKey => (IMPLEMENTED_KEYS as readonly PageKey[]).includes(k);
