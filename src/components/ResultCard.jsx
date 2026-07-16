/**
 * ResultCard — 结果卡片（仅 S3 结果态展示）
 * 内容:场景标注 + 总容量 + 占用数据 + 状态徽章 + 分段进度条 + 购买建议
 * 来源:design-spec.md "结果卡片" + 高保真原型 S3
 */
import { Check } from 'lucide-react';
import SpaceBar from './SpaceBar';
import { scenarios } from '../data/scenarios';
import { i18n } from '../data/i18n';

// 状态徽章样式映射
const STATUS_BADGE = {
  critical: { class: 'storage-badge-critical', token: '--state-critical' },
  manageable: { class: 'storage-badge-manageable', token: '--state-manageable' },
  comfortable: { class: 'storage-badge-comfortable', token: '--state-comfortable' },
  abundant: { class: 'storage-badge-abundant', token: '--state-abundant' },
};

// 容量显示格式
const CAPACITY_LABELS = {
  256: '256GB',
  512: '512GB',
  1024: '1TB',
  2048: '2TB',
};

// 根据状态生成购买建议文案
function getAdvice(t, status, capacityGB, recommendedCapacity) {
  const capLabel = CAPACITY_LABELS[capacityGB] || `${capacityGB}GB`;
  const recLabel = CAPACITY_LABELS[recommendedCapacity] || '';

  const isRecommended = capacityGB === recommendedCapacity;

  const replace = (s) => s.replace('{cap}', capLabel).replace('{rec}', recLabel);

  switch (status) {
    case 'abundant':
      return isRecommended
        ? replace(t['result.advice.abundant.recommended'])
        : replace(t['result.advice.abundant.other']);
    case 'comfortable':
      return replace(t['result.advice.comfortable']);
    case 'manageable':
      return recLabel && recommendedCapacity > capacityGB
        ? replace(t['result.advice.manageable.upgrade'])
        : replace(t['result.advice.manageable.other']);
    case 'critical':
      return recLabel
        ? replace(t['result.advice.critical.recommend'])
        : replace(t['result.advice.critical.other']);
    default:
      return '';
  }
}

export default function ResultCard({
  lang,
  calculation,
  selectedScenarios,
  capacityGB,
}) {
  const t = i18n[lang];
  const { status, remaining, remainingRatio, recommendedCapacity, breakdown } = calculation;

  const badge = STATUS_BADGE[status];
  const isRecommendedCapacity = capacityGB === recommendedCapacity;
  const advice = getAdvice(t, status, capacityGB, recommendedCapacity);

  // 场景标注
  const scenarioLabels = selectedScenarios
    .map((id) => {
      const scenario = scenarios.find((s) => s.id === id);
      return scenario ? t[scenario.nameKey] : id;
    })
    .join('、');

  return (
    <div
      className="storage-card"
    >
      {/* 场景标注 */}
      <p
        style={{
          fontSize: 'var(--font-size-caption)',
          color: 'var(--storage-text-tertiary)',
          margin: '0 0 12px 0',
        }}
      >
        {t['result.scenario']}：{scenarioLabels}
      </p>

      {/* 推荐容量提示条(仅当用户选择了推荐容量时显示) */}
      {isRecommendedCapacity && (
        <div
          className="flex items-center gap-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            backgroundColor: 'var(--state-abundant-bg)',
            border: `1px solid var(--state-abundant-border)`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: 20,
          }}
        >
          <Check
            style={{
              width: 16,
              height: 16,
              color: 'var(--state-abundant)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--state-abundant)',
            }}
          >
            {t['result.recommended']} {CAPACITY_LABELS[recommendedCapacity]} ★
          </span>
        </div>
      )}

      {/* 总容量大数字 */}
      <div>
        <p
          className="storage-caption"
          style={{ margin: 0 }}
        >
          {t['result.totalCapacity']}
        </p>
        <p
          className="storage-mono-lg"
          style={{ margin: '4px 0 0 0' }}
        >
          {CAPACITY_LABELS[capacityGB] || `${capacityGB}GB`}
        </p>
      </div>

      {/* 占用数据 */}
      <div
        className="flex flex-col"
        style={{
          marginTop: 'var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}
      >
        <div className="flex justify-between items-center">
          <span className="storage-body">{t['result.totalUsed']}</span>
          <span
            className="storage-mono"
            style={{ color: 'var(--storage-text-primary)' }}
          >
            {calculation.totalUsed}GB
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="storage-body">{t['result.remaining']}</span>
          <span
            className="storage-mono"
            style={{ color: `var(${badge.token})` }}
          >
            {Math.max(remaining, 0)}GB
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="storage-body">{t['result.remainingRatio']}</span>
          <span
            className="storage-mono"
            style={{ color: `var(${badge.token})` }}
          >
            {remainingRatio >= 0 ? `${Math.round(remainingRatio * 100)}%` : '0%'}
          </span>
        </div>
      </div>

      {/* 状态徽章 */}
      <div style={{ marginTop: 12 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 10px',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--font-size-caption)',
            fontWeight: 600,
            borderRadius: 'var(--radius-full)',
            backgroundColor: `var(--${badge.class.replace('storage-badge-', 'state-')}-bg)`,
            color: `var(${badge.token})`,
          }}
        >
          {t[`status.${status}`]}
        </span>
      </div>

      {/* 分段进度条 */}
      <SpaceBar lang={lang} calculation={calculation} />

      {/* 购买建议 */}
      <div style={{ marginTop: 'var(--space-md)' }}>
        <p
          className="storage-body"
          style={{ margin: 0, color: 'var(--storage-text-primary)' }}
        >
          {advice}
        </p>
      </div>
    </div>
  );
}
