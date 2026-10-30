import { ContentSections, PageIntro } from '../components/ContentSections';
import { PageLink } from '../components/ui';
import { useI18n } from '../lib/i18n';

export default function Privacy() {
  const { t, list } = useI18n();
  return (
    <>
      <PageIntro ns="privacy" />
      <section className="section-tight">
        <div className="container">
          <ContentSections ns="privacy" />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="h-site">
        <div className="container narrow">
          <h2 id="h-site">{t('privacy.siteTitle')}</h2>
          <ul className="points">
            {list('privacy.siteItems').map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <p className="caveat">{t('privacy.limits')}</p>
          <PageLink to="transparency" className="link-arrow">
            {t('nav.transparency')}
          </PageLink>
        </div>
      </section>
    </>
  );
}
