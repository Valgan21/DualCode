import { StatusBadge, type StatusKind } from './ui';
import { useI18n } from '../lib/i18n';

export interface ContentSection {
  title: string;
  body: string;
  status?: StatusKind;
  items: string[];
}

export function ContentSections({ ns }: { ns: string }) {
  const { raw } = useI18n();
  const sections = raw<ContentSection[]>(`${ns}.sections`);
  return (
    <div className="prose-list">
      {sections.map((s, idx) => (
        <section key={s.title} className="prose-row" aria-labelledby={`${ns}-sec-${idx}`}>
          <div className="prose-head">
            <h2 id={`${ns}-sec-${idx}`}>{s.title}</h2>
            {s.status && <StatusBadge kind={s.status} />}
          </div>
          <div className="prose-body">
            <p>{s.body}</p>
            {s.items.length > 0 && (
              <ul className="bullets">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

export function PageIntro({ ns }: { ns: string }) {
  const { t } = useI18n();
  return (
    <section className="page-hero">
      <div className="container">
        <p className="kicker">
          <span className="kicker-rule" aria-hidden="true" />
          {t(`${ns}.kicker`)}
        </p>
        <h1>{t(`${ns}.title`)}</h1>
        <p className="lede">{t(`${ns}.subtitle`)}</p>
      </div>
    </section>
  );
}
