export type DashWho = 'you' | 'orch' | 'claude' | 'codex' | 'sys';
export type DashKind = 'cmd' | 'info' | 'ok' | 'msg' | 'ask';

export interface DashEvent {
  id: string;
  who: DashWho;
  kind: DashKind;
  /** Milliseconds to wait before this event appears. */
  wait: number;
}

export const DASH_EVENTS: DashEvent[] = [
  { id: 'task', who: 'you', kind: 'cmd', wait: 700 },
  { id: 'route', who: 'orch', kind: 'info', wait: 1100 },
  { id: 'read', who: 'claude', kind: 'info', wait: 1200 },
  { id: 'plan', who: 'claude', kind: 'ok', wait: 1500 },
  { id: 'memory', who: 'sys', kind: 'info', wait: 1000 },
  { id: 'edit', who: 'codex', kind: 'info', wait: 1300 },
  { id: 'create', who: 'codex', kind: 'ok', wait: 1200 },
  { id: 'tests', who: 'codex', kind: 'ok', wait: 1600 },
  { id: 'review', who: 'claude', kind: 'info', wait: 1300 },
  { id: 'handoff', who: 'claude', kind: 'msg', wait: 1400 },
  { id: 'fix', who: 'codex', kind: 'ok', wait: 1300 },
  { id: 'ask', who: 'sys', kind: 'ask', wait: 1200 },
  { id: 'approved', who: 'you', kind: 'ok', wait: 6000 },
  { id: 'done', who: 'sys', kind: 'ok', wait: 1200 },
];

export const DASH_HOLD_MS = 5500;

export const DASH_AT: number[] = DASH_EVENTS.reduce<number[]>((acc, ev) => {
  acc.push((acc[acc.length - 1] ?? 0) + ev.wait);
  return acc;
}, []);

export type DashId = (typeof DASH_EVENTS)[number]['id'];

/** Index of an event id; "has(step, id)" means the event has already been shown. */
export const dashIndex = (id: string): number => DASH_EVENTS.findIndex((e) => e.id === id);
export const dashHas = (step: number, id: string): boolean => dashIndex(id) < step;

export type TaskKey = 'plan' | 'implement' | 'review' | 'apply';
export const DASH_TASKS: { key: TaskKey; owner: 'claude' | 'codex' | 'you'; start: string; end: string }[] = [
  { key: 'plan', owner: 'claude', start: 'read', end: 'plan' },
  { key: 'implement', owner: 'codex', start: 'plan', end: 'tests' },
  { key: 'review', owner: 'claude', start: 'review', end: 'fix' },
  { key: 'apply', owner: 'you', start: 'ask', end: 'done' },
];

/** Ordered statuses per participant; the latest matched event wins. */
export const DASH_STATUS: Record<'claude' | 'codex' | 'you', [string, string][]> = {
  claude: [
    ['route', 'ready'],
    ['read', 'reading'],
    ['plan', 'planned'],
    ['review', 'reviewing'],
    ['handoff', 'waiting'],
    ['fix', 'done'],
  ],
  codex: [
    ['route', 'ready'],
    ['edit', 'editing'],
    ['tests', 'tested'],
    ['handoff', 'applying'],
    ['fix', 'done'],
  ],
  you: [
    ['ask', 'approval'],
    ['approved', 'approved'],
  ],
};

export interface DiffLine {
  kind: 'add' | 'del' | 'ctx';
  text: string;
  /** Event id after which the line is visible. */
  from: string;
  /** Event id after which the line disappears. */
  until?: string;
}

export interface DiffFile {
  path: string;
  from: string;
  lines: DiffLine[];
}

export const DASH_DIFF: DiffFile[] = [
  {
    path: 'src/auth/session.ts',
    from: 'edit',
    lines: [
      { kind: 'ctx', text: 'export async function openSession(user: User) {', from: 'edit' },
      { kind: 'ctx', text: '  const token = await issueToken(user.id);', from: 'edit' },
      { kind: 'del', text: '  return store.save(user.id, token);', from: 'edit' },
      { kind: 'add', text: '  const expiresAt = Date.now() + SESSION_TTL_MS;', from: 'edit' },
      { kind: 'add', text: '  return store.save(user.id, token, { expiresAt });', from: 'edit' },
      { kind: 'ctx', text: '}', from: 'edit' },
    ],
  },
  {
    path: 'src/auth/expiry.ts',
    from: 'create',
    lines: [
      { kind: 'add', text: 'export const SESSION_TTL_MS = 30 * 60_000;', from: 'create' },
      { kind: 'add', text: 'const SKEW_MS = 5_000;', from: 'fix' },
      { kind: 'add', text: 'export function isExpired(expiresAt: number, now = Date.now()) {', from: 'create' },
      { kind: 'add', text: '  return now >= expiresAt;', from: 'create', until: 'fix' },
      { kind: 'add', text: '  return now >= expiresAt - SKEW_MS;', from: 'fix' },
      { kind: 'add', text: '}', from: 'create' },
    ],
  },
];

export const DASH_MEMORY: { id: string; after: string }[] = [
  { id: 'memory', after: 'memory' },
  { id: 'tests', after: 'tests' },
  { id: 'done', after: 'done' },
];

export const visibleLines = (file: DiffFile, step: number): DiffLine[] =>
  file.lines.filter((l) => dashHas(step, l.from) && !(l.until && dashHas(step, l.until)));
