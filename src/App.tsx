import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { I18nProvider, detectLang, useI18n } from './lib/i18n';
import { useSeo } from './lib/seo';
import { NotFound, PAGES } from './pages';
import { isImplemented } from './config/implemented';
import { isLang, pageKeyFromSlug, pagePath, type Lang, type PageKey } from './config/routes';

function Screen({ lang, page }: { lang: Lang; page: PageKey | null }) {
  const { t } = useI18n();
  const known = page && isImplemented(page) ? page : null;
  const seoKey = known ?? 'notFound';
  useSeo({
    lang,
    page: known,
    title: t(`meta.${seoKey}.title`),
    description: t(`meta.${seoKey}.description`),
  });
  const Page = known ? PAGES[known] : NotFound;
  return (
    <Layout>
      <Page />
    </Layout>
  );
}

function LangRoute() {
  const params = useParams();
  const lang = params.lang;
  if (!isLang(lang)) {
    return (
      <I18nProvider lang={detectLang()}>
        <Screen lang={detectLang()} page={null} />
      </I18nProvider>
    );
  }
  const slug = (params['*'] ?? '').replace(/\/$/, '');
  const page = pageKeyFromSlug(lang, slug);
  return (
    <I18nProvider lang={lang}>
      <Screen lang={lang} page={page} />
    </I18nProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={pagePath(detectLang(), 'home')} replace />} />
      <Route path="/:lang/*" element={<LangRoute />} />
    </Routes>
  );
}
