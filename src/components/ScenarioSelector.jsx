/**
 * ScenarioSelector — 使用场景选择（6 张卡片,多选）
 * 3×2 Bento 网格布局,支持多选
 * 每张卡片:Lucide 图标 + 场景名称 + 一句话定义
 * 来源:design-spec.md "场景选择卡片" + 高保真原型 S0
 */
import {
  Code2,
  Smartphone,
  Monitor,
  Palette,
  Gamepad2,
  Video,
  ArrowRight,
} from 'lucide-react';
import { scenarios } from '../data/scenarios';
import { i18n } from '../data/i18n';

// 场景 ID → Lucide 图标映射
const ICON_MAP = {
  web: Code2,
  mobile: Smartphone,
  desktop: Monitor,
  designer: Palette,
  gamedev: Gamepad2,
  content: Video,
};

export default function ScenarioSelector({
  lang,
  selectedScenarios,
  onToggleScenario,
  onConfirm,
}) {
  const t = i18n[lang];
  const anySelected = selectedScenarios.length > 0;

  return (
    <main
      className="mx-auto px-6"
      style={{
        maxWidth: 'var(--size-max-width)',
        paddingBottom: 'var(--space-2xl)',
      }}
    >
      {/* Section header */}
      <div>
        <h2
          className="storage-h2"
          style={{ margin: '0 0 var(--space-sm) 0' }}
        >
          {t['scenarios.sectionTitle']}
        </h2>
        <p
          style={{
            fontSize: 'var(--font-size-caption)',
            color: 'var(--storage-text-tertiary)',
            fontStyle: 'italic',
            margin: '0 0 20px 0',
          }}
        >
          {t['scenarios.multiSelectHint']}
        </p>
      </div>

      {/* 3×2 Bento grid */}
      <div
        className="grid grid-cols-1 gap-3
                  sm:grid-cols-2 md:grid-cols-3"
      >
        {scenarios.map((scenario) => {
          const isSelected = selectedScenarios.includes(scenario.id);
          const Icon = ICON_MAP[scenario.id];
          const name = t[scenario.nameKey] || scenario.id;
          const desc = t[scenario.descKey] || '';

          return (
            <div
              key={scenario.id}
              role="button"
              tabIndex={0}
              aria-label={t['scenarios.aria.select'].replace('{name}', name)}
              aria-pressed={isSelected}
              onClick={() => onToggleScenario(scenario.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleScenario(scenario.id);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '20px',
                backgroundColor: isSelected
                  ? 'rgba(37, 99, 235, 0.08)'
                  : 'var(--storage-bg-elevated)',
                border: isSelected
                  ? '2px solid var(--storage-primary-action)'
                  : '1px solid var(--storage-border)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
              }}
            >
              <Icon
                style={{
                  width: 24,
                  height: 24,
                  color: isSelected
                    ? 'var(--storage-primary)'
                    : 'var(--storage-text-secondary)',
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: 'var(--storage-text-primary)',
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    lineHeight: 1.4,
                    color: 'var(--storage-text-tertiary)',
                  }}
                >
                  {desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Button — full-width centered */}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <button
          type="button"
          onClick={() => anySelected && onConfirm()}
          disabled={!anySelected}
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            padding: '14px 32px',
            backgroundColor: anySelected
              ? 'var(--storage-primary-action)'
              : 'var(--storage-bg-surface)',
            color: anySelected
              ? 'var(--storage-white)'
              : 'var(--storage-text-tertiary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: anySelected
              ? 'none'
              : '1px solid var(--storage-border)',
            borderRadius: 'var(--radius-md)',
            cursor: anySelected ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.15s ease',
          }}
        >
          {t['hero.cta']}
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </main>
  );
}
