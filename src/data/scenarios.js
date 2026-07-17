/**
 * 使用场景数据
 * 来源：DATA_MODEL.md "使用场景与项目大小" 章节
 * 每个场景携带一套预测配置：推荐 OS、默认工具、默认智能体、默认平台、默认环境、单项目大小
 * Design Assets 已删除，素材引用归入设计师单项目大小（8GB/项目）
 */
export const scenarios = [
  {
    id: 'web',
    nameKey: 'scenarios.web',
    descKey: 'scenarios.web.desc',
    recommendedOS: 'macos',
    defaultTools: ['vscode', 'git', 'github-desktop', 'nodejs', 'python', 'figma'],
    defaultAITools: ['cursor'],
    defaultPlatforms: ['web'],
    defaultEnvironments: [],
    projectSizeGB: 3,
  },
  {
    id: 'mobile',
    nameKey: 'scenarios.mobile',
    descKey: 'scenarios.mobile.desc',
    recommendedOS: 'macos',
    defaultTools: ['vscode', 'git', 'nodejs', 'xcode', 'android-studio'],
    defaultAITools: ['cursor'],
    defaultPlatforms: ['ios', 'android'],
    defaultEnvironments: [],
    projectSizeGB: 4,
  },
  {
    id: 'desktop',
    nameKey: 'scenarios.desktop',
    descKey: 'scenarios.desktop.desc',
    recommendedOS: 'macos',
    defaultTools: ['vscode', 'git', 'nodejs', 'rust'],
    defaultAITools: ['cursor'],
    defaultPlatforms: ['windows', 'macos', 'linux'],
    defaultEnvironments: [],
    projectSizeGB: 5,
  },
  {
    id: 'designer',
    nameKey: 'scenarios.designer',
    descKey: 'scenarios.designer.desc',
    recommendedOS: 'macos',
    defaultTools: ['figma', 'adobe-affinity'],
    defaultAITools: ['chatgpt'],
    defaultPlatforms: ['web'],
    defaultEnvironments: [],
    projectSizeGB: 8,
  },
  {
    id: 'gamedev',
    nameKey: 'scenarios.gamedev',
    descKey: 'scenarios.gamedev.desc',
    recommendedOS: 'windows',
    defaultTools: ['vscode', 'git', 'unity', 'blender', 'nodejs'],
    defaultAITools: ['cursor'],
    defaultPlatforms: ['windows', 'web'],
    defaultEnvironments: [],
    projectSizeGB: 35,
  },
  {
    id: 'content',
    nameKey: 'scenarios.content',
    descKey: 'scenarios.content.desc',
    recommendedOS: 'macos',
    defaultTools: ['davinci-resolve', 'adobe-affinity', 'figma', 'vscode'],
    defaultAITools: ['chatgpt', 'claude-code'],
    defaultPlatforms: ['web'],
    defaultEnvironments: [],
    projectSizeGB: 20,
  },
];
