import { PageIntro } from '../components/ContentSections';
import { DiscordCta, StatusBadge } from '../components/ui';
import { betaRelease } from '../config/site';
import { useI18n } from '../lib/i18n';

const SHOTS = ['beta4-welcome', 'beta4-folder', 'beta4-relaunch'];

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
    </svg>
  );
}

export default function Download() {
  const { t, list, raw } = useI18n();
  const meta = raw<string[][]>('download.betaMeta');
  const shots = raw<{ alt: string; caption: string }[]>('download.shots');

  return (
    <>
      <PageIntro ns="download" />

      <section className="section-tight" aria-labelledby="download-status">
        <div className="container">
          <div className="availability download-panel">
            <div>
              <p className="kicker">
                <span className="kicker-rule" aria-hidden="true" />
                {t('download.statusKicker')}
              </p>
              <h2 id="download-status">{t('download.statusTitle')}</h2>
              <p className="lede">{t('download.statusBody')}</p>
            </div>
            <StatusBadge kind="experimental" />
          </div>

          <div className="platform-list" aria-label={t('download.platformsTitle')}>
            <div><span>{t('download.platformsTitle')}</span><strong>{t('download.platformsValue')}</strong></div>
            <div><span>{t('download.earlyAccessTitle')}</span><strong>{t('download.earlyAccessValue')}</strong></div>
            <div><span>{t('download.releaseTitle')}</span><strong>{t('download.releaseValue')}</strong></div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="download-beta">
        <div className="container beta-grid">
          <div className="beta-main">
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('download.betaKicker')}
            </p>
            <h2 id="download-beta">{t('download.betaTitle')}</h2>
            <p className="lede">{t('download.betaBody')}</p>
            <div className="download-actions">
              <a className="btn btn-primary" href={betaRelease.downloadUrl} rel="noopener noreferrer">
                <DownloadIcon />
                <span>{t('download.betaButton')}</span>
              </a>
              <a className="btn btn-ghost" href={betaRelease.releasesUrl} target="_blank" rel="noopener noreferrer">
                <span>{t('download.betaAllReleases')}</span>
                <span className="sr-only"> {t('a11y.external')}</span>
              </a>
            </div>
            <p className="notice beta-warning">{t('download.betaWarning')}</p>
          </div>

          <div className="beta-details">
            <div className="platform-list" aria-label={t('download.betaMetaLabel')}>
              {meta.map(([label, value]) => (
                <div key={label}><span>{label}</span><strong>{value}</strong></div>
              ))}
            </div>
            <p className="beta-sha-label">{t('download.betaShaLabel')}</p>
            <code className="beta-sha" data-testid="beta-sha256">{betaRelease.sha256}</code>
            <p className="beta-verify">{t('download.betaVerify')}</p>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="download-notes">
        <div className="container beta-grid">
          <div>
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('download.notesKicker')}
            </p>
            <h2 id="download-notes">{t('download.notesTitle')}</h2>
          </div>
          <div>
            <ul className="bullets beta-notes">
              {list('download.notes').map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <h3 className="beta-limits-title">{t('download.limitsTitle')}</h3>
            <ul className="bullets beta-notes">
              {list('download.limits').map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="download-shots">
        <div className="container">
          <p className="kicker">
            <span className="kicker-rule" aria-hidden="true" />
            {t('download.shotsKicker')}
          </p>
          <h2 id="download-shots">{t('download.shotsTitle')}</h2>
          <div className="beta-shots">
            {SHOTS.map((name, i) => (
              <figure key={name}>
                <img src={`/beta/${name}.png`} alt={shots[i]?.alt ?? ''} width={1200} height={800} loading="lazy" decoding="async" />
                <figcaption>{shots[i]?.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="download-follow">
        <div className="container availability">
          <div>
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('download.followKicker')}
            </p>
            <h2 id="download-follow">{t('download.followTitle')}</h2>
          </div>
          <div>
            <p className="lede">{t('download.followBody')}</p>
            <div className="download-actions">
              <DiscordCta />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
