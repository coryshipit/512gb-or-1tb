/**
 * Footer — 页脚
 * 无背景色,无上边框,与页面背景融为一体
 * 内容:纯本地计算声明 + 数据更新日期
 * 来源:design-spec.md "页脚" + 高保真原型
 */
import { i18n } from '../data/i18n';

export default function Footer({ lang }) {
  const t = i18n[lang];

  return (
    <footer
      style={{
        padding: '16px 24px',
        textAlign: 'center',
      }}
    >
      <p
        className="storage-caption"
        style={{
          maxWidth: 'var(--size-max-width)',
          margin: '0 auto',
        }}
      >
        {t['note.privacy']} · {t['footer.dataUpdated'].replace('{date}', '2026-07')}
      </p>
    </footer>
  );
}
