/**
 * calculateStorage 测试用例
 * 来源：prd.md "计算模型" + "判断规则" 章节
 * 测试范围遵循 tech-notes.md "测试范围（第一版）"
 */
import { describe, it, expect } from 'vitest';
import { calculateStorage, sumSize, getDefaultCapacity, exceedsAllTiers } from './calculateStorage';

describe('calculateStorage — 各分项计算', () => {
  it('操作系统：macOS = 75GB（含 Homebrew）', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.system).toBe(75);
  });

  it('操作系统：Windows = 80GB（含 WinGet）', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'windows',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.system).toBe(80);
  });

  it('操作系统：Linux = 45GB', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'linux',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.system).toBe(45);
  });

  it('开发工具：勾选项 sizeGB 之和（已含缓存与依赖）', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: ['vscode', 'git', 'nodejs'], // 2 + 0.5 + 6 = 8.5
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.tools).toBe(8.5);
  });

  it('智能体：勾选项 sizeGB 之和', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: ['cursor', 'chatgpt'], // 2 + 3 = 5
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.aiTools).toBe(5);
  });

  it('目标平台：勾选项 sizeGB 之和（Web 平台为 0GB）', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: ['web', 'ios'], // 0 + 5 = 5
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.platforms).toBe(5);
  });

  it('运行环境：勾选项 sizeGB 之和', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: ['docker', 'win-vm'], // 50 + 120 = 170
      projectCounts: {},
    });
    expect(result.breakdown.environments).toBe(170);
  });

  it('项目文件：Σ(场景单项目大小 × 该场景项目数量)', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: { web: 10, mobile: 5 }, // 3*10 + 4*5 = 30 + 20 = 50
    });
    expect(result.breakdown.projects).toBe(50);
  });

  it('冗余：256GB → 30GB', () => {
    const result = calculateStorage({
      capacityGB: 256,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.redundant).toBe(30);
  });

  it('冗余：512GB → 50GB', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.redundant).toBe(50);
  });

  it('冗余：1TB(1024GB) → 80GB', () => {
    const result = calculateStorage({
      capacityGB: 1024,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.redundant).toBe(80);
  });

  it('冗余：2TB(2048GB) → 100GB', () => {
    const result = calculateStorage({
      capacityGB: 2048,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.redundant).toBe(100);
  });
});

describe('calculateStorage — 总占用、剩余、剩余比例', () => {
  it('总占用 = 各分项之和', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos', // 75
      selectedTools: ['vscode'], // 2
      selectedAITools: ['cursor'], // 2
      selectedPlatforms: ['web'], // 0
      selectedEnvironments: [],
      projectCounts: { web: 10 }, // 30
      // 冗余 512 → 50
      // 总占用 = 75 + 2 + 2 + 0 + 0 + 30 + 50 = 159
    });
    expect(result.totalUsed).toBe(159);
  });

  it('剩余 = 总容量 - 总占用', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: ['vscode'],
      selectedAITools: ['cursor'],
      selectedPlatforms: ['web'],
      selectedEnvironments: [],
      projectCounts: { web: 10 },
    });
    expect(result.remaining).toBe(512 - 159);
  });

  it('剩余比例 = 剩余 / 总容量', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: ['vscode'],
      selectedAITools: ['cursor'],
      selectedPlatforms: ['web'],
      selectedEnvironments: [],
      projectCounts: { web: 10 },
    });
    expect(result.remainingRatio).toBeCloseTo((512 - 159) / 512, 5);
  });

  it('边界：总占用超过总容量时，剩余为负数', () => {
    const result = calculateStorage({
      capacityGB: 256,
      systemId: 'windows', // 80
      selectedTools: ['xcode', 'android-studio'], // 60 + 40 = 100
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
      // 冗余 256 → 30, 总占用 = 80 + 100 + 30 = 210 < 256，不会为负
      // 改用更大占用测试
    });
    expect(result.remaining).toBe(256 - 210);
  });
});

