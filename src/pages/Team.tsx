import { PageIntro } from '../components/ContentSections';
import { TEAM_HANDLES, TEAM_MARKS } from '../data/team';
import { useI18n } from '../lib/i18n';

export default function Team() {
  const { t } = useI18n();

  return (
    <>
      <PageIntro ns="team" />

      <section className="section-tight" aria-labelledby="team-members">
        <div className="container">
          <div className="section-head">
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('team.peopleKicker')}
            </p>
            <h2 id="team-members">{t('team.peopleTitle')}</h2>
            <p className="lede">{t('team.peopleNote')}</p>
          </div>

          <ul className="team-grid">
            {TEAM_HANDLES.map((handle, index) => (
              <li key={handle} className="team-card">
                <div className={`team-avatar team-avatar-${index + 1}`} aria-hidden="true">
                  {TEAM_MARKS[handle]}
                </div>
                <p className="team-handle">{handle}</p>
                <p className="team-placeholder">{t('team.profilePending')}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="team-agents">
        <div className="container two-col team-agents">
          <div>
            <p className="kicker">
              <span className="kicker-rule" aria-hidden="true" />
              {t('team.agentsKicker')}
            </p>
            <h2 id="team-agents">{t('team.agentsTitle')}</h2>
          </div>
          <div>
            <p className="lede">{t('team.agentsNote')}</p>
            <ul className="agent-list">
              <li><strong>Claude</strong><span>{t('team.claudeNote')}</span></li>
              <li><strong>Codex</strong><span>{t('team.codexNote')}</span></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
