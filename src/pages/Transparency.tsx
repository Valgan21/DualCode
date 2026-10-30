import { ContentSections, PageIntro } from '../components/ContentSections';
import { StatusBadge, type StatusKind } from '../components/ui';
import { FEATURES } from '../data/features';
import { useI18n } from '../lib/i18n';

interface LegendItem {
  status: StatusKind;
  body: string;
}

export default function Transparency() {
  const { t, raw } = useI18n();
  const legend = raw<LegendItem[]>('transparency.legend');
  return (
    <>
      <PageIntro ns="transparency" />

      <section className="section-tight" aria-labelledby="h-legend">
        <div className="container">
          <h2 id="h-legend">{t('transparency.legendTitle')}</h2>
          <dl className="legend">
            {legend.map((l) => (
              <div key={l.status}>
                <dt>
                  <StatusBadge kind={l.status} />
                </dt>
                <dd>{l.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-tight" aria-labelledby="h-features">
        <div className="container">
          <h2 id="h-features">{t('transparency.featuresTitle')}</h2>
          <p className="fine">{t('transparency.featuresNote')}</p>
          <ul className="feature-list">
            {FEATURES.map((f) => (
              <li key={f.id}>
                <div>
                  <h3>{t(`transparency.feature.${f.id}.name`)}</h3>
                  <p>{t(`transparency.feature.${f.id}.desc`)}</p>
                </div>
                <StatusBadge kind={f.status} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <ContentSections ns="transparency" />
        </div>
      </section>
    </>
  );
}
