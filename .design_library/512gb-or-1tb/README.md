# 512GB or 1TB Design System

> **Version 1.1.0** · Dark-only · 105 CSS variables · Mixed A+B+C strategy

A purpose-built design system for the "512GB or 1TB" storage capacity calculator. Token values now reflect the **mixed A+B+C visual strategy** — not prototype placeholders. **Direction A** (precision instrument base) provides the disciplined dark foundation with border-driven hierarchy and zero shadows. **Direction B** (data visualization weight) drives the segmented progress bar system, elevating the result capacity readout to 32px mono and introducing 8 dedicated segment color tokens. **Direction C** (breathing room) expands card padding to 32px and hero H1 to 40px, keeping the interface calm and scannable.

---

## File Structure

```
512gb-or-1tb/
├── README.md                  <- This file (design system documentation)
├── colors_and_type.css        <- 105 CSS variables + typography classes + component utility classes
├── specs/
│   └── design-spec.md         <- Full design specification (source of rules)
└── components/
    └── index.json             <- Component index (6 components)
```

**Token count:** 105 CSS variables across 8 groups (background, text, primary, border, state, segment, radius/typography/spacing/size/shadow, portable aliases).

## How to Use

### Link the CSS

```html
<link rel="stylesheet" href="colors_and_type.css">
```

### Reference Tokens

All tokens are defined under `:root`. Use source tokens (`--storage-*`) or portable aliases (`--color-*`):

```css
.card {
  background: var(--storage-bg-elevated);
  border: 1px solid var(--storage-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);               /* Direction C: 32px breathing room */
}
```

### Typography Utility Classes

`.storage-h1` · `.storage-h2` · `.storage-h3` · `.storage-body` · `.storage-caption` · `.storage-mono` · `.storage-mono-lg`

### Component Utility Classes

`.storage-card` · `.storage-card-surface` · `.storage-btn-primary` · `.storage-btn-secondary` · `.storage-tag` · `.storage-tag-active` · `.storage-badge` (+ `-critical` / `-manageable` / `-comfortable` / `-abundant`) · `.storage-input` · `.storage-checkbox-label` · `.storage-divider`

---

## 1. Color Tokens

### Background Hierarchy

| Token | Portable Alias | Hex | Usage |
|-------|---------------|-----|-------|
| `--storage-bg-base` | `--color-bg-base` | `#0b1326` | Page base background (deep blue-black, not pure black) |
| `--storage-bg-elevated` | `--color-bg-elevated` | `#171f33` | Cards, panels |
| `--storage-bg-surface` | `--color-bg-surface` | `#222a3d` | Nested surfaces, secondary containers, inputs |
| `--storage-bg-overlay` | `--color-bg-overlay` | `#2d3449` | Overlay surfaces, unselected tags, progress bar track |

> Semantic aliases: `--storage-background` -> base, `--storage-card` -> elevated, `--storage-muted` -> surface. Four-layer depth without shadows. `--storage-bg-surface` updated from `#1e2740` to `#222a3d` to align with `design-spec.md` slate scale.

### Text Hierarchy

| Token | Portable Alias | Hex | Usage |
|-------|---------------|-----|-------|
| `--storage-text-primary` | `--color-text-primary` | `#dae2fd` | Headlines, body text |
| `--storage-text-secondary` | `--color-text-secondary` | `#c3c6d7` | Descriptions, labels |
| `--storage-text-tertiary` | `--color-text-tertiary` | `#8d90a0` | Helper text, placeholders, dates |

> `--storage-text-secondary` updated from `#a0a8c0` to `#c3c6d7` for improved legibility on dark surfaces, aligning with `design-spec.md`.

### Primary / Accent Colors

| Token | Portable Alias | Value | Usage |
|-------|---------------|-------|-------|
| `--storage-primary` | `--color-primary` | `#b4c5ff` | Light blue: selected text, links, icon highlights |
| `--storage-primary-action` | `--color-primary-action` | `#2563eb` | Action blue: button backgrounds, selected borders, active states |
| `--storage-primary-hover` | `--color-primary-hover` | `#1d4ed8` | Hover state for action blue |
| `--storage-primary-subtle` | `--color-primary-subtle` | `rgba(37,99,235,0.08)` | Action blue tint: selected tag/card backgrounds (Direction C) |

> `--storage-primary-subtle` was updated from `rgba(180,197,255,0.08)` to `rgba(37,99,235,0.08)` to align the selected-state tint with the action blue (`#2563eb`) rather than the light display blue.

### Border Colors

