/**
 * 本地运行环境数据
 * 来源：prd.md "运行环境占用" 章节
 * 注意：Docker 仅在此维度，不在工具池中重复出现
 * 注意：Mobile Simulators 已移除（模拟器已包含在 Xcode 和 Android Studio 中）
 */
export const environments = [
  { id: 'docker', nameKey: 'envs.docker', sizeGB: 50 },
  { id: 'win-vm', nameKey: 'envs.winVM', sizeGB: 120 },
  { id: 'linux-vm', nameKey: 'envs.linuxVM', sizeGB: 50 },
  { id: 'dual-boot', nameKey: 'envs.dualBoot', sizeGB: 150 },
];
