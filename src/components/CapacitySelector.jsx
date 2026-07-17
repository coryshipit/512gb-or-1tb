/**
 * CapacitySelector — 容量选择（S1 配置态）
 * 4 档:256GB / 512GB / 1TB / 2TB
 * 选中态:品牌蓝实心填充 + 白字
 * 推荐态:琥珀色边框 + ★标记（与选中态视觉明确区分）
 * 来源:design-spec.md "容量选择" + 高保真原型 S1
 */
import { CAPACITIES } from '../utils/calculateStorage';
import { i18n } from '../data/i18n';

const CAPACITY_LABELS = {
  256: '256GB',
  512: '512GB',
  1024: '1TB',
  2048: '2TB',
};

export default function CapacitySelector({
  lang,
  capacityGB,
  recommendedCapacity,
  onChange,
  showHint,
  exceedsAllTiers,
}) {
  const t = i18n[lang];
  // 溢出所有档位时，不展示任何推荐标记
  const isRecommended = (cap) =>
    !exceedsAllTiers && cap === recommendedCapacity && cap !== capacityGB;
  const isSelected = (cap) => cap === capacityGB;

  return (
    <div>
      {/* Section label */}
      <p
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--storage-text-primary)',
          margin: '0 0 var(--space-sm) 0',
        }}
      >
        {t['config.capacity']}
      </p>

      {/* Capacity buttons */}
      <div className="flex flex-wrap gap-2">
        {CAPACITIES.map((cap) => (
          <button
            key={cap}
            type="button"
            onClick={() => onChange(cap)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              padding: '6px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              fontWeight: isSelected(cap) ? 600 : 500,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              // 选中态:品牌蓝实心 + 白字
              ...(isSelected(cap)
                ? {
                    backgroundColor: 'var(--storage-primary-action)',
                    color: 'var(--storage-white)',
                    border: 'none',
                  }
                : // 推荐态:琥珀色边框 + 透明背景 + ★
                isRecommended(cap)
                ? {
                    backgroundColor: 'transparent',
                    color: 'var(--state-manageable)',
                    border: '1px solid var(--state-manageable)',
                  }
                : // 默认态:边框 + 灰色文字
                {
                    backgroundColor: 'transparent',
                    color: 'var(--storage-text-secondary)',
                    border: '1px solid var(--storage-border)',
                  }),
            }}
          >
            {CAPACITY_LABELS[cap]}
            {isRecommended(cap) && (
              <span style={{ fontSize: '0.75rem' }}>★</span>
            )}
          </button>
        ))}
      </div>

      {/* 内联提示:容量紧张时显示 */}
      {showHint && (
        <div
          style={{
            marginTop: 12,
            backgroundColor: exceedsAllTiers ? 'var(--state-critical-bg)' : 'var(--state-manageable-bg)',
            borderLeft: exceedsAllTiers ? '3px solid var(--state-critical)' : '3px solid var(--state-manageable)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
          }}
        >
          <p
            style={{
              fontSize: 'var(--font-size-caption)',
              color: exceedsAllTiers ? 'var(--state-critical)' : 'var(--state-manageable)',
              margin: 0,
            }}
          >
            {exceedsAllTiers ? t['result.hint.overflow'] : t['result.hint.larger']}
          </p>
        </div>
      )}
    </div>
  );
}
