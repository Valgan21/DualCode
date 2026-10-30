import { PageIntro } from '../components/ContentSections';
import { StatusBadge, type StatusKind } from '../components/ui';
import { useI18n } from '../lib/i18n';

interface Capability {
  id: string;
  status: StatusKind;
}

interface FlowStep {
  id: string;
}

export default function Product() {
  const { t, raw } = useI18n();
  const capabilities = raw<Capability[]>('product.capabilities');
  const flow = raw<FlowStep[]>('product.flow');

  return (
    <>
      <PageIntro ns="product" />

      <section className="section-tight" aria-labelledby="product-capabilities">
        <div className="container">
          <div className="section-head">
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('product.capabilitiesKicker')}
            </p>
            <h2 id="product-capabilities">{t('product.capabilitiesTitle')}</h2>
            <p className="lede">{t('product.capabilitiesNote')}</p>
          </div>

          <div className="product-capability-grid">
            {capabilities.map((capability) => (
              <article key={capability.id} className="product-capability">
                <div className="product-capability-top">
                  <StatusBadge kind={capability.status} />
                </div>
                <h3>{t(`product.capability.${capability.id}.title`)}</h3>
                <p>{t(`product.capability.${capability.id}.body`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="product-flow">
        <div className="container product-flow-layout">
          <div className="section-head">
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('product.flowKicker')}
            </p>
            <h2 id="product-flow">{t('product.flowTitle')}</h2>
            <p className="lede">{t('product.flowNote')}</p>
          </div>
          <ol className="product-flow-list">
            {flow.map((step, index) => (
              <li key={step.id}>
                <span className="product-flow-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{t(`product.flowStep.${step.id}.title`)}</h3>
                  <p>{t(`product.flowStep.${step.id}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-tight" aria-labelledby="product-boundary">
        <div className="container product-boundary">
          <div>
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('product.boundaryKicker')}
            </p>
            <h2 id="product-boundary">{t('product.boundaryTitle')}</h2>
          </div>
          <p className="lede">{t('product.boundaryBody')}</p>
        </div>
      </section>
    </>
  );
}
