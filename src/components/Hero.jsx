/**
 * Hero — 首屏介绍
 * S0 空状态:单行标题居中,无副标题
 * S1/S3:不展示
 * 来源:design-spec.md "首屏（Hero）" + 高保真原型 S0
 */
import { i18n } from '../data/i18n';

export default function Hero({ lang }) {
  const t = i18n[lang];

  return (
    <section
      className="mx-auto text-center"
      style={{
        maxWidth: 'var(--size-max-width)',
        padding: '48px 24px 32px',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--font-size-h1)',
          fontWeight: 'var(--font-weight-h1)',
          lineHeight: 'var(--line-height-h1)',
          color: 'var(--storage-text-primary)',
          textWrap: 'balance',
          wordBreak: 'keep-all',
          overflowWrap: 'break-word',
        }}
      >
        {t['hero.headline']}
      </h1>
    </section>
  );
}
