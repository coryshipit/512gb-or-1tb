/**
 * EstimationNote — 估算说明
 * 独立 section,位于结果区域之后、页脚之前
 * 内容:声明文案 + 保留空间建议 + 隐私声明 + 数据更新日期
 * 来源:design-spec.md "估算说明" + 高保真原型 S3
 */
import { i18n } from '../data/i18n';

export default function EstimationNote({ lang }) {
  const t = i18n[lang];

  const noteStyle = {
    backgroundColor: 'var(--storage-bg-surface)',
    border: '1px solid var(--storage-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    marginTop: 'var(--space-md)',
  };

  // 四行文案统一样式（对齐原型 s3-results.html .note-text）
  const noteTextStyle = {
    margin: 0,
    fontSize: 'var(--font-size-caption)',
    lineHeight: 'var(--line-height-caption)',
    color: 'var(--storage-text-tertiary)',
  };

  return (
    <div style={noteStyle}>
      <h3
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--font-size-body)',
          fontWeight: 600,
          color: 'var(--storage-text-secondary)',
          margin: 0,
        }}
      >
        {t['note.title']}
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          marginTop: 'var(--space-sm)',
        }}
      >
        <p style={noteTextStyle}>· {t['note.disclaimer']}</p>
        <p style={noteTextStyle}>· {t['note.reserve']}</p>
        <p style={noteTextStyle}>· {t['note.privacy']}</p>
        <p style={noteTextStyle}>· {t['note.dataDate'].replace('{date}', '2026-07')}</p>
      </div>
    </div>
  );
}
