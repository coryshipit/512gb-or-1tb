/** @type {import('tailwindcss').Config} */
// Token 来源：设计系统 .design_library/512gb-or-1tb/colors_and_type.css (v1.1.0)
// 暗色模式专用，prefix: storage / state
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // 暗色模式：通过 class 控制（html.dark），本项目固定暗色
  darkMode: 'class',
  theme: {
    extend: {
      // 背景层级（5 层）
      colors: {
        // background
        'storage-bg-base': '#0b1326',
        'storage-bg-secondary': '#131b2e',
        'storage-bg-elevated': '#171f33',
        'storage-bg-surface': '#222a3d',
        'storage-bg-overlay': '#2d3449',
        // text
        'storage-text-primary': '#dae2fd',
        'storage-text-secondary': '#c3c6d7',
        'storage-text-tertiary': '#8d90a0',
        'storage-white': '#ffffff',
        // primary
        'storage-primary': '#b4c5ff',
        'storage-primary-action': '#2563eb',
        'storage-primary-hover': '#1d4ed8',
        // border
        'storage-border': '#334155',
        'storage-border-hover': '#475569',
        'storage-border-active': '#4a5a8a',
        // state
        'state-critical': '#ef4444',
        'state-manageable': '#f59e0b',
        'state-comfortable': '#3b82f6',
        'state-abundant': '#10b981',
        // progress bar segments
        'storage-seg-system': '#6366f1',
        'storage-seg-tools': '#8b5cf6',
        'storage-seg-ai': '#ec4899',
        'storage-seg-platform': '#64748b',
        'storage-seg-env': '#f59e0b',
        'storage-seg-project': '#06b6d4',
        'storage-seg-redundant': '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'storage-h1': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'storage-h2': ['24px', { lineHeight: '1.35', fontWeight: '600' }],
        'storage-h3': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'storage-body': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'storage-caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'storage-mono': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'storage-mono-lg': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
      },
      borderRadius: {
        'storage-sm': '4px',
        'storage-md': '8px',
        'storage-lg': '12px',
        'storage-full': '9999px',
      },
      spacing: {
        'storage-xs': '4px',
        'storage-sm': '8px',
        'storage-md': '16px',
        'storage-lg': '24px',
        'storage-xl': '32px',
        'storage-2xl': '48px',
      },
      maxWidth: {
        'storage-content': '800px',
      },
      height: {
        'storage-header': '56px',
      },
    },
  },
  plugins: [],
};
