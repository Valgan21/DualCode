import { PageIntro } from '../components/ContentSections';
import { StatusBadge } from '../components/ui';
import { ROADMAP_STAGES } from '../data/roadmap';
import { useI18n } from '../lib/i18n';

export default function Roadmap() {
  const { t } = useI18n();

  return (
    <>
      <PageIntro ns="roadmap" />

      <section className="section-tight" aria-labelledby="roadmap-stages">
        <div className="container">
          <div className="section-head">
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('roadmap.stagesKicker')}
            </p>
            <h2 id="roadmap-stages">{t('roadmap.stagesTitle')}</h2>
            <p className="lede">{t('roadmap.stagesNote')}</p>
          </div>

          <ol className="roadmap-list">
            {ROADMAP_STAGES.map((stage, index) => (
              <li key={stage.id} className="roadmap-item">
                <div className="roadmap-marker" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="roadmap-copy">
                  <div className="roadmap-meta">
                    <p className="roadmap-label">{t('roadmap.stageLabel')}</p>
                    <StatusBadge kind={stage.status} />
                  </div>
                  <h3>{t(`roadmap.stage.${stage.id}.name`)}</h3>
                  <p>{t(`roadmap.stage.${stage.id}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="notice">{t('roadmap.noDates')}</p>
        </div>
      </section>
    </>
  );
}
