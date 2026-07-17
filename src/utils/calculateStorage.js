/**
 * calculateStorage — 存储容量计算引擎（纯函数）
 * 来源：prd.md "计算模型" + "判断规则"
 *
 * 输入：UserSelection（用户选择集）
 * 输出：CalculationResult（计算结果）
 */
import { systems } from '../data/systems';
import { tools } from '../data/tools';
import { aiTools } from '../data/aiTools';
import { platforms } from '../data/platforms';
import { environments } from '../data/environments';
import { scenarios } from '../data/scenarios';

// 容量档位固定值
const CAPACITIES = [256, 512, 1024, 2048];

// 冗余阶梯：按容量查表（prd.md "冗余"）
const REDUNDANCY_MAP = {
  256: 30,
  512: 50,
  1024: 80,
  2048: 100,
};

// 状态阈值（prd.md "状态等级"）
// < 10% critical / 10%-20% manageable / 20%-40% comfortable / > 40% abundant
function getStatus(ratio) {
  if (ratio < 0.1) return 'critical';
  if (ratio < 0.2) return 'manageable';
  if (ratio < 0.4) return 'comfortable';
  return 'abundant';
}

// 推荐容量：满足"剩余比例 ≥ 20%（舒适）"的最小容量档位
// 来源：prd.md "推荐容量" 计算逻辑
function getRecommendedCapacity(totalUsedWithRedundancy) {
  // prd.md 推荐容量表（基于"预计总占用（含冗余）"）
  // < 180 → 256, 180-400 → 512, 400-850 → 1TB, > 850 → 2TB
  if (totalUsedWithRedundancy < 180) return 256;
  if (totalUsedWithRedundancy < 400) return 512;
  if (totalUsedWithRedundancy < 850) return 1024;
  return 2048;
}

/**
 * getDefaultCapacity — 进入 S1 时的初始容量推荐
 * 输入：不含冗余的总占用（GB）
 * 输出：第一个满足"剩余 ≥ 20%"的容量档位
 * 若所有档位都不够，返回最大值 2048
 *
 * 注意：此函数与 getRecommendedCapacity 的区别——
 *      getRecommendedCapacity 用于 S3 结果页的 ★推荐标记，基于含冗余的总占用查表
 *      getDefaultCapacity 用于 S1 进入时的初始容量选择，基于不含冗余的总占用动态遍历
 */
export function getDefaultCapacity(totalUsedWithoutRedundancy) {
  for (const cap of CAPACITIES) {
    const redundant = REDUNDANCY_MAP[cap] ?? 0;
    const totalUsed = totalUsedWithoutRedundancy + redundant;
    const remaining = cap - totalUsed;
    if (cap > 0 && remaining / cap >= 0.2) {
      return cap;
    }
  }
  return 2048; // 所有档位都不够，返回最大值
}

// 工具函数：从资源池按 ID 数组求 sizeGB 之和
export function sumSize(pool, ids) {
  return ids.reduce((total, id) => {
    const item = pool.find((p) => p.id === id);
    return total + (item ? item.sizeGB : 0);
  }, 0);
}

export function calculateStorage({
  capacityGB,
  systemId,
  selectedTools,
  selectedAITools,
  selectedPlatforms,
  selectedEnvironments,
  projectCounts,
}) {
  // 1. 操作系统
  const system = systems.find((s) => s.id === systemId);
  const systemSize = system ? system.baseSizeGB : 0;

  // 2. 开发工具（已含缓存与依赖）
  const toolsSize = sumSize(tools, selectedTools);

  // 3. 智能体
  const aiToolsSize = sumSize(aiTools, selectedAITools);

  // 4. 目标平台
  const platformsSize = sumSize(platforms, selectedPlatforms);

  // 5. 运行环境
  const environmentsSize = sumSize(environments, selectedEnvironments);

  // 6. 项目文件：Σ(场景单项目大小 × 该场景项目数量)
  const projectsSize = Object.entries(projectCounts).reduce((total, [scenarioId, count]) => {
    const scenario = scenarios.find((s) => s.id === scenarioId);
    return total + (scenario ? scenario.projectSizeGB * count : 0);
  }, 0);

  // 7. 冗余：按容量阶梯查表
  const redundantSize = REDUNDANCY_MAP[capacityGB] ?? 0;

  // 总占用
  const totalUsed =
    systemSize + toolsSize + aiToolsSize + platformsSize + environmentsSize + projectsSize + redundantSize;

  // 剩余
  const remaining = capacityGB - totalUsed;
  const remainingRatio = capacityGB > 0 ? remaining / capacityGB : 0;

  // 状态等级
  const status = getStatus(remainingRatio);

  // 推荐容量
  const recommendedCapacity = getRecommendedCapacity(totalUsed);

  return {
    totalUsed,
    remaining,
    remainingRatio,
    status,
    recommendedCapacity,
    breakdown: {
      system: systemSize,
      tools: toolsSize,
      aiTools: aiToolsSize,
      platforms: platformsSize,
      environments: environmentsSize,
      projects: projectsSize,
      redundant: redundantSize,
    },
  };
}

/**
 * exceedsAllTiers — 判断总占用（不含冗余）是否超出所有容量档位
 * 公式：(totalUsed - redundant + 100) > 2048
 * +100 是 2TB 档位下的安全冗余，用于判断是否连 2TB 都不够
 * 返回 true 时，应在 UI 提示"建议考虑 4TB 及以上"
 */
export function exceedsAllTiers(calculation) {
  if (!calculation) return false;
  const totalWithoutRedundancy = calculation.totalUsed - calculation.breakdown.redundant;
  return (totalWithoutRedundancy + 100) > 2048;
}

export { CAPACITIES };
