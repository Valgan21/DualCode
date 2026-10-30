import { PageIntro } from '../components/ContentSections';
import { DiscordCta } from '../components/ui';
import { siteConfig } from '../config/site';
import { useI18n } from '../lib/i18n';

interface Channel { name: string; desc: string }
interface Contribute { title: string; body: string }
interface Row { label: string; value: string }
interface Faq { q: string; a: string }

export default function Community() {
  const { t, list, raw } = useI18n();
  const channels = raw<Channel[]>('community.channels');
  const contribute = raw<Contribute[]>('community.contribute');
  const rows = raw<Row[]>('community.statusRows');
  const faq = raw<Faq[]>('community.faq');
  const hasLinks = Boolean(siteConfig.githubUrl);

  return (
    <>
      <PageIntro ns="community" />

      <section className="section" aria-labelledby="h-banner">
        <div className="container">
          <div className="banner">
            <div>
              <h2 id="h-banner">{t('community.bannerTitle')}</h2>
              <p className="lede">{t('community.bannerBody')}</p>
            </div>
            <DiscordCta />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="h-find">
        <div className="container two-col">
          <div>
            <h2 id="h-find">{t('community.findTitle')}</h2>
            <ul className="points">
              {list('community.find').map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t('community.channelsTitle')}</h2>
            <p className="fine">{t('community.channelsNote')}</p>
            <dl className="channels">
              {channels.map((c) => (
                <div key={c.name}>
                  <dt>{c.name}</dt>
                  <dd>{c.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="h-contribute">
        <div className="container">
          <h2 id="h-contribute">{t('community.contributeTitle')}</h2>
          <div className="trio">
            {contribute.map((c) => (
              <div key={c.title} className="trio-item">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="h-status">
        <div className="container two-col">
          <div>
            <h2 id="h-status">{t('community.statusTitle')}</h2>
            <dl className="status-table">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
            <p className="fine">{t('community.statusNote')}</p>
          </div>
          <div>
            <h2>{t('community.linksTitle')}</h2>
            <p className="fine">{t('community.linksNote')}</p>
            <ul className="points">
              <li>
                <DiscordCta className="link-arrow" />
              </li>
              {hasLinks && (
                <li>
                  <a className="link-arrow" href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer">
                    {t('footer.github')}
                    <span className="sr-only"> {t('a11y.external')}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="h-faq">
        <div className="container narrow">
          <h2 id="h-faq">{t('community.faqTitle')}</h2>
          {faq.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
