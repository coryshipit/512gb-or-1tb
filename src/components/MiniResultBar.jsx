/**
 * MiniResultBar — non-sticky 迷你结果条（S1 配置态）
 * 位置:Header 下方、场景模块之前
 * 内容:进度条 + 百分比,状态色随剩余空间变化
 * 来源:design-spec.md "迷你结果条" + 高保真原型 S1
 */
import { HardDrive } from 'lucide-react';
import { calculateStorage } from '../utils/calculateStorage';

// 状态色映射
const STATUS_COLORS = {
  critical: 'var(--state-critical)',
  manageable: 'var(--state-manageable)',
  comfortable: 'var(--state-comfortable)',
  abundant: 'var(--state-abundant)',
};

export default function MiniResultBar({ calculation }) {
  if (!calculation) return null;

  const { remainingRatio, status } = calculation;
  const usedPercent = Math.round((1 - remainingRatio) * 100);
  const fillColor = STATUS_COLORS[status] || STATUS_COLORS.comfortable;

  return (
    <div
      className="flex items-center gap-3"
      style={{ margin: 'var(--space-md) 0' }}
    >
      <HardDrive
        style={{
          width: 20,
          height: 20,
          color: 'var(--storage-text-secondary)',
          flexShrink: 0,
        }}
      />

      {/* Progress bar */}
      <div
        style={{
          flex: 1,
          height: 'var(--size-progress-bar-mini)',
          backgroundColor: 'var(--storage-bg-overlay)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${usedPercent}%`,
            height: '100%',
            backgroundColor: fillColor,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.2s ease, background-color 0.3s ease',
          }}
        />
      </div>

      {/* Percentage */}
      <span
        className="whitespace-nowrap"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--font-size-caption)',
          fontWeight: 600,
          color: fillColor,
        }}
      >
        {remainingRatio >= 0
          ? `${Math.round(remainingRatio * 100)}%`
          : '0%'}
      </span>
    </div>
  );
}
