/**
 * predictFromScenarios 测试用例
 * 来源：prd.md "系统自动预测" + tech-notes.md "场景预测逻辑"
 */
import { describe, it, expect } from 'vitest';
import { predictFromScenarios } from './predictFromScenarios';

describe('predictFromScenarios — 场景合并规则', () => {
  it('单场景：返回该场景的完整预测配置', () => {
    const result = predictFromScenarios(['web']);
    expect(result.recommendedOS).toBe('macos');
    expect(result.defaultTools).toEqual(
      expect.arrayContaining(['vscode', 'git', 'github-desktop', 'nodejs', 'python', 'figma'])
    );
    expect(result.defaultAITools).toEqual(['cursor']);
    expect(result.defaultPlatforms).toEqual(['web']);
    expect(result.defaultEnvironments).toEqual([]);
  });

  it('多场景：工具取并集', () => {
    // web: vscode, git, github-desktop, nodejs, python, figma
    // mobile: vscode, git, nodejs, xcode, android-studio
    // 并集: vscode, git, github-desktop, nodejs, python, figma, xcode, android-studio
    const result = predictFromScenarios(['web', 'mobile']);
    expect(result.defaultTools).toEqual(
      expect.arrayContaining([
        'vscode', 'git', 'github-desktop', 'nodejs', 'python', 'figma',
        'xcode', 'android-studio',
      ])
    );
    expect(result.defaultTools).toHaveLength(8);
  });

  it('多场景：智能体取并集', () => {
    // web: cursor; designer: chatgpt
    const result = predictFromScenarios(['web', 'designer']);
    expect(result.defaultAITools).toEqual(
      expect.arrayContaining(['cursor', 'chatgpt'])
    );
  });

  it('多场景：目标平台取并集', () => {
    // web: web; mobile: ios, android
    const result = predictFromScenarios(['web', 'mobile']);
    expect(result.defaultPlatforms).toEqual(
      expect.arrayContaining(['web', 'ios', 'android'])
    );
  });

  it('多场景：运行环境取并集（所有场景默认为空）', () => {
    const result = predictFromScenarios(['web', 'desktop']);
    expect(result.defaultEnvironments).toEqual([]);
  });

  it('去重：重复的工具/平台只保留一个', () => {
    // web 和 designer 都含 figma
    const result = predictFromScenarios(['web', 'designer']);
    const figmaCount = result.defaultTools.filter((t) => t === 'figma').length;
    expect(figmaCount).toBe(1);
  });
});

describe('predictFromScenarios — OS 预测规则', () => {
  it('单场景：返回该场景的推荐 OS', () => {
    expect(predictFromScenarios(['web']).recommendedOS).toBe('macos');
    expect(predictFromScenarios(['gamedev']).recommendedOS).toBe('windows');
  });

  it('多场景多数一致：取一致值', () => {
    // web(macos) + desktop(macos) + gamedev(windows) → 多数 macos
    const result = predictFromScenarios(['web', 'desktop', 'gamedev']);
    expect(result.recommendedOS).toBe('macos');
  });

  it('多场景不一致：取 macOS（覆盖范围最广）', () => {
    // web(macos) + gamedev(windows) → 1:1 不一致 → macos
    const result = predictFromScenarios(['web', 'gamedev']);
    expect(result.recommendedOS).toBe('macos');
  });

  it('全部场景 OS 一致：取该一致值', () => {
    // web(macos) + mobile(macos) + designer(macos) → macos
    const result = predictFromScenarios(['web', 'mobile', 'designer']);
    expect(result.recommendedOS).toBe('macos');
  });
});

describe('predictFromScenarios — 项目数量默认值', () => {
  it('单选场景：默认 10 个', () => {
    const result = predictFromScenarios(['web']);
    expect(result.projectCounts).toEqual({ web: 10 });
  });

  it('多选场景：每场景各 5 个', () => {
    const result = predictFromScenarios(['web', 'mobile']);
    expect(result.projectCounts).toEqual({ web: 5, mobile: 5 });
  });

  it('三个场景：每场景各 5 个', () => {
    const result = predictFromScenarios(['web', 'mobile', 'designer']);
    expect(result.projectCounts).toEqual({ web: 5, mobile: 5, designer: 5 });
  });
});

describe('predictFromScenarios — 边界', () => {
  it('空数组：返回空的预测配置', () => {
    const result = predictFromScenarios([]);
    expect(result.defaultTools).toEqual([]);
    expect(result.defaultAITools).toEqual([]);
    expect(result.defaultPlatforms).toEqual([]);
    expect(result.defaultEnvironments).toEqual([]);
    expect(result.projectCounts).toEqual({});
    expect(result.recommendedOS).toBe('macos'); // 无场景时默认 macos
  });

  it('六个场景全选：取所有并集', () => {
    const result = predictFromScenarios([
      'web', 'mobile', 'desktop', 'designer', 'gamedev', 'content',
    ]);
    expect(result.defaultTools.length).toBeGreaterThan(0);
    expect(Object.keys(result.projectCounts)).toHaveLength(6);
  });
});
