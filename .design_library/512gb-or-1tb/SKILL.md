---
name: 512gb-or-1tb-design
description: Use this skill to generate well-branded interfaces for the 512GB or 1TB storage capacity calculator. Dark-only design system with a precision-instrument aesthetic, containing 105 CSS variables, colors, type, fonts, and 6 components for prototyping tool UIs.
user-invocable: true
---

# 512GB or 1TB Design Skill

A lightweight, dark-only design system for a storage capacity calculator tool. Token values reflect the **mixed A+B+C visual strategy** (not prototype placeholders). Read `colors_and_type.css` for runtime tokens, `components/{slug}.json` for component contracts, and `specs/design-spec.md` for the source rules.

If creating visual artifacts, link `colors_and_type.css` and build static HTML. If working on production code, read the rules here to become an expert in designing with this brand.

## Quick Map

- `colors_and_type.css` — drop-in CSS variables (105 tokens: background, text, primary, border, state, segment, radius, typography, spacing, shadow, size)
- `components/index.json` — 6-component index with variant counts
- `components/{slug}.json` — per-component contracts (intent, variants, anatomy, do-not-invent)
- `specs/design-spec.md` — source design rules, interaction flows, visual禁区

## 1. Identity

- **Name:** 512gb-or-1tb
- **Display Name:** 512GB or 1TB Design System
- **Version:** 1.1.0
- **Type:** Lightweight design system for a storage capacity calculator tool
- **Source:** Structured spec (`design-spec.md` + `colors_and_type.css` with mixed A+B+C strategy tokens)
- **Theme:** Dark-only — no light mode, no theme toggle

## 2. Token System

Source: `colors_and_type.css` (dark-only; prefixes `--storage-*`, `--color-*`, `--state-*`). 105 CSS variables.

- **Background** — `--storage-bg-base` `#0b1326` -> `bg-elevated` `#171f33` -> `bg-surface` `#222a3d` -> `bg-overlay` `#2d3449`. Four-layer depth without shadows.
- **Text** — `--storage-text-primary` `#dae2fd`, `--storage-text-secondary` `#c3c6d7`, `--storage-text-tertiary` `#8d90a0`.
- **Primary** — `--storage-primary` `#b4c5ff` (selected text/links/icon highlight), `--storage-primary-action` `#2563eb` (buttons/active borders), `--storage-primary-hover` `#1d4ed8`, `--storage-primary-subtle` `rgba(37,99,235,0.08)` (action blue tint for selected state — Direction C).
- **Border** — `--storage-border` `#334155`, `--storage-border-hover` `#475569`, `--storage-border-active` `#4a5a8a`.
- **State** — critical `#ef4444` (<10% remaining), manageable `#f59e0b` (10-20%), comfortable `#3b82f6` (20-40%), abundant `#10b981` (>40%); each paired with a 10%-opacity `*-bg` tint.
- **Segment** — 8 progress bar segment tokens: `--storage-seg-system` `#6366f1`, `--storage-seg-tools` `#8b5cf6`, `--storage-seg-ai` `#ec4899`, `--storage-seg-platform` `#64748b`, `--storage-seg-env` `#f59e0b`, `--storage-seg-project` `#06b6d4`, `--storage-seg-redundant` `#64748b`, `--storage-seg-remaining` `transparent` (Direction B data visualization weight).
- **Radius** — `--radius-sm` 4px, `--radius-md` 8px, `--radius-lg` 12px, `--radius-full` 9999px, `--size-progress-bar-radius` 9999px (Direction C full-rounded result bar ends).
- **Typography** — `--font-sans` Inter; `--font-mono` JetBrains Mono; sizes H1 40px (Direction C S0 hero, 2.5rem) / H2 24px / H3 18px / body 14px / caption 12px; mono-lg 32px (Direction B S3 result readout, 2rem).
- **Spacing** — `--space-xs` 4px, `--space-sm` 8px (base), `--space-md` 16px, `--space-lg` 24px, `--space-xl` 32px (card padding, Direction C), `--space-2xl` 48px (section spacing, Direction C).
- **Shadow** — intentionally `none` at all levels (sm/md/lg); hierarchy via borders + background layers.
- **Size** — `--size-max-width` 800px, `--size-header-height` 56px, `--size-progress-bar-height` 24px (desktop) / `--size-progress-bar-result` 32px (S3 result) / `--size-progress-bar-mobile` 20px / `--size-progress-bar-mini` 16px (mini).

## 3. Component Inventory

| Slug | Name | Variants | Description |
|------|------|----------|-------------|
| button | Button | 5 | Actions & selectors — primary/secondary CTAs, capacity (default / selected / recommended with star marker) |
| card | Card | 4 | Containers — scenario (selectable grid), config panel, result display, estimation note |
| tag | Tag | 3 | Mono pill labels — default, active (selected-scenario indicator), new (amber, user-added items) |
| badge | Badge | 4 | Status pills — critical / manageable / comfortable / abundant; semantic-only, matches progress-bar state |
| progress-bar | Progress Bar | 3 | Segmented (8-segment breakdown via `--storage-seg-*` tokens), mini (S1 compact bar), legend (color dot + label + GB) |
| form-control | Form Control | 3 | Checkbox (multi-select with `[sizeGB]`), range-slider (1-50 count), text-input (reserved) |

## 4. Design Rules

