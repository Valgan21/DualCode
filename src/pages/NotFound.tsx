import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { pagePath } from '../config/routes';

export default function NotFound() {
  const { lang, t } = useI18n();
  return (
    <section className="page-hero">
      <div className="container narrow">
        <p className="kicker">
          <span className="kicker-rule" aria-hidden="true" />
          404
        </p>
        <h1>{t('notFound.title')}</h1>
        <p className="lede">{t('notFound.body')}</p>
        <div className="cta-row">
          <Link className="btn btn-primary" to={pagePath(lang, 'home')}>
            {t('notFound.back')}
          </Link>
        </div>
      </div>
    </section>
  );
}
