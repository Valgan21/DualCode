import { ContentSections, PageIntro } from '../components/ContentSections';
import { useI18n } from '../lib/i18n';

interface FlowNode {
  name: string;
  desc: string;
}

export default function Technology() {
  const { t, raw } = useI18n();
  const flow = raw<FlowNode[]>('technology.flow');
  return (
    <>
      <PageIntro ns="technology" />

      <section className="section-tight" aria-labelledby="h-flow">
        <div className="container">
          <h2 id="h-flow">{t('technology.flowTitle')}</h2>
          <ol className="flow">
            {flow.map((n, i) => (
              <li key={n.name} className={i === 2 ? 'flow-agents' : undefined}>
                <span className="flow-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{n.name}</h3>
                <p>{n.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <ContentSections ns="technology" />
        </div>
      </section>
    </>
  );
}
