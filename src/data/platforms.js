/**
 * 目标发布平台数据
 * 来源：prd.md "目标平台占用" 章节
 * Web 平台为 0GB（浏览器自带，构建工具已含在 Node.js 中）
 */
export const platforms = [
  { id: 'web', nameKey: 'platforms.web', sizeGB: 0 },
  { id: 'windows', nameKey: 'platforms.windows', sizeGB: 5 },
  { id: 'macos', nameKey: 'platforms.macos', sizeGB: 5 },
  { id: 'linux', nameKey: 'platforms.linux', sizeGB: 5 },
  { id: 'ios', nameKey: 'platforms.ios', sizeGB: 20 },
  { id: 'android', nameKey: 'platforms.android', sizeGB: 20 },
  { id: 'wechat-miniapp', nameKey: 'platforms.wechatMiniapp', sizeGB: 5 },
];
