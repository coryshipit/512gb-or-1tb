/**
 * CollapsedScenarioModule — S1/S3 收缩场景模块
 * 显示已选场景标签 + "修改"按钮
 * 修改按钮点击后展开场景网格(S0 的 ScenarioSelector)
 * 来源:design-spec.md "收缩场景模块" + 高保真原型 S1
 */
import { Check, Settings2 } from 'lucide-react';
import { scenarios } from '../data/scenarios';
import { i18n } from '../data/i18n';

export default function CollapsedScenarioModule({ lang, selectedScenarios, onEdit }) {
  const t = i18n[lang];

  return (
    <div
      className="storage-card"
      style={{ marginBottom: 'var(--space-lg)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--storage-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t['scenarios.selectedLabel']}
          </span>
          {selectedScenarios.map((id) => {
            const scenario = scenarios.find((s) => s.id === id);
            const name = scenario ? (t[scenario.nameKey] || id) : id;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-caption)',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--storage-primary)',
                  color: 'var(--storage-primary)',
                  backgroundColor: 'var(--storage-primary-subtle)',
                }}
              >
                <Check style={{ width: 12, height: 12 }} />
                {name}
              </span>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onEdit}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--font-size-caption)',
            fontWeight: 500,
            backgroundColor: 'transparent',
            color: 'var(--storage-text-primary)',
            border: '1px solid var(--storage-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
          }}
        >
          <Settings2 style={{ width: 14, height: 14 }} />
          {t['action.modifyScenario']}
        </button>
      </div>
    </div>
  );
}
