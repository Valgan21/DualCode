import { LiveDashboard } from '../components/LiveDashboard';
import { DiscordCta, PageLink, SectionHead, StatusBadge, type StatusKind } from '../components/ui';
import { TEAM_HANDLES, TEAM_MARKS } from '../data/team';
import { useI18n } from '../lib/i18n';
import type { PageKey } from '../config/routes';

type Pillar = { id: string; title: string; body: string; status: StatusKind; to: PageKey; cta: string };
type Highlight = { label: string; value: string };

function Strip({ section, to, cta }: { section: 'privacy' | 'quantum' | 'roadmap'; to: PageKey; cta: string }) {
  const { t } = useI18n();
  return (
    <section className="section strip" aria-labelledby={`h-${section}`}>
      <div className="container strip-grid">
        <p className="kicker">
          <span className="kicker-rule" aria-hidden="true" />
          {t(`home.${section}.kicker`)}
        </p>
        <div>
          <h2 id={`h-${section}`}>{t(`home.${section}.title`)}</h2>
          <p className="lede">{t(`home.${section}.body`)}</p>
          {section === 'privacy' && <p className="caveat">{t('home.privacy.caveat')}</p>}
          <PageLink to={to} className="link-arrow">
            {cta}
          </PageLink>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t, list, raw } = useI18n();
  const titleLines = t('home.title').split(/(?<=\.)\s+/);
  const pillars = raw<Pillar[]>('home.pillars.items');
  const highlights = raw<Highlight[]>('home.highlights');

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <StatusBadge kind="inDevelopment" />
            <h1>
              {titleLines.map((line) => (
                <span key={line} className="h1-line">
                  {line}
                </span>
              ))}
            </h1>
            <p className="hero-sub">{t('home.subtitle')}</p>
            <div className="cta-row">
              <PageLink to="download" className="btn btn-primary">
                {t('home.ctaDownload')}
              </PageLink>
              <a className="btn btn-ghost" href="#live-workspace">
                {t('home.ctaDashboard')}
              </a>
              <DiscordCta />
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-emblem"
              src="/brand/dualcode-logo.webp"
              width={1000}
              height={506}
              alt={t('home.agents.emblemAlt')}
              fetchPriority="high"
              decoding="async"
            />
            <ul className="hero-chips" aria-hidden="true">
              <li className="hero-chip hero-chip-claude">{t('home.agents.claude')}</li>
              <li className="hero-chip hero-chip-codex">{t('home.agents.codex')}</li>
            </ul>
          </div>
        </div>
        <dl className="container hero-highlights">
          {highlights.map((h) => (
            <div key={h.label}>
              <dt>{h.label}</dt>
              <dd>{h.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="live-workspace" className="section dash-section" aria-labelledby="h-dash">
        <div className="container">
          <div className="dash-intro">
            <SectionHead id="h-dash" kicker={t('dash.kicker')} title={t('dash.title')} body={t('dash.body')} />
            <PageLink to="preview" className="btn btn-ghost">
              {t('dash.cta')}
            </PageLink>
          </div>
          <div className="dash-wrap">
            <LiveDashboard />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="h-why">
        <div className="container why-grid">
          <SectionHead id="h-why" kicker={t('home.why.kicker')} title={t('home.why.title')} body={t('home.why.body')} />
          <div className="why-side">
            <ul className="points">
              {list('home.why.points').map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="conviction">{t('home.why.belief')}</p>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="h-agents">
        <div className="container">
          <SectionHead id="h-agents" kicker={t('home.agents.kicker')} title={t('home.agents.title')} body={t('home.agents.body')} />
          <div className="trio">
            <div className="trio-item trio-claude">
              <h3>{t('home.agents.claude')}</h3>
              <p>{t('home.agents.claudeRole')}</p>
            </div>
            <div className="trio-item trio-codex">
              <h3>{t('home.agents.codex')}</h3>
              <p>{t('home.agents.codexRole')}</p>
            </div>
            <div className="trio-item trio-you">
              <h3>{t('home.agents.you')}</h3>
              <p>{t('home.agents.youRole')}</p>
            </div>
          </div>
          <p className="fine">{t('home.agents.note')}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="h-pillars">
        <div className="container">
          <SectionHead id="h-pillars" kicker={t('home.pillars.kicker')} title={t('home.pillars.title')} body={t('home.pillars.body')} />
          <ul className="pillar-list">
            {pillars.map((p) => (
              <li key={p.id} className="pillar">
                <span className="pillar-mark" aria-hidden="true" />
                <div className="pillar-main">
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
                <div className="pillar-meta">
                  <StatusBadge kind={p.status} />
                  <PageLink to={p.to} className="link-arrow">
                    {p.cta}
                  </PageLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Strip section="privacy" to="privacy" cta={t('home.privacy.cta')} />
      <Strip section="quantum" to="technology" cta={t('home.quantum.cta')} />
      <Strip section="roadmap" to="roadmap" cta={t('home.roadmap.cta')} />

      <section className="section section-alt" aria-labelledby="h-team">
        <div className="container">
          <SectionHead id="h-team" kicker={t('home.team.kicker')} title={t('home.team.title')} body={t('home.team.body')} />
          <ul className="handle-row">
            {TEAM_HANDLES.map((h, i) => (
              <li key={h}>
                <span className={`team-avatar team-avatar-${i + 1}`} aria-hidden="true">
                  {TEAM_MARKS[h]}
                </span>
                <span className="team-handle">{h}</span>
              </li>
            ))}
          </ul>
          <PageLink to="team" className="link-arrow">
            {t('home.team.cta')}
          </PageLink>
        </div>
      </section>

      <section className="section community-band" aria-labelledby="h-community">
        <div className="container center">
          <SectionHead id="h-community" kicker={t('home.community.kicker')} title={t('home.community.title')} body={t('home.community.body')} />
          <div className="cta-row cta-center">
            <DiscordCta />
            <PageLink to="community" className="btn btn-ghost">
              {t('home.community.cta')}
            </PageLink>
          </div>
        </div>
      </section>

      <section className="section final" aria-labelledby="h-final">
        <div className="container center">
          <h2 id="h-final">{t('home.final.title')}</h2>
          <p className="lede">{t('home.final.body')}</p>
        </div>
      </section>
    </>
  );
}
