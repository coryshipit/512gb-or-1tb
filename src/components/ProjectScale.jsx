/**
 * ProjectScale — 项目规模区
 * 每个选中场景独立一行(项目估算行):场景名称 + 单项目大小 + 滑块(1-50) + 小计
 * 底部显示"项目文件总计"
 * 滑块左侧填充:linear-gradient + --slider-fill 动态更新
 * 来源:design-spec.md "项目规模区" + "项目规模交互" + 高保真原型 S1
 */
import { useMemo } from 'react';
import { scenarios } from '../data/scenarios';
import { i18n } from '../data/i18n';

function ScenarioRow({ lang, scenario, count, onChange }) {
  const t = i18n[lang];
  const name = t[scenario.nameKey] || scenario.id;
  const sizePerProject = scenario.projectSizeGB;
  const subtotal = sizePerProject * count;
  const fillPct = ((count - 1) / (50 - 1)) * 100;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
      }}
    >
      {/* Row 1: name + perProject + count + subtotal */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          flexWrap: 'wrap',
        }}
      >
        {/* Scenario name */}
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--storage-text-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>

        {/* Per-project size */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-caption)',
            color: 'var(--storage-text-tertiary)',
            whiteSpace: 'nowrap',
          }}
        >
          {t['config.perProject'].replace('{size}', sizePerProject)}
        </span>

        {/* Spacer */}
        <span style={{ flex: 1, minWidth: 0 }} />

        {/* Count display — fixed width to prevent layout shift */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-caption)',
            fontWeight: 600,
            color: 'var(--storage-text-primary)',
            whiteSpace: 'nowrap',
            minWidth: 36,
            textAlign: 'right',
          }}
        >
          {t['config.projectCount'].replace('{count}', count)}
        </span>

        {/* Subtotal — fixed minWidth to prevent layout shift from 2→3 digits */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-mono)',
            fontWeight: 600,
            color: 'var(--storage-primary)',
            whiteSpace: 'nowrap',
            minWidth: 52,
            textAlign: 'right',
          }}
        >
          {subtotal}GB
        </span>
      </div>

      {/* Row 2: slider — full width for comfortable mobile operation */}
      <input
        type="range"
        min={1}
        max={50}
        value={count}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          appearance: 'none',
          cursor: 'pointer',
          background: `linear-gradient(to right, var(--storage-primary-action) 0%, var(--storage-primary-action) ${fillPct}%, var(--storage-bg-surface) ${fillPct}%, var(--storage-bg-surface) 100%)`,
        }}
      />
    </div>
  );
}

export default function ProjectScale({ lang, selectedScenarios, projectCounts, onChangeCount }) {
  const t = i18n[lang];

  const totalProjects = useMemo(() => {
    return selectedScenarios.reduce((sum, scenarioId) => {
      const scenario = scenarios.find((s) => s.id === scenarioId);
      const count = projectCounts[scenarioId] || 0;
      return sum + (scenario ? scenario.projectSizeGB * count : 0);
    }, 0);
  }, [selectedScenarios, projectCounts]);

  if (selectedScenarios.length === 0) return null;

  return (
    <div>
      <p
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--storage-text-primary)',
          margin: '0 0 12px 0',
        }}
      >
        {t['config.projectScale']}
      </p>

      <div
        className="flex flex-col"
        style={{ gap: 'var(--space-md)' }}
      >
        {selectedScenarios.map((scenarioId) => {
          const scenario = scenarios.find((s) => s.id === scenarioId);
          if (!scenario) return null;
          return (
            <ScenarioRow
              key={scenarioId}
              lang={lang}
              scenario={scenario}
              count={projectCounts[scenarioId] || 1}
              onChange={(count) => onChangeCount(scenarioId, count)}
            />
          );
        })}
      </div>

      {/* Total */}
      <div
        className="flex justify-between items-center"
        style={{
          marginTop: 'var(--space-md)',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--storage-border)',
        }}
      >
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--storage-text-secondary)',
          }}
        >
          {t['config.projectTotal']}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-mono)',
            fontWeight: 600,
            color: 'var(--storage-primary)',
          }}
        >
          {totalProjects}GB
        </span>
      </div>
    </div>
  );
}
