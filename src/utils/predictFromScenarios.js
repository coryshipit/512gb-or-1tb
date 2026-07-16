/**
 * predictFromScenarios — 场景预测逻辑（纯函数）
 * 来源：prd.md "系统自动预测" + tech-notes.md "场景预测逻辑"
 *
 * 输入：选中的场景 ID 数组
 * 输出：Prediction（推荐 OS + 默认工具/智能体/平台/环境 + 项目数量）
 */
import { scenarios } from '../data/scenarios';

// 数组并集（去重）
function union(arrays) {
  return [...new Set(arrays.flat())];
}

export function predictFromScenarios(selectedScenarioIds) {
  const selected = scenarios.filter((s) => selectedScenarioIds.includes(s.id));

  // OS 预测：多数一致取一致值；不一致取 macOS（覆盖范围最广）
  const osVotes = selected.map((s) => s.recommendedOS);
  const voteCounts = {};
  osVotes.forEach((os) => {
    voteCounts[os] = (voteCounts[os] || 0) + 1;
  });
  const maxCount = Math.max(...Object.values(voteCounts), 0);
  const majorityOS = Object.keys(voteCounts).find((os) => voteCounts[os] === maxCount);
  // 多数一致（超过半数）取该值；否则（并列或无场景）取 macOS
  const isStrictMajority = selected.length > 0 && maxCount > selected.length / 2;
  const recommendedOS = isStrictMajority ? majorityOS : 'macos';

  // 各维度并集
  const defaultTools = union(selected.map((s) => s.defaultTools));
  const defaultAITools = union(selected.map((s) => s.defaultAITools));
  const defaultPlatforms = union(selected.map((s) => s.defaultPlatforms));
  const defaultEnvironments = union(selected.map((s) => s.defaultEnvironments));

  // 项目数量默认值：单选 → 10；多选 → 每场景各 5
  const isSingle = selectedScenarioIds.length === 1;
  const projectCounts = Object.fromEntries(
    selectedScenarioIds.map((id) => [id, isSingle ? 10 : 5])
  );

  return {
    recommendedOS,
    defaultTools,
    defaultAITools,
    defaultPlatforms,
    defaultEnvironments,
    projectCounts,
  };
}
