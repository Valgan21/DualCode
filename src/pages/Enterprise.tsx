import { PageIntro } from '../components/ContentSections';
import { StatusBadge, type StatusKind } from '../components/ui';
import { useI18n } from '../lib/i18n';

interface VisionCard {
  id: string;
  status: StatusKind;
}

export default function Enterprise() {
  const { t, raw } = useI18n();
  const cards = raw<VisionCard[]>('enterprise.cards');

  return (
    <>
      <PageIntro ns="enterprise" />

      <section className="section-tight" aria-labelledby="enterprise-vision">
        <div className="container">
          <div className="section-head">
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('enterprise.visionKicker')}
            </p>
            <h2 id="enterprise-vision">{t('enterprise.visionTitle')}</h2>
            <p className="lede">{t('enterprise.visionNote')}</p>
          </div>
          <div className="vision-grid">
            {cards.map((card) => (
              <article key={card.id} className={`vision-card vision-${card.id}`}>
                <div className="vision-card-top">
                  <span className="vision-index" aria-hidden="true">{card.id === 'individual' ? '01' : card.id === 'teams' ? '02' : '03'}</span>
                  <StatusBadge kind={card.status} />
                </div>
                <h3>{t(`enterprise.card.${card.id}.title`)}</h3>
                <p>{t(`enterprise.card.${card.id}.body`)}</p>
                <ul className="bullets">
                  {raw<string[]>(`enterprise.card.${card.id}.items`).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="enterprise-boundary">
        <div className="container availability">
          <div>
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('enterprise.boundaryKicker')}
            </p>
            <h2 id="enterprise-boundary">{t('enterprise.boundaryTitle')}</h2>
          </div>
          <div>
            <p className="lede">{t('enterprise.boundaryBody')}</p>
            <p className="notice">{t('enterprise.boundaryNote')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
