import { PageIntro } from '../components/ContentSections';
import { DiscordCta, PageLink } from '../components/ui';
import { useI18n } from '../lib/i18n';
import { siteConfig } from '../config/site';

export default function Contact() {
  const { t } = useI18n();
  return (
    <>
      <PageIntro ns="contact" />
      <section className="section-tight" aria-labelledby="h-channels">
        <div className="container narrow">
          <h2 id="h-channels">{t('contact.channelsTitle')}</h2>
          <ul className="channel-list">
            <li className="channel">
              <div>
                <h3>{t('contact.emailLabel')}</h3>
                {!siteConfig.contactEmail && <p>{t('contact.emailPending')}</p>}
              </div>
              {siteConfig.contactEmail && (
                <a className="btn btn-ghost" href={`mailto:${siteConfig.contactEmail}`}>
                  {t('contact.emailOpen')}
                </a>
              )}
            </li>
            <li className="channel">
              <div>
                <h3>{t('contact.discordLabel')}</h3>
                <p>{t('contact.discordNote')}</p>
              </div>
              <DiscordCta />
            </li>
            <li className="channel">
              <div>
                <h3>{t('contact.githubLabel')}</h3>
                {!siteConfig.githubUrl && <p>{t('contact.githubPending')}</p>}
              </div>
              {siteConfig.githubUrl && (
                <a className="btn btn-ghost" href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer">
                  {t('contact.githubOpen')}
                  <span className="sr-only"> {t('a11y.external')}</span>
                </a>
              )}
            </li>
          </ul>
          <p className="fine">{t('contact.noForm')}</p>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="h-security">
        <div className="container narrow contact-notes">
          <div>
            <h2 id="h-security">{t('contact.securityTitle')}</h2>
            <p className="prose-body">{t('contact.securityBody')}</p>
          </div>
          <div>
            <h2 id="h-enterprise-interest">{t('contact.enterpriseTitle')}</h2>
            <p className="prose-body">{t('contact.enterpriseBody')}</p>
            <PageLink to="enterprise" className="link-arrow">
              {t('nav.enterprise')}
            </PageLink>
          </div>
        </div>
      </section>
    </>
  );
}
