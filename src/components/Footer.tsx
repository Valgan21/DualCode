import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { DiscordCta, StatusBadge } from './ui';
import { useI18n } from '../lib/i18n';
import { pagePath, type PageKey } from '../config/routes';
import { siteConfig } from '../config/site';
import { isImplemented } from '../config/implemented';

const GROUPS: { title: string; keys: PageKey[] }[] = [
  { title: 'footer.product', keys: ['product', 'technology', 'preview', 'download'] },
  { title: 'footer.project', keys: ['roadmap', 'team', 'enterprise', 'community'] },
  { title: 'footer.trust', keys: ['privacy', 'transparency', 'faq', 'contact'] },
];

export function Footer() {
  const { lang, t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to={pagePath(lang, 'home')} aria-label={t('a11y.home')} className="footer-logo">
            <Logo />
          </Link>
          <p className="tagline">{t('meta.tagline')}</p>
          <p>{t('footer.blurb')}</p>
          <StatusBadge kind="inDevelopment" />
        </div>

        {GROUPS.map((g) => {
          const keys = g.keys.filter((k) => isImplemented(k));
          if (!keys.length) return null;
          return (
            <nav key={g.title} aria-label={t(g.title)}>
              <h2 className="footer-title">{t(g.title)}</h2>
              <ul>
                {keys.map((k) => (
                  <li key={k}>
                    <Link to={pagePath(lang, k)}>{t(`nav.${k}`)}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}

        <div className="footer-join">
          <h2 className="footer-title">{t('footer.follow')}</h2>
          <p>{t('footer.followBody')}</p>
          <DiscordCta />
          <ul className="footer-links">
            {siteConfig.githubUrl && (
              <li>
                <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer">
                  {t('footer.github')}
                  <span className="sr-only"> {t('a11y.external')}</span>
                </a>
              </li>
            )}
            {siteConfig.contactEmail && (
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`}>{t('footer.contactMail')}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container footer-base">
        <p>{t('footer.rights')}</p>
        <p>{t('footer.statusLine')}</p>
        <p>{t('footer.noTracking')}</p>
      </div>
    </footer>
  );
}
