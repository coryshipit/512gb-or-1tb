/**
 * OSSelector — 操作系统选择（按钮组）
 * macOS / Windows / Linux
 * 选中态:品牌蓝实心填充
 * 来源:design-spec.md "细化配置区" + 高保真原型 S1
 */
import { systems } from '../data/systems';
import { i18n } from '../data/i18n';

export default function OSSelector({ lang, systemId, onChange }) {
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
        {t['config.os']}
      </p>
      <div className="flex flex-wrap gap-2">
        {systems.map((sys) => {
          const isSelected = sys.id === systemId;
          return (
            <button
              key={sys.id}
              type="button"
              onClick={() => onChange(sys.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                fontWeight: isSelected ? 600 : 500,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: isSelected
                  ? 'var(--storage-primary-action)'
                  : 'transparent',
                color: isSelected
                  ? 'var(--storage-white)'
                  : 'var(--storage-text-secondary)',
                border: isSelected
                  ? 'none'
                  : '1px solid var(--storage-border)',
              }}
            >
              {t[sys.nameKey]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
