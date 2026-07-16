/**
 * EnvironmentSelector — 本地运行环境选择（多选）
 * Docker / Windows VM / Linux VM / Dual Boot Reserve
 * 带引导文字:"以下为可选配置。如果你不确定是否需要，通常可以跳过。"
 * 来源:design-spec.md "细化配置区" + "运行环境说明" + 高保真原型 S1
 */
import { environments } from '../data/environments';
import { i18n } from '../data/i18n';

export default function EnvironmentSelector({ lang, selectedEnvironments, onToggle }) {
  const t = i18n[lang];

  return (
    <div>
      <p
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--storage-text-primary)',
          margin: '0 0 4px 0',
        }}
      >
        {t['config.environments']}
      </p>
      <p
        style={{
          fontSize: 'var(--font-size-caption)',
          color: 'var(--storage-text-tertiary)',
          fontStyle: 'italic',
          margin: '0 0 12px 0',
        }}
      >
        {t['config.environments.hint']}
      </p>

      <div
        className="flex flex-wrap"
        style={{ gap: '6px 16px' }}
      >
        {environments.map((env) => {
          const isChecked = selectedEnvironments.includes(env.id);
          return (
            <label
              key={env.id}
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
                onChange={() => onToggle(env.id)}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: 'var(--storage-primary-action)',
                }}
              />
              {t[env.nameKey] || env.id}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--storage-text-tertiary)',
                }}
              >
                [{env.sizeGB}GB]
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
