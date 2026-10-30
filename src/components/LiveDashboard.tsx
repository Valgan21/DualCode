import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { StatusBadge } from './ui';
import { useI18n } from '../lib/i18n';
import {
  DASH_AT,
  DASH_DIFF,
  DASH_EVENTS,
  DASH_HOLD_MS,
  DASH_MEMORY,
  DASH_STATUS,
  DASH_TASKS,
  dashHas,
  dashIndex,
  visibleLines,
  type DashWho,
} from '../data/dashboard';

const TOTAL = DASH_EVENTS.length;
const ASK_STEP = dashIndex('ask') + 1;

const fmtClock = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

function latest(table: [string, string][], step: number, fallback: string): string {
  let out = fallback;
  for (const [id, key] of table) if (dashHas(step, id)) out = key;
  return out;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function useInView<T extends Element>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

function Panel({ title, aside, className = '', children }: { title: string; aside?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`dash-panel ${className}`.trim()}>
      <header className="dash-panel-head">
        <h3>{title}</h3>
        {aside}
      </header>
      {children}
    </section>
  );
}

export function LiveDashboard() {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const [rootRef, inView] = useInView<HTMLElement>();
  const [step, setStep] = useState(0);
  const [userPaused, setUserPaused] = useState(false);

  const shown = reduced ? TOTAL : step;
  const running = !reduced && inView && !userPaused;

  useEffect(() => {
    if (!running) return;
    const delay = step >= TOTAL ? DASH_HOLD_MS : DASH_EVENTS[step].wait;
    const id = window.setTimeout(() => setStep((s) => (s >= TOTAL ? 0 : s + 1)), delay);
    return () => window.clearTimeout(id);
  }, [running, step]);

  const awaitingApproval = shown === ASK_STEP;
  const approve = () => setStep((s) => (s === ASK_STEP ? s + 1 : s));

  const events = DASH_EVENTS.slice(0, shown);
  const who = (w: DashWho) => t(`dash.who.${w}`);

  const agentStatus = {
    claude: latest(DASH_STATUS.claude, shown, 'idle'),
    codex: latest(DASH_STATUS.codex, shown, 'idle'),
    you: latest(DASH_STATUS.you, shown, 'idle'),
  };

  const filesChanged = dashHas(shown, 'create') ? 2 : dashHas(shown, 'edit') ? 1 : 0;
  const testsState = dashHas(shown, 'tests') ? 'Passed' : dashHas(shown, 'edit') ? 'Running' : 'Pending';
  const reviewState = dashHas(shown, 'fix') ? 'Approved' : dashHas(shown, 'review') ? 'Active' : 'Pending';
  const permState = dashHas(shown, 'approved') ? 'Granted' : dashHas(shown, 'ask') ? 'Ask' : 'None';

  const diffFiles = useMemo(
    () => DASH_DIFF.map((f) => ({ file: f, lines: visibleLines(f, shown) })).filter((f) => f.lines.length > 0),
    [shown],
  );
  const added = diffFiles.reduce((n, f) => n + f.lines.filter((l) => l.kind === 'add').length, 0);
  const removed = diffFiles.reduce((n, f) => n + f.lines.filter((l) => l.kind === 'del').length, 0);
  const memory = DASH_MEMORY.filter((m) => dashHas(shown, m.after));

  const progress = shown / TOTAL;

  return (
    <figure className="dash" ref={rootRef} aria-label={t('dash.label')}>
      <p className="sr-only">{t('dash.srSummary')}</p>

      <div className="dash-bar">
        <span className="dash-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="dash-title">{t('dash.window')}</span>
        <div className="dash-controls">
          <button
            type="button"
            className="dash-btn"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            disabled={reduced}
          >
            {userPaused ? t('dash.controls.play') : t('dash.controls.pause')}
          </button>
          <button
            type="button"
            className="dash-btn"
            onClick={() => {
              setStep(0);
              setUserPaused(false);
            }}
            disabled={reduced}
          >
            {t('dash.controls.replay')}
          </button>
        </div>
        <StatusBadge kind="concept" />
      </div>

      <div className="dash-grid">
        <div className="dash-agents">
          <Panel title={t('dash.panels.agents')}>
            <ul className="agent-rows">
              {(['claude', 'codex', 'you'] as const).map((id) => {
                const state = agentStatus[id];
                const live = state !== 'idle' && state !== 'done' && state !== 'approved' && state !== 'waiting';
                return (
                  <li key={id} className={`agent-row agent-row-${id}${live ? ' is-live' : ''}`}>
                    <span className="agent-pip" />
                    <span className="agent-name">{id === 'you' ? t('dash.who.you') : t(`dash.who.${id}`)}</span>
                    <span className="agent-state">{t(`dash.agentStatus.${state}`)}</span>
                    {id === 'you' && awaitingApproval && (
                      <button type="button" className="dash-approve" onClick={approve}>
                        {t('dash.controls.approve')}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title={t('dash.panels.tasks')}>
            <ol className="task-rows">
              {DASH_TASKS.map((task) => {
                const state = dashHas(shown, task.end) ? 'done' : dashHas(shown, task.start) ? 'active' : 'queued';
                return (
                  <li key={task.key} className={`task-row is-${state}`}>
                    <span className="task-mark" />
                    <span className="task-label">
                      {t(`dash.task.${task.key}`)}
                      <small>
                        {task.owner === 'you' ? t('dash.who.you') : t(`dash.who.${task.owner}`)} · {t(`dash.taskState.${state}`)}
                      </small>
                    </span>
                  </li>
                );
              })}
            </ol>
          </Panel>
        </div>

        <div className="dash-main">
          <Panel
            title={t('dash.panels.diff')}
            className="dash-diff"
            aside={
              <span className="diff-count">
                <b className="plus">+{added}</b> <b className="minus">−{removed}</b>
              </span>
            }
          >
            <div className="diff-body">
              {diffFiles.length === 0 && <p className="diff-empty">{t('dash.diffEmpty')}</p>}
              {diffFiles.map(({ file, lines }) => (
                <div key={file.path} className="diff-file">
                  <p className="diff-path">{file.path}</p>
                  <pre>
                    {lines.map((l, i) => (
                      <span key={`${l.from}-${i}-${l.text}`} className={`diff-line diff-${l.kind}`}>
                        <span className="diff-sign">{l.kind === 'add' ? '+' : l.kind === 'del' ? '−' : ' '}</span>
                        {l.text}
                        {'\n'}
                      </span>
                    ))}
                  </pre>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title={t('dash.panels.terminal')}
            className="dash-terminal"
            aside={
              <span className={`term-live${running || awaitingApproval ? ' is-on' : ''}`}>
                <i />
                {t('dash.live')}
              </span>
            }
          >
            <div className="term-body" role="log" aria-label={t('dash.panels.terminal')} aria-live="off">
              {events.length === 0 && (
                <p className="term-line term-idle">
                  <span className="term-prompt">$</span>
                  <span className="term-cursor" />
                </p>
              )}
              {events.map((ev, i) => (
                <p key={ev.id} className={`term-line term-${ev.kind} term-who-${ev.who}`}>
                  <time className="term-time">{fmtClock(DASH_AT[i])}</time>
                  <span className="term-who">{who(ev.who)}</span>
                  <span className="term-msg">
                    {ev.kind === 'cmd' && <span className="term-prompt">$ </span>}
                    {ev.kind === 'ok' && <span className="term-tick">✓ </span>}
                    {ev.kind === 'msg' && <span className="term-tick">→ </span>}
                    {ev.kind === 'ask' && <span className="term-tick">? </span>}
                    {t(`dash.log.${ev.id}`)}
                  </span>
                </p>
              ))}
              {events.length > 0 && (
                <p className="term-line term-idle">
                  <span className="term-prompt">$</span>
                  <span className="term-cursor" />
                </p>
              )}
            </div>
          </Panel>
        </div>

        <div className="dash-side">
          <Panel title={t('dash.panels.memory')} aside={<span className="mem-badge">{t('dash.memoryHint')}</span>}>
            <ul className="mem-rows">
              {memory.length === 0 && <li className="mem-empty">{t('dash.memoryEmpty')}</li>}
              {memory.map((m) => (
                <li key={m.id}>{t(`dash.memoryItems.${m.id}`)}</li>
              ))}
            </ul>
          </Panel>

          <Panel title={t('dash.panels.status')}>
            <dl className="state-rows">
              <div>
                <dt>{t('dash.state.files')}</dt>
                <dd>{filesChanged}</dd>
              </div>
              <div>
                <dt>{t('dash.state.tests')}</dt>
                <dd className={`is-${testsState.toLowerCase()}`}>{t(`dash.stateValue.tests${testsState}`)}</dd>
              </div>
              <div>
                <dt>{t('dash.state.review')}</dt>
                <dd className={`is-${reviewState.toLowerCase()}`}>{t(`dash.stateValue.review${reviewState}`)}</dd>
              </div>
              <div>
                <dt>{t('dash.state.permissions')}</dt>
                <dd className={`is-${permState.toLowerCase()}`}>{t(`dash.stateValue.perm${permState}`)}</dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>

      <div className="dash-foot">
        <span className="dash-progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress})` }} />
        </span>
        <figcaption>{t('dash.simNote')}</figcaption>
      </div>
    </figure>
  );
}
