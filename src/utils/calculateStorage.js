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

// 工具函数：从资源池按 ID 数组求 sizeGB 之和
function sumSize(pool, ids) {
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

export { CAPACITIES };
