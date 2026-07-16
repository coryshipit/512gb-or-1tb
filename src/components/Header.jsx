/**
 * Header — 顶部导航
 * 固定顶部,高度 56px
 * 左侧:产品名(JetBrains Mono, brand primary)
 * 右侧:语言切换 + GitHub 链接
 * 来源:design-spec.md "顶部导航" + 高保真原型 S0/S1/S3
 */
import { Github } from 'lucide-react';
import { i18n } from '../data/i18n';

export default function Header({ lang, onToggleLang }) {
  const t = i18n[lang];
  const isActive = (targetLang) => lang === targetLang;

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        height: 'var(--size-header-height)',
        backgroundColor: 'var(--storage-bg-elevated)',
        borderBottom: '1px solid var(--storage-border)',
      }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between px-6"
        style={{ maxWidth: 'var(--size-max-width)' }}
      >
        {/* Logo */}
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--storage-primary)',
          }}
        >
          {t['app.title']}
        </span>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <span
            className="whitespace-nowrap"
            style={{ fontSize: '0.875rem' }}
          >
            <button
              type="button"
              onClick={() => isActive('zh') || onToggleLang()}
              style={{
                background: 'none',
                border: 'none',
                cursor: isActive('zh') ? 'default' : 'pointer',
                color: isActive('zh')
                  ? 'var(--storage-text-primary)'
                  : 'var(--storage-text-tertiary)',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                padding: 0,
                transition: 'color 0.15s ease',
              }}
              aria-label={t['lang.aria.zh']}
            >
              {t['lang.zh']}
            </button>
            <span style={{ color: 'var(--storage-text-tertiary)' }}> / </span>
            <button
              type="button"
              onClick={() => isActive('en') || onToggleLang()}
              style={{
                background: 'none',
                border: 'none',
                cursor: isActive('en') ? 'default' : 'pointer',
                color: isActive('en')
                  ? 'var(--storage-text-primary)'
                  : 'var(--storage-text-tertiary)',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                padding: 0,
                transition: 'color 0.15s ease',
              }}
              aria-label={t['lang.aria.en']}
            >
              {t['lang.en']}
            </button>
          </span>

          {/* GitHub link */}
          <a
            href="https://github.com/coryshipit/512gb-or-1tb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 whitespace-nowrap"
            style={{
              color: 'var(--storage-text-tertiary)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'color 0.15s ease',
            }}
          >
            <Github style={{ width: 16, height: 16 }} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
