import { useState } from 'react';
import { PageIntro } from '../components/ContentSections';
import { StatusBadge } from '../components/ui';
import { useI18n } from '../lib/i18n';

type AgentId = 'claude' | 'codex';
type TaskId = 'refactor' | 'review' | 'context';

interface PreviewTask {
  id: TaskId;
  label: string;
}

interface PreviewAgent {
  name: string;
  role: string;
  line: string;
  color: 'claude' | 'codex';
}

const AGENTS: AgentId[] = ['claude', 'codex'];

export default function Preview() {
  const { t, raw } = useI18n();
  const tasks = raw<PreviewTask[]>('preview.tasks');
  const agents = raw<Record<AgentId, PreviewAgent>>('preview.agents');
  const [selectedAgent, setSelectedAgent] = useState<AgentId>('claude');
  const [selectedTask, setSelectedTask] = useState<TaskId>('refactor');
  const [memoryOpen, setMemoryOpen] = useState(false);
  const agent = agents[selectedAgent];

  return (
    <>
      <PageIntro ns="preview" />

      <section className="section-tight" aria-labelledby="preview-workspace">
        <div className="container">
          <div className="preview-label-row">
            <StatusBadge kind="concept" />
            <p>{t('preview.labelNote')}</p>
          </div>

          <div className="preview-shell">
            <header className="preview-toolbar">
              <div>
                <p className="preview-product-name">dualcode / session.ts</p>
                <h2 id="preview-workspace">{t('preview.workspaceTitle')}</h2>
              </div>
              <div className="agent-switch" role="group" aria-label={t('preview.agentSwitchLabel')}>
                {AGENTS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`agent-tab agent-tab-${id}${selectedAgent === id ? ' is-active' : ''}`}
                    aria-pressed={selectedAgent === id}
                    onClick={() => setSelectedAgent(id)}
                  >
                    {agents[id].name}
                  </button>
                ))}
              </div>
            </header>

            <div className="preview-layout">
              <aside className="preview-tasks" aria-labelledby="preview-task-list">
                <p className="preview-panel-label" id="preview-task-list">{t('preview.tasksTitle')}</p>
                <div className="preview-task-buttons">
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      className={`preview-task${selectedTask === task.id ? ' is-selected' : ''}`}
                      aria-pressed={selectedTask === task.id}
                      onClick={() => setSelectedTask(task.id)}
                    >
                      <span className="task-dot" aria-hidden="true" />
                      {task.label}
                    </button>
                  ))}
                </div>
                <p className="preview-scripted-note">{t('preview.scriptedNote')}</p>
              </aside>

              <div className="preview-code-panel">
                <div className="preview-panel-bar">
                  <span>{t('preview.codeLabel')}</span>
                  <span className="preview-file-state">{t('preview.fileState')}</span>
                </div>
                <pre className="preview-code"><code>{t(`preview.code.${selectedTask}`)}</code></pre>
                <div className="preview-task-summary">
                  <p className="preview-panel-label">{t('preview.selectedTaskLabel')}</p>
                  <h3>{t(`preview.taskDetails.${selectedTask}.title`)}</h3>
                  <p>{t(`preview.taskDetails.${selectedTask}.body`)}</p>
                </div>
              </div>

              <aside className="preview-inspector" aria-label={t('preview.inspectorLabel')}>
                <div className={`preview-agent-card preview-agent-${agent.color}`}>
                  <div className="preview-agent-heading">
                    <span className="agent-signal" aria-hidden="true" />
                    <strong>{agent.name}</strong>
                  </div>
                  <p>{agent.role}</p>
                  <blockquote>{agent.line}</blockquote>
                </div>

                <div className="preview-memory-card">
                  <div className="preview-memory-heading">
                    <span className="preview-panel-label">{t('preview.memoryTitle')}</span>
                    <span className="memory-pulse" aria-hidden="true" />
                  </div>
                  <p>{t('preview.memoryBody')}</p>
                  <button
                    type="button"
                    className="memory-toggle"
                    aria-expanded={memoryOpen}
                    aria-controls="preview-memory-details"
                    onClick={() => setMemoryOpen((open) => !open)}
                  >
                    {memoryOpen ? t('preview.memoryClose') : t('preview.memoryOpen')}
                  </button>
                  {memoryOpen && (
                    <ul id="preview-memory-details" className="memory-nodes">
                      {t('preview.memoryItems').split('|').map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