### Color
- Dark-only. Base `#0b1326` (deep blue-black, never pure black). No light mode, no theme toggle.
- 4-layer background depth: base -> elevated -> surface (`#222a3d`) -> overlay. Hierarchy via borders + bg, never shadows.
- No gradients, no glassmorphism, no `backdrop-filter`.
- Max 3 primary hues (dark blue-grey base + blue accent + state colors).

### Typography
- UI face: **Inter**. Number/label face: **JetBrains Mono**. No web-font imports beyond these.
- H1 is 40px (2.5rem, Direction C hero ceremony). Mono-lg is 32px (2rem, Direction B result readout).
- Number+unit no-space convention: `512GB`, `1TB`, `53%`, `[2GB]`. Chinese+number: one space — `剩余 53%`, `25 个`.
- All capacity / percentage / GB values use JetBrains Mono.

### Spacing
- 8px base unit (`--space-sm`). 8-pt grid: 4 / 8 / 16 / 24 / 32 / 48px.
- Section spacing 48px (`--space-2xl`) for breathing room between major blocks. Card padding 32px (`--space-xl`, Direction C — was 24px in v1.0.0).

### Border Radius
- 8px (`--radius-md`) — buttons, inputs, surface cards, progress bars.
- 12px (`--radius-lg`) — primary cards (scenario / config / result).
- 9999px (`--radius-full`) — tags & badges only; `--size-progress-bar-radius` 9999px for result bar segment ends (Direction C).
- Max button radius 12px; never rounded-full on buttons.

### Shadows
- Intentionally none (`--shadow-none` at all levels). Hierarchy comes from borders + background color layers.

### Icons
- Lucide icon library (SVG, lightweight, unified stroke style).
- Sizes 16-24px. Scenario card icons 24px; checkbox/badge icons 12px when present.

### Component States
- States: default / hover / focus-visible / selected / disabled.
- Selected state: border `#2563eb` (2px) + subtle action-blue bg `rgba(37,99,235,0.08)` (`--storage-primary-subtle`); never solid fill except capacity buttons.
- Hover: border-color shift to `--storage-border-hover` (`#475569`). Focus: border-color to `--storage-primary-action`.
- Transitions: background-color / border-color 0.15s ease.

### Form Rules
- Multi-select -> checkboxes (each with `[sizeGB]` mono annotation).
- Single-select -> button groups (OS, capacity). Selected = solid `#2563eb` fill.
- No dropdowns, no radio buttons, no `<select>`. No form validation error states (v0.1.0).

### Feedback & Notification
- Status colors are semantic only (never decorative). Badge must match progress-bar & mini-bar state.
- Inline prompts for guidance (e.g., "推荐选择更大容量" amber text). No toasts in v0.1.0.
- Recommended capacity = amber border + star marker (weak weight); never competes with selected solid fill.

### Dark Mode Rules
- Only dark mode exists. Base `#0b1326` (not `#000000`) — retains warmth.
- Surface `#222a3d`, borders `#334155` (slate-700, visible but quiet). Primary text on dark: `#dae2fd`.

### Platform Adaptation
- Single column, max-width 800px (`--size-max-width`), centered.
- sm < 640px: compact spacing, full-width cards, vertical selector stack.
- md 640-767px: single column, standard spacing.
- lg+ >= 768px: single column, 800px max centered.
- Progress bar heights: standard 24px desktop / 20px mobile; result 32px (`--size-progress-bar-result`); mini 16px (`--size-progress-bar-mini`).

## 5. Visual禁区 (Forbidden Patterns)

1. No large-area gradient backgrounds.
2. No strong/diffuse shadows — use borders + background layers for hierarchy.
3. No glassmorphism (`backdrop-filter`) — mobile perf risk, conflicts with restrained style.
4. No 3D visualization (Three.js / CSS 3D Transforms).
5. No buttons with radius > 12px.
6. No more than 3 primary colors (dark blue-grey base + blue accent + state colors).
7. No decorative illustration or icon overload.
8. No fixed background images or parallax scrolling.
9. No unnecessary animations (loading spinners, particles, real-time log streams).
10. No pure black `#000000` — use `#0b1326` to retain warmth.

## 6. Usage Examples

Link `colors_and_type.css`, then consume tokens via the portable `--color-*` / `--type-*` aliases:

```html
<!-- Selectable scenario card (selected) -->
<div class="storage-card"
     style="border-color: var(--color-primary); background: var(--color-primary-subtle);">
  <h3 class="storage-h3">Web 开发</h3>
  <span class="storage-tag storage-tag-active">已选</span>
</div>

<!-- Primary CTA button -->
<button class="storage-btn-primary">查看完整结果</button>

<!-- Selected capacity button (solid fill) -->
<button style="background: var(--color-primary-action); color: #fff;
              border-radius: var(--radius-md);">512GB</button>

<!-- Recommended capacity (amber border + star, never solid) -->
<button style="border: 2px solid var(--color-state-manageable);
              background: transparent; border-radius: var(--radius-md);">★ 1TB</button>

<!-- Status badge -->
<span class="storage-badge storage-badge-abundant">充裕</span>

<!-- Number+unit convention: no space, mono font -->
<span class="storage-mono">512GB</span> · <span class="storage-mono">53%</span>
<!-- Chinese + number: one space -->
<span class="storage-body">剩余 53%</span>
```

When generating new components, always prefer the portable `--color-*` aliases, keep radius within 4 / 8 / 12 / 9999, and never introduce shadows, gradients, or glassmorphism.