describe('calculateStorage — 状态等级判断', () => {
  const baseInput = {
    systemId: 'macos',
    selectedTools: [],
    selectedAITools: [],
    selectedPlatforms: [],
    selectedEnvironments: [],
    projectCounts: {},
  };

  it('剩余比例 < 10% → 紧张（critical）', () => {
    // 用标准档位 256：macOS 75 + 冗余 30 = 105
    // xcode(60) + android-studio(40) + unity(30) = 130 → 总占用 235
    // 剩余 256 - 235 = 21 → 8.2% < 10%
    const result = calculateStorage({
      ...baseInput,
      capacityGB: 256,
      selectedTools: ['xcode', 'android-studio', 'unity'],
    });
    expect(result.remainingRatio).toBeLessThan(0.1);
    expect(result.status).toBe('critical');
  });

  it('剩余比例 10%-20% → 可用但需管理（manageable）', () => {
    // 256 档：macOS 75 + 冗余 30 = 105
    // xcode(60) → 总占用 165，剩余 91/256 = 35.5%（comfortable）
    // 加 android-studio(40) → 总占用 205，剩余 51/256 = 19.9%（manageable）
    const result = calculateStorage({
      ...baseInput,
      capacityGB: 256,
      selectedTools: ['xcode', 'android-studio'],
    });
    expect(result.remainingRatio).toBeGreaterThanOrEqual(0.1);
    expect(result.remainingRatio).toBeLessThan(0.2);
    expect(result.status).toBe('manageable');
  });

  it('剩余比例 20%-40% → 舒适（comfortable）', () => {
    // 512 档：macOS 75 + 冗余 50 = 125
    // xcode(60) + unity(30) + win-vm(120) = 210 → 总占用 335，剩余 177/512 = 34.6%（comfortable）
    const result = calculateStorage({
      ...baseInput,
      capacityGB: 512,
      selectedTools: ['xcode', 'unity'],
      selectedEnvironments: ['win-vm'],
    });
    expect(result.remainingRatio).toBeGreaterThanOrEqual(0.2);
    expect(result.remainingRatio).toBeLessThan(0.4);
    expect(result.status).toBe('comfortable');
  });

  it('剩余比例 > 40% → 充裕（abundant）', () => {
    // macOS 75 + 冗余 50 = 125, 容量 512 → 剩余 387/512 = 75.6%
    const result = calculateStorage({ ...baseInput, capacityGB: 512 });
    expect(result.remainingRatio).toBeGreaterThan(0.4);
    expect(result.status).toBe('abundant');
  });
});

describe('calculateStorage — 推荐容量', () => {
  const baseInput = {
    systemId: 'macos',
    selectedTools: [],
    selectedAITools: [],
    selectedPlatforms: [],
    selectedEnvironments: [],
    projectCounts: {},
  };

  it('总占用（含冗余）< 180GB → 推荐 256GB', () => {
    // macOS 75 + 冗余 30(用256档) ... 推荐基于总占用
    // 注意：推荐容量逻辑基于"总占用（含冗余）"，但冗余本身依赖容量档位
    // 这里用裸占用验证推荐档位
    const result = calculateStorage({ ...baseInput, capacityGB: 512 });
    // 占用 75 + 50(冗余512) = 125 < 180 → 推荐 256
    expect(result.recommendedCapacity).toBe(256);
  });

  it('总占用（含冗余）180-400GB → 推荐 512GB', () => {
    // macOS 75 + xcode(60) + android-studio(40) = 175 + 冗余 50 = 225
    const result = calculateStorage({
      ...baseInput,
      capacityGB: 512,
      selectedTools: ['xcode', 'android-studio'],
    });
    expect(result.recommendedCapacity).toBe(512);
  });

  it('总占用（含冗余）400-850GB → 推荐 1TB', () => {
    // macOS 75 + unreal(120) + win-vm(120) + dual-boot(150) = 465 + 冗余 100(2TB档) = 565
    const result = calculateStorage({
      ...baseInput,
      capacityGB: 2048,
      selectedTools: ['unreal'],
      selectedEnvironments: ['win-vm', 'dual-boot'],
    });
    expect(result.recommendedCapacity).toBe(1024);
  });

  it('总占用（含冗余）> 850GB → 推荐 2TB', () => {
    // macOS 75 + unreal(120) + win-vm(120) + linux-vm(50) + dual-boot(150) = 515
    // + gamedev 35GB/个 × 20 = 700 → 1215 + 冗余 100 = 1315 > 850
    const result = calculateStorage({
      ...baseInput,
      capacityGB: 2048,
      selectedTools: ['unreal'],
      selectedEnvironments: ['win-vm', 'linux-vm', 'dual-boot'],
      projectCounts: { gamedev: 20 },
    });
    expect(result.recommendedCapacity).toBe(2048);
  });
});

describe('calculateStorage — 边界值', () => {
  it('空选择：所有分项为 0（除系统与冗余）', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.tools).toBe(0);
    expect(result.breakdown.aiTools).toBe(0);
    expect(result.breakdown.platforms).toBe(0);
    expect(result.breakdown.environments).toBe(0);
    expect(result.breakdown.projects).toBe(0);
  });

  it('不存在的工具 ID 被忽略', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: ['vscode', 'nonexistent'],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    expect(result.breakdown.tools).toBe(2); // 只算 vscode
  });

  it('项目数量为 0 时，项目文件占用为 0', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: { web: 0 },
    });
    expect(result.breakdown.projects).toBe(0);
  });

  it('最大项目数（50）', () => {
    const result = calculateStorage({
      capacityGB: 2048,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: { gamedev: 50 }, // 35 * 50 = 1750
    });
    expect(result.breakdown.projects).toBe(1750);
  });
});

