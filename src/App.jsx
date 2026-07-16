/**
 * App — 应用状态管理 + 布局组合
 * 三状态页面流转: S0(空状态) → S1(配置态) → S3(结果态)
 * 来源:prd.md "页面结构" + "信息架构"
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ScenarioSelector from './components/ScenarioSelector';
import CollapsedScenarioModule from './components/CollapsedScenarioModule';
import MiniResultBar from './components/MiniResultBar';
import CapacitySelector from './components/CapacitySelector';
import OSSelector from './components/OSSelector';
import ToolSelector from './components/ToolSelector';
import AIToolSelector from './components/AIToolSelector';
import PlatformSelector from './components/PlatformSelector';
import EnvironmentSelector from './components/EnvironmentSelector';
import ProjectScale from './components/ProjectScale';
import ResultCard from './components/ResultCard';
import EstimationNote from './components/EstimationNote';
import Footer from './components/Footer';
import { calculateStorage } from './utils/calculateStorage';
import { predictFromScenarios } from './utils/predictFromScenarios';
import { i18n } from './data/i18n';

// 页面状态
const PAGE_STATE = {
  S0: 's0',
  S1: 's1',
  S3: 's3',
};

// 从 localStorage 读取语言偏好,默认检测浏览器语言
function getInitialLang() {
  try {
    const saved = localStorage.getItem('512gb-or-1tb-lang');
    if (saved === 'zh' || saved === 'en') return saved;
  } catch {
    // localStorage 不可用时忽略
  }
  const browserLang = navigator.language || 'zh';
  return browserLang.startsWith('zh') ? 'zh' : 'en';
}

export default function App() {
  // 语言
  const [lang, setLang] = useState(getInitialLang);

  // 页面状态
  const [pageState, setPageState] = useState(PAGE_STATE.S0);

  // S0: 已选场景 ID 数组
  const [selectedScenarios, setSelectedScenarios] = useState([]);

  // S1: 用户选择集（初始为空,进入 S1 时由 predictFromScenarios 填充）
  const [capacityGB, setCapacityGB] = useState(512);
  const [systemId, setSystemId] = useState('macos');
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedAITools, setSelectedAITools] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState([]);
  const [projectCounts, setProjectCounts] = useState({});
  const [userDeselectedTools, setUserDeselectedTools] = useState(new Set());

  // Toast 消息
  const [toast, setToast] = useState(null);

  // 实时计算结果
  const calculation = useMemo(() => {
    if (selectedScenarios.length === 0) return null;
    return calculateStorage({
      capacityGB,
      systemId,
      selectedTools,
      selectedAITools,
      selectedPlatforms,
      selectedEnvironments,
      projectCounts,
    });
  }, [capacityGB, systemId, selectedTools, selectedAITools, selectedPlatforms, selectedEnvironments, projectCounts, selectedScenarios]);

  // Toast 自动消失
  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // 语言切换
  const handleToggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'zh' ? 'en' : 'zh';
      try {
        localStorage.setItem('512gb-or-1tb-lang', next);
      } catch {
        // localStorage 不可用时忽略
      }
      return next;
    });
  }, []);

  // SEO 动态切换:根据 lang 更新 title / meta description / html lang
  useEffect(() => {
    const t = i18n[lang];
    document.title = t['seo.title'];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t['seo.description']);
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  // S0: 场景多选/取消
  const handleToggleScenario = useCallback((scenarioId) => {
    setSelectedScenarios((prev) => {
      if (prev.includes(scenarioId)) {
        return prev.filter((id) => id !== scenarioId);
      }
      return [...prev, scenarioId];
    });
  }, []);

  // S0 → S1: 确认场景选择,进入配置态,自动预测配置
  const handleConfirmScenarios = useCallback(() => {
    if (selectedScenarios.length === 0) return;
    const prediction = predictFromScenarios(selectedScenarios);

    setSystemId(prediction.recommendedOS);
    setSelectedTools(prediction.defaultTools);
    setSelectedAITools(prediction.defaultAITools);
    setSelectedPlatforms(prediction.defaultPlatforms);
    setSelectedEnvironments(prediction.defaultEnvironments);
    setProjectCounts(prediction.projectCounts);
    setUserDeselectedTools(new Set());
    setPageState(PAGE_STATE.S1);
  }, [selectedScenarios]);

  // S1: 返回 S0 修改场景
  const handleBackToS0 = useCallback(() => {
    setPageState(PAGE_STATE.S0);
  }, []);

  // S1: OS 切换 + 联动(iOS+Xcode 取消)
  const handleOSChange = useCallback((newOS) => {
    // 如果当前场景含 iOS 且切到 Windows,自动取消 iOS + Xcode
    if (newOS === 'windows' && selectedPlatforms.includes('ios')) {
      setSelectedPlatforms((prev) => prev.filter((p) => p !== 'ios'));
      setSelectedTools((prev) => prev.filter((t) => t !== 'xcode'));
      showToast(i18n[lang]['toast.osSwitch.windows']);
    }
    setSystemId(newOS);
  }, [selectedPlatforms, showToast, lang]);

  // S1: 工具多选/取消
  const handleToggleTool = useCallback((toolId) => {
    setSelectedTools((prev) => {
      const willRemove = prev.includes(toolId);
      // 记录用户手动取消
      setUserDeselectedTools((deselected) => {
        const next = new Set(deselected);
        if (willRemove) {
          next.add(toolId);
        } else {
          next.delete(toolId);
        }
        return next;
      });
      return willRemove
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];
    });
  }, []);

  // S1: 智能体多选/取消
  const handleToggleAITool = useCallback((toolId) => {
    setSelectedAITools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  }, []);

  // S1: 平台多选/取消
  const handleTogglePlatform = useCallback((platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  }, []);

  // S1: 环境多选/取消
  const handleToggleEnvironment = useCallback((envId) => {
    setSelectedEnvironments((prev) =>
      prev.includes(envId)
        ? prev.filter((id) => id !== envId)
        : [...prev, envId]
    );
  }, []);

  // S1: 项目数量变更
  const handleProjectCountChange = useCallback((scenarioId, count) => {
    setProjectCounts((prev) => ({ ...prev, [scenarioId]: count }));
  }, []);

  // S1 → S3: 查看完整结果
  const handleViewResults = useCallback(() => {
    setPageState(PAGE_STATE.S3);
  }, []);

  // S3 → S1: 返回调整
  const handleBackRefine = useCallback(() => {
    setPageState(PAGE_STATE.S1);
  }, []);

  // 容量紧张提示
  const showCapacityHint = calculation && calculation.status === 'critical';

  // 分隔线样式
  const dividerStyle = {
    height: 1,
    backgroundColor: 'var(--storage-border)',
    border: 'none',
    margin: 'var(--space-md) 0',
  };

  return (
    <div className="min-h-screen">
      <Header lang={lang} onToggleLang={handleToggleLang} />

      {/* S0: 空状态 */}
      {pageState === PAGE_STATE.S0 && (
        <>
          <Hero lang={lang} />
          <ScenarioSelector
            lang={lang}
            selectedScenarios={selectedScenarios}
            onToggleScenario={handleToggleScenario}
            onConfirm={handleConfirmScenarios}
          />
        </>
      )}

      {/* S1: 配置态 */}
      {pageState === PAGE_STATE.S1 && (
        <main
          className="mx-auto px-6"
          style={{
            maxWidth: 'var(--size-max-width)',
            paddingTop: 'var(--space-md)',
            paddingBottom: 'var(--space-2xl)',
          }}
        >
          {/* Mini Result Bar (sticky 吸顶，下拉时实时反馈) */}
          <div
            style={{
              position: 'sticky',
              top: 'var(--size-header-height)',
              zIndex: 10,
              paddingTop: 'var(--space-sm)',
              paddingBottom: 'var(--space-sm)',
              marginTop: 'calc(-1 * var(--space-md))',
              backgroundColor: 'var(--storage-bg-base)',
            }}
          >
            <MiniResultBar calculation={calculation} />
          </div>

          {/* Collapsed Scenario Module */}
          <CollapsedScenarioModule
            lang={lang}
            selectedScenarios={selectedScenarios}
            onEdit={handleBackToS0}
          />

          {/* Config Panel */}
          <div
            className="storage-card"
            style={{ marginBottom: 'var(--space-lg)' }}
          >
            {/* Capacity */}
            <CapacitySelector
              lang={lang}
              capacityGB={capacityGB}
              recommendedCapacity={calculation?.recommendedCapacity}
              onChange={setCapacityGB}
              showHint={showCapacityHint}
            />

            <hr style={dividerStyle} />

            {/* OS */}
            <OSSelector
              lang={lang}
              systemId={systemId}
              onChange={handleOSChange}
            />

            <hr style={dividerStyle} />

            {/* Tools */}
            <ToolSelector
              lang={lang}
              selectedTools={selectedTools}
              onToggle={handleToggleTool}
            />

            <hr style={dividerStyle} />

            {/* AI Tools */}
            <AIToolSelector
              lang={lang}
              selectedAITools={selectedAITools}
              onToggle={handleToggleAITool}
            />

            <hr style={dividerStyle} />

            {/* Platforms */}
            <PlatformSelector
              lang={lang}
              selectedPlatforms={selectedPlatforms}
              onToggle={handleTogglePlatform}
            />

            <hr style={dividerStyle} />

            {/* Environments */}
            <EnvironmentSelector
              lang={lang}
              selectedEnvironments={selectedEnvironments}
              onToggle={handleToggleEnvironment}
            />

            <hr style={dividerStyle} />

            {/* Project Scale */}
            <ProjectScale
              lang={lang}
              selectedScenarios={selectedScenarios}
              projectCounts={projectCounts}
              onChangeCount={handleProjectCountChange}
            />
          </div>

          {/* CTA: 查看完整结果 */}
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <button
              type="button"
              onClick={handleViewResults}
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: '14px 32px',
                backgroundColor: 'var(--storage-primary-action)',
                color: 'var(--storage-white)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                fontWeight: 500,
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              {i18n[lang]['action.viewResults']}
              <span style={{ display: 'inline-flex' }}>
                →
              </span>
            </button>
          </div>

          {/* Toast */}
          {toast && (
            <div
              className="fixed bottom-6 left-1/2"
              style={{
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--storage-bg-surface)',
                border: '1px solid var(--storage-border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 20px',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-body)',
                color: 'var(--storage-text-primary)',
                zIndex: 100,
                animation: 'fadeInUp 0.2s ease',
              }}
            >
              {toast}
            </div>
          )}
        </main>
      )}

      {/* S3: 结果态 */}
      {pageState === PAGE_STATE.S3 && (
        <main
          className="mx-auto px-6"
          style={{
            maxWidth: 'var(--size-max-width)',
            paddingTop: 'var(--space-xl)',
            paddingBottom: 'var(--space-2xl)',
          }}
        >
          {/* 返回调整按钮 */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <button
              type="button"
              onClick={handleBackRefine}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-caption)',
                fontWeight: 500,
                backgroundColor: 'transparent',
                color: 'var(--storage-text-primary)',
                border: '1px solid var(--storage-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              ← {i18n[lang]['action.backRefine']}
            </button>
          </div>

          {/* 结果卡片 */}
          <ResultCard
            lang={lang}
            calculation={calculation}
            selectedScenarios={selectedScenarios}
            capacityGB={capacityGB}
          />

          {/* 估算说明 */}
          <EstimationNote lang={lang} />
        </main>
      )}

      {/* Footer (S0/S1/S3 全状态) */}
      <Footer lang={lang} />
    </div>
  );
}