| Token | Portable Alias | Hex | Usage |
|-------|---------------|-----|-------|
| `--storage-border` | `--color-border` | `#334155` | Default borders, dividers |
| `--storage-border-hover` | `--color-border-hover` | `#475569` | Hover state borders |
| `--storage-border-active` | `--color-border-active` | `#4a5a8a` | Active/focus state borders |

> Border values updated from `#2a3450` / `#3d4868` to `#334155` / `#475569` (slate-700 / slate-600) for alignment with `design-spec.md`.

### State Colors

| State | Text Token | Hex | Background Token | Background Value | Semantic |
|-------|-----------|-----|-----------------|-----------------|----------|
| Critical | `--state-critical` | `#ef4444` | `--state-critical-bg` | `rgba(239,68,68,0.1)` | Remaining < 10%, not recommended |
| Manageable | `--state-manageable` | `#f59e0b` | `--state-manageable-bg` | `rgba(245,158,11,0.1)` | Remaining 10-20%, recommend upgrade |
| Comfortable | `--state-comfortable` | `#3b82f6` | `--state-comfortable-bg` | `rgba(59,130,246,0.1)` | Remaining 20-40% |
| Abundant | `--state-abundant` | `#10b981` | `--state-abundant-bg` | `rgba(16,185,129,0.1)` | Remaining > 40% |

> `--state-abundant` updated from `#22c55e` to `#10b981` (emerald) for better contrast on dark backgrounds. State backgrounds use 10% opacity; state text uses full opacity.

### Progress Bar Segment Colors

Eight dedicated segment tokens (Direction B -- data visualization weight):

| Segment | Token | Color | Source |
|---------|-------|-------|--------|
| System | `--storage-seg-system` | `#6366f1` | Direction B |
| Tools | `--storage-seg-tools` | `#8b5cf6` | Direction B |
| AI Tools | `--storage-seg-ai` | `#ec4899` | Direction B |
| Target Platform | `--storage-seg-platform` | `#64748b` | Direction B |
| Runtime / Env | `--storage-seg-env` | `#f59e0b` | Direction B |
| Project Files | `--storage-seg-project` | `#06b6d4` | Direction B |
| Safety Reserve | `--storage-seg-redundant` | `#64748b` | Direction B |
| Remaining | `--storage-seg-remaining` | `transparent` | Direction B |

> Segment colors use a multi-hue palette (indigo, violet, pink, slate, amber, cyan) for maximum distinguishability on dark backgrounds. The remaining segment is transparent; the track color shows through. Previous versions referenced segment colors only in `specs/design-spec.md` with a different palette -- these tokens are now authoritative.

### Token Naming Convention

| Prefix | Purpose | Example |
|--------|---------|---------|
| `--storage-*` | Source tokens (bg, text, primary, border, seg) | `--storage-bg-base` |
| `--state-*` | State color tokens | `--state-critical` |
| `--color-*` | Portable aliases (map to `--storage-*` / `--state-*`) | `--color-bg-base` |
| `--type-*` | Typography size aliases | `--type-h1` |
| `--radius-*` | Border radius | `--radius-md` |
| `--space-*` | Spacing | `--space-xl` |
| `--font-*` | Font family and size | `--font-sans` |
| `--size-*` | Layout constants (max-width, heights, progress bar) | `--size-max-width` |

---

## 2. Typography

### Font Families

| Usage | Token | Stack |
|-------|-------|-------|
| UI interface | `--font-sans` | `'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif` |
| Numbers / labels | `--font-mono` | `'JetBrains Mono', 'Fira Code', 'Consolas', monospace` |

- **Inter** does not include Chinese glyphs; falls back to PingFang SC / Microsoft YaHei.
- **JetBrains Mono** is used for capacity numbers, GB values, subtotals, label text, and log-style copy.

### Font Size Scale

| Level | Token | Size | Weight | Line Height | Usage |
|-------|-------|------|--------|-------------|-------|
| H1 | `--font-size-h1` | 40px | 700 | 1.3 | Hero title (Direction C S0 ceremony, 2.5rem) |
| H2 | `--font-size-h2` | 24px | 600 | 1.35 | Section title |
| H3 | `--font-size-h3` | 18px | 600 | 1.4 | Card title |
| Body | `--font-size-body` | 14px | 400 | 1.6 | Body text, descriptions |
| Caption | `--font-size-caption` | 12px | 400 | 1.5 | Helper text, copyright |
| Mono | `--font-size-mono` | 14px | 500 | -- | Labels, small numbers |
| Mono-lg | `--font-size-mono-lg` | 32px | 600 | -- | Result capacity readout (Direction B S3, 2rem) |

> H1 was increased from 32px to 40px (2.5rem) for Direction C hero ceremony. Mono-lg was increased from 24px to 32px (2rem) for Direction B result capacity readout prominence. Typography classes (`.storage-h1` through `.storage-mono-lg`) match these token values exactly.

