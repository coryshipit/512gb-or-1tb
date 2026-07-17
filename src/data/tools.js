/**
 * 开发工具数据
 * 来源：prd.md "工具占用（中位估算，已含缓存与依赖）" 章节
 * 注意：Docker 不在工具池中，仅在运行环境维度
 */
export const tools = [
  // 编辑器
  { id: 'vscode', nameKey: 'tools.vscode', sizeGB: 2, category: 'editor' },
  // 版本控制
  { id: 'git', nameKey: 'tools.git', sizeGB: 0.5, category: 'vcs' },
  { id: 'github-desktop', nameKey: 'tools.githubDesktop', sizeGB: 1, category: 'vcs' },
  // 运行基础库
  { id: 'nodejs', nameKey: 'tools.nodejs', sizeGB: 6, category: 'runtime' },
  { id: 'python', nameKey: 'tools.python', sizeGB: 6, category: 'runtime' },
  { id: 'rust', nameKey: 'tools.rust', sizeGB: 8, category: 'runtime' },
  // 平台 SDK
  { id: 'xcode', nameKey: 'tools.xcode', sizeGB: 60, category: 'sdk' },
  { id: 'android-studio', nameKey: 'tools.androidStudio', sizeGB: 40, category: 'sdk' },
  { id: 'wechat-devtools', nameKey: 'tools.wechatDevtools', sizeGB: 5, category: 'sdk' },
  // 设计
  { id: 'figma', nameKey: 'tools.figma', sizeGB: 2, category: 'design' },
  { id: 'adobe-affinity', nameKey: 'tools.adobeAffinity', sizeGB: 30, category: 'design' },
  // 游戏引擎（Unity 与 Unreal 互斥，由组件层处理）
  { id: 'unity', nameKey: 'tools.unity', sizeGB: 30, category: 'game-engine' },
  { id: 'unreal', nameKey: 'tools.unreal', sizeGB: 120, category: 'game-engine' },
  // 其他
  { id: 'blender', nameKey: 'tools.blender', sizeGB: 5, category: 'other' },
  { id: 'davinci-resolve', nameKey: 'tools.davinciResolve', sizeGB: 7, category: 'other' },
];
