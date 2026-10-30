import { PageIntro } from '../components/ContentSections';
import { DiscordCta, StatusBadge } from '../components/ui';
import { useI18n } from '../lib/i18n';

export default function Download() {
  const { t } = useI18n();

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
            <StatusBadge kind="planned" />
          </div>

          <div className="platform-list" aria-label={t('download.platformsTitle')}>
            <div><span>{t('download.platformsTitle')}</span><strong>{t('download.platformsValue')}</strong></div>
            <div><span>{t('download.earlyAccessTitle')}</span><strong>{t('download.earlyAccessValue')}</strong></div>
            <div><span>{t('download.releaseTitle')}</span><strong>{t('download.releaseValue')}</strong></div>
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