### Font Weight Rules

| Weight | Usage |
|--------|-------|
| 700 | H1 hero title only |
| 600 | H2/H3 titles, Mono-lg large numbers |
| 500 | Button text, Mono labels, group headings |
| 400 | Body, descriptions, helper text |

### Number + Unit Spacing Convention

- Capacity units: **no space** between number and unit: `512GB`, `1TB`, `50GB`
- Percentages: **no space**: `53%`
- Chinese and numbers: **one space**: `剩余 53%`, `25 个项目`
- Bracketed annotations: **no space inside**: `[2GB]`, `[15GB]`
- All numbers and units use JetBrains Mono monospace font

---

## 3. Spacing System

Base unit: **8px**. Six-level token scale:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Micro gaps (icon-text gap, tag inner padding) |
| `--space-sm` | 8px | Tight spacing (intra-component elements) |
| `--space-md` | 16px | Standard padding, mobile card padding |
| `--space-lg` | 24px | Component spacing |
| `--space-xl` | 32px | Card padding (Direction C breathing room) |
| `--space-2xl` | 48px | Section spacing (Direction C breathing room) |

**Usage rules:**
- Section-to-section: **48px** (`--space-2xl`, Direction C breathing room)
- Card padding: **32px** (`--space-xl`, Direction C -- was 24px in v1.0.0)
- Mobile global padding reduced to **16px** (`--space-md`)

---

## 4. Radius and Shadow

### Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements (checkboxes) |
| `--radius-md` | 8px | Buttons, inputs, secondary containers |
| `--radius-lg` | 12px | Cards, panels, progress bars |
| `--radius-full` | 9999px | Tags, badges (pill shape) |
| `--size-progress-bar-radius` | 9999px | Result progress bar full-rounded ends (Direction C) |

> Button radius must not exceed 12px. Only Tag, Badge, and the result progress bar use `full` pill shape. `--size-progress-bar-radius` is a Direction C addition that gives the S3 result bar fully rounded segment ends.

### Shadow

| Token | Value | Note |
|-------|-------|------|
| `--shadow-none` | `none` | No shadow |
| `--shadow-sm` | `none` | Card level (intentionally none) |
| `--shadow-md` | `none` | Float level (intentionally none) |
| `--shadow-lg` | `none` | Modal level (intentionally none) |

**Design decision:** All shadows are set to `none` intentionally. Hierarchy is achieved entirely through **1px borders** and the multi-level background scale. This is the core of Direction A (precision instrument): in dark mode, borders and background layers are clearer and more restrained than shadows. Glassmorphism and diffuse shadows are prohibited.

---

## 5. Icon Rules

| Rule | Detail |
|------|--------|
| Library | Lucide React (lightweight, unified line style) |
| Format | SVG only; no raster icons (PNG/JPG) |
| 16px | Inline icons (inside buttons, beside text) |
| 20px | Mini result bar icons |
| 24px | Scenario selection card icons |
| Color | Follows text hierarchy: unselected `--storage-text-secondary`, selected `--storage-primary` |

Primary icons: hard drive, tools, code, design, phone, computer, container, chip, etc.

---

## 6. Component States

| State | Visual Treatment |
|-------|-----------------|
| Default | Surface background + default border `--storage-border` (`#334155`) + secondary text |
| Hover | Border switches to `--storage-border-hover` (`#475569`) |
| Focus-visible | Primary border `--storage-primary-action` + subtle ring |
| Selected | Primary fill `--storage-primary-action` OR primary border + `--storage-primary-subtle` (`rgba(37,99,235,0.08)`) background |
| Recommended | Amber border `--state-manageable` + transparent background + star marker |
| Disabled | `opacity: 0.4` + `cursor: not-allowed` |

**Selected vs Recommended visual distinction:** Solid fill (strong visual weight) vs border outline + star (weak visual weight). The two states never compete for attention. The selected-state subtle background now uses the action blue tint (`rgba(37,99,235,0.08)`) rather than the light display blue, ensuring consistency with the action blue used for borders and fills.

---

## 7. Form Rules

| Control Type | Implementation | Notes |
|-------------|---------------|-------|
| Multi-select | Checkboxes + `[sizeGB]` annotations | e.g. `[2GB]`, `[15GB]` |
| Single-select | Button groups (NOT dropdowns) | e.g. OS three-way, capacity four-way |
| Range | Sliders 1-50 | JetBrains Mono displays current count |
| Text input | Reserved for future use | Not used in current version |

**Prohibited:** No radio buttons (single-select uses button groups). No dropdowns / `<select>` (all options are laid flat).

---

## 8. Feedback and Notification Rules

