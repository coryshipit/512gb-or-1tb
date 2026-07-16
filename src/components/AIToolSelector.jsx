/**
 * AIToolSelector — 智能体选择（多选）
 * Cursor / ChatGPT / GitHub Copilot / Claude Code
 * 来源:design-spec.md "细化配置区" + 高保真原型 S1
 */
import { aiTools } from '../data/aiTools';
import { i18n } from '../data/i18n';

export default function AIToolSelector({ lang, selectedAITools, onToggle }) {
  const t = i18n[lang];

  return (
    <div>
      <p
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--storage-text-primary)',
          margin: '0 0 var(--space-sm) 0',
        }}
      >
        {t['config.aiTools']}
      </p>

      <div
        className="flex flex-wrap"
        style={{ gap: '6px 16px' }}
      >
        {aiTools.map((tool) => {
          const isChecked = selectedAITools.includes(tool.id);
          return (
            <label
              key={tool.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                color: 'var(--storage-text-primary)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(tool.id)}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: 'var(--storage-primary-action)',
                }}
              />
              {t[tool.nameKey] || tool.id}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--storage-text-tertiary)',
                }}
              >
                [{tool.sizeGB}GB]
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
