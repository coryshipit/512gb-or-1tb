/**
 * 目标发布平台数据
 * 来源：DATA_MODEL.md "目标平台" 章节
 * Web 平台为 0GB（浏览器自带，构建工具已含在 Node.js 中）
 * iOS/Android SDK 已在 Xcode/Android Studio 中计算，此处仅证书/归档/符号
 */
export const platforms = [
  { id: 'web', nameKey: 'platforms.web', sizeGB: 0 },
  { id: 'windows', nameKey: 'platforms.windows', sizeGB: 5 },
  { id: 'macos', nameKey: 'platforms.macos', sizeGB: 5 },
  { id: 'linux', nameKey: 'platforms.linux', sizeGB: 5 },
  { id: 'ios', nameKey: 'platforms.ios', sizeGB: 5 },
  { id: 'android', nameKey: 'platforms.android', sizeGB: 5 },
  { id: 'wechat-miniapp', nameKey: 'platforms.wechatMiniapp', sizeGB: 5 },
];
