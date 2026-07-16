/**
 * SpaceBar — 分段进度条（8 段）
 * 7 段已用(操作系统/开发工具/智能体/目标平台/运行环境/项目文件/冗余)各有独立颜色
 * 1 段剩余为底色透出(transparent)
 * 来源:design-spec.md "分段进度条" + 高保真原型 S3
 */
import { i18n } from '../data/i18n';

// 8 段定义:颜色 token + 对应 breakdown 字段
const SEGMENTS = [
  { key: 'system', segToken: '--storage-seg-system', labelKey: 'result.breakdown.system' },
  { key: 'tools', segToken: '--storage-seg-tools', labelKey: 'result.breakdown.tools' },
  { key: 'aiTools', segToken: '--storage-seg-ai', labelKey: 'result.breakdown.aiTools' },
  { key: 'platforms', segToken: '--storage-seg-platform', labelKey: 'result.breakdown.platforms' },
  { key: 'environments', segToken: '--storage-seg-env', labelKey: 'result.breakdown.environments' },
  { key: 'projects', segToken: '--storage-seg-project', labelKey: 'result.breakdown.projects' },
  { key: 'redundant', segToken: '--storage-seg-redundant', labelKey: 'result.breakdown.redundant' },
];

export default function SpaceBar({ lang, calculation }) {
  const t = i18n[lang];
  const { breakdown, remaining, totalUsed } = calculation;
  // 总容量 = 已用 + 剩余(剩余可能为负,但计算宽度时取 max)
  const total = totalUsed + Math.max(remaining, 0);

  // 计算每段宽度百分比
  const getPercent = (value) => {
    if (total <= 0) return 0;
    return (value / total) * 100;
  };

  return (
    <div style={{ marginTop: 'var(--space-md)' }}>
      {/* Segmented bar */}
      <div
        style={{
          display: 'flex',
          height: 'var(--size-progress-bar-result)',
          backgroundColor: 'var(--storage-bg-overlay)',
          borderRadius: 'var(--size-progress-bar-radius)',
          overflow: 'hidden',
        }}
      >
        {SEGMENTS.map((seg) => {
          const value = breakdown[seg.key] || 0;
          const pct = getPercent(value);
          if (pct <= 0) return null;
          return (
            <div
              key={seg.key}
              title={`${t[seg.labelKey]} ${value}GB`}
              style={{
                flex: `0 0 ${pct}%`,
                minWidth: value > 0 ? '2px' : 0,
                backgroundColor: `var(${seg.segToken})`,
              }}
            />
          );
        })}
        {/* 剩余段:transparent,底色透出 */}
        {remaining > 0 && (
          <div
            title={`${t['result.remaining']} ${remaining}GB`}
            style={{
              flex: `0 0 ${getPercent(remaining)}%`,
              minWidth: '2px',
              backgroundColor: 'var(--storage-seg-remaining)',
            }}
          />
        )}
      </div>

      {/* Legend — 2 column grid */}
      <div
        className="grid"
        style={{
          marginTop: 12,
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4px 16px',
        }}
      >
        {SEGMENTS.map((seg) => (
          <div
            key={seg.key}
            className="flex items-center gap-2"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: `var(${seg.segToken})`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 'var(--font-size-caption)',
                color: 'var(--storage-text-secondary)',
                flex: 1,
              }}
            >
              {t[seg.labelKey]}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--font-size-caption)',
                color: 'var(--storage-text-primary)',
              }}
            >
              {breakdown[seg.key] || 0}GB
            </span>
          </div>
        ))}
        {/* 剩余 legend */}
        <div
          className="flex items-center gap-2"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--storage-bg-overlay)',
              border: '1px solid var(--storage-border)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--storage-text-secondary)',
              flex: 1,
            }}
          >
            {t['result.remaining']}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--font-size-caption)',
              color: 'var(--storage-text-primary)',
            }}
          >
            {Math.max(remaining, 0)}GB
          </span>
        </div>
      </div>
    </div>
  );
}