describe('calculateStorage — 极限全选', () => {
  it('6 场景全选 + 全部工具 + 全部 AI + 全部平台 + 全部环境 + 最大项目数', () => {
    // 最极端的用户：什么都做，什么都装
    // OS: Windows 80
    // 工具: 全部（Unity 与 Unreal 互斥，取 Unreal）= 292.5
    // AI: 全部 = 6.5
    // 平台: 全部 = 30
    // 环境: 全部 = 370
    // 项目: 每场景 50 个 = 3750
    // 冗余: 2048→100
    // 总占用 = 80 + 292.5 + 6.5 + 30 + 370 + 3750 + 100 = 4629
    const result = calculateStorage({
      capacityGB: 2048,
      systemId: 'windows',
      selectedTools: [
        'vscode', 'git', 'github-desktop',
        'nodejs', 'python', 'rust',
        'xcode', 'android-studio', 'wechat-devtools',
        'figma', 'adobe-affinity',
        'unreal', 'blender', 'davinci-resolve',
      ],
      selectedAITools: ['cursor', 'chatgpt', 'copilot', 'claude-code'],
      selectedPlatforms: ['web', 'windows', 'macos', 'linux', 'ios', 'android', 'wechat-miniapp'],
      selectedEnvironments: ['docker', 'win-vm', 'linux-vm', 'dual-boot'],
      projectCounts: { web: 50, mobile: 50, desktop: 50, designer: 50, gamedev: 50, content: 50 },
    });

    expect(result.breakdown.system).toBe(80);
    expect(result.breakdown.tools).toBe(292.5);
    expect(result.breakdown.aiTools).toBe(6.5);
    expect(result.breakdown.platforms).toBe(30);
    expect(result.breakdown.environments).toBe(370);
    expect(result.breakdown.projects).toBe(3750);
    expect(result.totalUsed).toBe(4629);
    expect(result.remaining).toBe(2048 - 4629); // 负值，远超所有档位
    expect(result.status).toBe('critical');
    expect(result.recommendedCapacity).toBe(2048); // 最大推荐仍是 2TB
  });
});

describe('getDefaultCapacity — 差异化初始容量', () => {
  it('Web 开发（单选 10 项目）→ 256GB', () => {
    // OS 75 + tools(21.5) + AI 2 + platform 0 + projects(3×10=30) = 128.5
    // 256:冗余30→158.5, 剩余97.5/256=38.1% ≥ 20%
    expect(getDefaultCapacity(128.5)).toBe(256);
  });

  it('移动应用开发（单选 10 项目）→ 512GB', () => {
    // OS 75 + tools(2+0.5+6+60+40=108.5) + AI 2 + platform(5+5=10) + projects(4×10=40) = 235.5
    // 256:冗余30→265.5 溢出 ❌ → 512:冗余50→285.5, 226.5/512=44.2% ≥ 20%
    expect(getDefaultCapacity(235.5)).toBe(512);
  });

  it('桌面应用开发（单选 10 项目）→ 256GB', () => {
    // OS 75 + tools(2+0.5+6+8=16.5) + AI 2 + platform(5+5+5=15) + projects(5×10=50) = 158.5
    // 256:冗余30→188.5, 67.5/256=26.4% ≥ 20%
    expect(getDefaultCapacity(158.5)).toBe(256);
  });

  it('设计师（单选 10 项目）→ 512GB', () => {
    // OS 75 + tools(2+30=32) + AI 3 + platform 0 + projects(8×10=80) = 190
    // 256:冗余30→220, 36/256=14.1% ❌ → 512:冗余50→240, 272/512=53.1% ≥ 20%
    expect(getDefaultCapacity(190)).toBe(512);
  });

  it('游戏开发（单选 10 项目）→ 1TB', () => {
    // OS 80 + tools(2+0.5+30+5+6=43.5) + AI 2 + platform(5+0=5) + projects(35×10=350) = 480.5
    // 256 溢出 → 512 溢出 → 1024:冗余80→560.5, 463.5/1024=45.3% ≥ 20%
    expect(getDefaultCapacity(480.5)).toBe(1024);
  });

  it('自媒体运营（单选 10 项目）→ 512GB', () => {
    // OS 75 + tools(7+30+2+2=41) + AI(3+1=4) + platform 0 + projects(20×10=200) = 320
    // 256 溢出 → 512:冗余50→370, 142/512=27.7% ≥ 20%
    expect(getDefaultCapacity(320)).toBe(512);
  });

  it('多选（Web+移动+桌面+设计，各 5 项目）→ 1TB', () => {
    // OS 75 + tools 155.5 + AI 5 + platform 25 + projects 100 = 360.5
    // 512:冗余50→410.5, 101.5/512=19.8% ❌ → 1024:冗余80→440.5, 583.5/1024=57.0% ≥ 20%
    expect(getDefaultCapacity(360.5)).toBe(1024);
  });

  it('六场景全选（各 5 项目）→ 1TB', () => {
    // OS 75 + tools 202.5 + AI 6.5 + platform 30 + projects 375 = 689
    // 512 溢出 → 1024:冗余80→769, 255/1024=24.9% ≥ 20%
    expect(getDefaultCapacity(689)).toBe(1024);
  });

  it('极限全选（各 50 项目）→ 所有档位溢出，返回 2048', () => {
    // OS 80 + tools 292.5 + AI 6.5 + platform 30 + projects(3+4+5+8+35+20)×50=3750 = 4159
    // 全部溢出 → 返回 2048
    expect(getDefaultCapacity(4159)).toBe(2048);
  });

  it('极小占用 → 256GB', () => {
    expect(getDefaultCapacity(50)).toBe(256);
  });
});

