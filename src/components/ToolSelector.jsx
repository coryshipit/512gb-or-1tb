/**
 * ToolSelector — 开发工具选择（多选,按类别分组）
 * 分组:编辑器 / 版本控制 / 运行基础库 / 平台 SDK / 设计 / 游戏引擎(互斥) / 其他
 * Unity 与 Unreal 互斥
 * 来源:design-spec.md "细化配置区" + "工具分组映射" + 高保真原型 S1
 */
import { tools } from '../data/tools';
import { i18n } from '../data/i18n';

// 分组定义(按 design-spec.md "工具分组映射")
// category → i18n key 映射
const TOOL_GROUPS = [
  { category: 'editor', labelKey: 'toolGroup.editor' },
  { category: 'vcs', labelKey: 'toolGroup.vcs' },
  { category: 'runtime', labelKey: 'toolGroup.runtime' },
  { category: 'sdk', labelKey: 'toolGroup.sdk' },
  { category: 'design', labelKey: 'toolGroup.design' },
  { category: 'game-engine', labelKey: 'toolGroup.gameEngine' },
  { category: 'other', labelKey: 'toolGroup.other' },
];

export default function ToolSelector({ lang, selectedTools, onToggle }) {
  const t = i18n[lang];

  const handleToggle = (toolId) => {
    const tool = tools.find((t) => t.id === toolId);

    // Unity/Unreal 互斥:选中其中一个时,自动取消另一个
    if (tool && tool.category === 'game-engine') {
      const otherId = toolId === 'unity' ? 'unreal' : 'unity';
      if (!selectedTools.includes(toolId) && selectedTools.includes(otherId)) {
        // 先取消旧选择,再选新的
        onToggle(otherId); // 取消旧
      }
    }

    onToggle(toolId);
  };

  const groupedTools = TOOL_GROUPS.map((group) => ({
    ...group,
    items: tools.filter((t) => t.category === group.category),
  })).filter((group) => group.items.length > 0);

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
        {t['config.tools']}
      </p>

      {groupedTools.map((group, groupIdx) => (
        <div
          key={group.category}
          style={{
            marginBottom: groupIdx < groupedTools.length - 1 ? 12 : 0,
          }}
        >
          {/* Group title */}
          <p
            style={{
              fontSize: 'var(--font-size-caption)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--storage-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 6px 0',
            }}
          >
            {t[group.labelKey]}
          </p>

          {/* Checkbox items in row */}
          <div
            className="flex flex-wrap"
            style={{ gap: '6px 16px' }}
          >
            {group.items.map((tool) => {
              const isChecked = selectedTools.includes(tool.id);
              return (
                <label
                  key={tool.id}
                  className="flex items-center gap-2"
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
                    onChange={() => handleToggle(tool.id)}
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: 'var(--storage-primary-action)',
                    }}
                  />
                  {t[tool.nameKey] || tool.id}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--storage-text-tertiary)',
                    }}
                  >
                    [{tool.sizeGB}GB]
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
