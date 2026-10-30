import { PageIntro } from '../components/ContentSections';
import { PageLink } from '../components/ui';
import { useI18n } from '../lib/i18n';

interface FaqItem {
  q: string;
  a: string;
}

export default function Faq() {
  const { t, raw } = useI18n();
  const items = raw<FaqItem[]>('faq.items');
  return (
    <>
      <PageIntro ns="faq" />
      <section className="section-tight">
        <div className="container narrow">
          <div className="faq-list">
            {items.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="h-faq-more">
        <div className="container narrow">
          <h2 id="h-faq-more">{t('faq.moreTitle')}</h2>
          <p className="lede">{t('faq.moreBody')}</p>
          <div className="cta-row">
            <PageLink to="transparency" className="btn btn-ghost">
              {t('nav.transparency')}
            </PageLink>
            <PageLink to="contact" className="btn btn-ghost">
              {t('nav.contact')}
            </PageLink>
          </div>
        </div>
      </section>
    </>
  );
}