| Feedback Type | Implementation | Notes |
|--------------|---------------|-------|
| Status colors | Semantic only (red/amber/blue/green) | Never used decoratively |
| Inline prompt | Below capacity selector | Amber text "推荐选择更大容量" |
| Mini result bar | S1 config state, sticky below header | Real-time progress feedback; status color changes with remaining space |
| Toast | Reserved for OS switch warnings | v0.1.0 implementation; auto-dismiss after 3s |

**Prohibited:** No modals. No popovers.

---

## 9. Dark Mode Rules

- **Dark-only:** This design system has no light mode.
- **Background:** `#0b1326` (deep blue-black), not pure black `#000000`, to maintain warmth.
- **Surface:** `#222a3d` (updated from `#1e2740` to align with `design-spec.md` slate scale).
- **Borders:** `#334155` (updated from `#2a3450`, slate-700 -- visible but quiet on dark backgrounds).
- **Text secondary:** `#c3c6d7` (updated from `#a0a8c0` for improved legibility).
- **Hierarchy:** Via 4-level background scale + 1px borders only. No shadows.
- **No glassmorphism:** `backdrop-filter` is prohibited (mobile performance risk, conflicts with restrained style).
- **State color rule:** Backgrounds at 10% opacity, text at full opacity.
- **Visual禁区:** No gradient backgrounds, no 3D effects, no pure black background, no decorative illustrations.

---

## 10. Platform Adaptation Rules

### Progress Bar Sizing

Four size tokens govern progress bar dimensions (Direction B + C):

| Token | Value | Usage |
|-------|-------|-------|
| `--size-progress-bar-height` | 24px | Standard segmented bar (desktop) |
| `--size-progress-bar-result` | 32px | S3 result area segmented bar (Direction B -- was 24px) |
| `--size-progress-bar-mobile` | 20px | Standard segmented bar (mobile) |
| `--size-progress-bar-mini` | 16px | Mini result bar, S1 compact (Direction B -- was 12px) |
| `--size-progress-bar-radius` | 9999px | Full-rounded segment ends (Direction C) |

> The result bar (32px) is the data visualization hero -- 8 segments colored via `--storage-seg-*` tokens, with fully rounded ends (`--size-progress-bar-radius`). The mini bar (16px) provides compact real-time feedback in S1. The three primary height contexts are: standard (24px desktop / 20px mobile), result (32px), and mini (16px).

### Breakpoints

| Breakpoint | Width | Layout Change |
|-----------|-------|--------------|
| sm | < 640px | Single column, tight spacing, full-width cards |
| md | 640px - 767px | Single column, standard spacing |
| lg+ | >= 768px | Single column, max-width 800px centered |

### Layout Rules

- Unified **single-column layout** across all breakpoints; max-width `--size-max-width: 800px`, centered.
- Mobile (< 768px): full-width cards, 16px padding, selectors stack vertically.
- Header height: 56px (`--size-header-height`).
- All interactions are accessible on touch devices.

---

## Component Inventory

This design system includes **6 core components**:

| Component | Slug | Variants | Key Insight |
|-----------|------|----------|-------------|
| Button | `button` | 5 | Primary solid / secondary outline / recommended amber border |
| Card | `card` | 4 | Elevated bg + 12px radius + 32px padding (`--space-xl`), border-only hierarchy |
| Tag | `tag` | 3 | 9999px pill, JetBrains Mono labels, active = primary border + subtle action-blue bg |
| Badge | `badge` | 4 | Status badges: 10% bg + full-color text, semantic only |
| Progress Bar | `progress-bar` | 3 | 8-segment (7 colored + transparent remainder), 3 height tokens (24/32/16px) + full-rounded radius |
| Form Control | `form-control` | 3 | Checkbox/button-group/slider; no radio, no dropdown |

---

## Caveats / Known Substitutions

1. **Progress bar segment colors** are now defined as CSS tokens (`--storage-seg-system` through `--storage-seg-remaining`) in `colors_and_type.css`. Previous versions referenced segment colors only in `specs/design-spec.md` with a different palette. The CSS tokens are authoritative.
2. **Spec vs CSS alignment:** Token values have been updated to match `design-spec.md`. Background surface (`#222a3d`), border (`#334155`), text-secondary (`#c3c6d7`), and state-abundant (`#10b981`) now align with the spec's slate-based scale.
3. **`--storage-max-width: 1200px`** (legacy) has been removed. It conflicted with `--size-max-width: 800px`. Use `--size-max-width` exclusively.
4. **Icons** depend on the Lucide React library, which must be installed as a project dependency.
5. **Chinese fallback:** Inter lacks Chinese glyphs and relies on system PingFang SC / Microsoft YaHei fallback.
