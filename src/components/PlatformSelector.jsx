/**
 * PlatformSelector — 目标发布平台选择（多选）
 * Web(0GB) / Windows / macOS / Linux / iOS / Android / 微信小程序
 * 来源:design-spec.md "细化配置区" + 高保真原型 S1
 */
import { platforms } from '../data/platforms';
import { i18n } from '../data/i18n';

export default function PlatformSelector({ lang, selectedPlatforms, onToggle }) {
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
        {t['config.platforms']}
      </p>

      <div
        className="flex flex-wrap"
        style={{ gap: '6px 16px' }}
      >
        {platforms.map((plat) => {
          const isChecked = selectedPlatforms.includes(plat.id);
          return (
            <label
              key={plat.id}
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
                onChange={() => onToggle(plat.id)}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: 'var(--storage-primary-action)',
                }}
              />
              {t[plat.nameKey] || plat.id}
              {plat.sizeGB > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--storage-text-tertiary)',
                  }}
                >
                  [{plat.sizeGB}GB]
                </span>
              )}
              {plat.sizeGB === 0 && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--storage-text-tertiary)',
                  }}
                >
                  [{t['platforms.builtIn']}]
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