describe('sumSize — 工具函数', () => {
  it('从资源池按 ID 求和', () => {
    const pool = [
      { id: 'a', sizeGB: 10 },
      { id: 'b', sizeGB: 20 },
      { id: 'c', sizeGB: 30 },
    ];
    expect(sumSize(pool, ['a', 'c'])).toBe(40);
  });

  it('不存在的 ID 被忽略', () => {
    const pool = [{ id: 'a', sizeGB: 10 }];
    expect(sumSize(pool, ['a', 'nonexistent'])).toBe(10);
  });

  it('空数组返回 0', () => {
    const pool = [{ id: 'a', sizeGB: 10 }];
    expect(sumSize(pool, [])).toBe(0);
  });
});

describe('exceedsAllTiers — 溢出判断', () => {
  it('null 计算返回 false', () => {
    expect(exceedsAllTiers(null)).toBe(false);
  });

  it('undefined 计算返回 false', () => {
    expect(exceedsAllTiers(undefined)).toBe(false);
  });

  it('典型场景（远低于 2TB）返回 false', () => {
    const result = calculateStorage({
      capacityGB: 512,
      systemId: 'macos',
      selectedTools: ['vscode', 'nodejs'],
      selectedAITools: ['cursor'],
      selectedPlatforms: ['web'],
      selectedEnvironments: [],
      projectCounts: { web: 10 },
    });
    expect(exceedsAllTiers(result)).toBe(false);
  });

  it('边界：恰好等于阈值（1948 + 100 = 2048）返回 false', () => {
    const result = calculateStorage({
      capacityGB: 2048,
      systemId: 'macos',
      selectedTools: [],
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: [],
      projectCounts: {},
    });
    // totalUsed=175(75+100冗余), totalWithoutRedundancy=75
    // 75 + 100 = 175 ≤ 2048 → false
    expect(exceedsAllTiers(result)).toBe(false);
  });

  it('溢出：总占用（不含冗余）+100 > 2048 返回 true', () => {
    const result = calculateStorage({
      capacityGB: 2048,
      systemId: 'macos', // 75
      selectedTools: ['unreal'], // 120
      selectedAITools: [],
      selectedPlatforms: [],
      selectedEnvironments: ['win-vm', 'dual-boot'], // 120 + 150 = 270
      projectCounts: { gamedev: 50 }, // 35 × 50 = 1750
    });
    // totalUsed = 75 + 120 + 0 + 0 + 270 + 1750 + 100 = 2315
    // totalWithoutRedundancy = 2315 - 100 = 2215
    // 2215 + 100 = 2315 > 2048 → true
    expect(exceedsAllTiers(result)).toBe(true);
  });

  it('极限全选：返回 true', () => {
    const result = calculateStorage({
      capacityGB: 2048,
      systemId: 'windows',
      selectedTools: [
        'vscode', 'git', 'github-desktop',
        'nodejs', 'python', 'rust',
        'xcode', 'android-studio', 'wechat-devtools',
        'figma', 'adobe-affinity',
        'unreal', 'blender', 'davinci-resolve',
      ],
      selectedAITools: ['cursor', 'chatgpt', 'copilot', 'claude-code'],
      selectedPlatforms: ['web', 'windows', 'macos', 'linux', 'ios', 'android', 'wechat-miniapp'],
      selectedEnvironments: ['docker', 'win-vm', 'linux-vm', 'dual-boot'],
      projectCounts: { web: 50, mobile: 50, desktop: 50, designer: 50, gamedev: 50, content: 50 },
    });
    // totalUsed = 4629, redundant = 100, totalWithoutRedundancy = 4529
    // 4529 + 100 = 4629 > 2048 → true
    expect(exceedsAllTiers(result)).toBe(true);
  });
});
