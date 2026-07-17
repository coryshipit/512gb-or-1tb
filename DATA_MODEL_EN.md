[中文版本](DATA_MODEL_ZH.md)

> **The Chinese version is the authoritative source.** All data changes must be made to [DATA_MODEL_ZH.md](DATA_MODEL_ZH.md) first, then synced to this translation.

# Decision Model Data Provenance

> **512GB or 1TB** — A storage capacity decision tool for developers, designers, and creators.
> This document records the source and basis for every data point in the calculation engine, supporting both manual review and LLM cross-validation.

---

## 1. Estimation Methodology

### 1.1 Core Principle

**"Better vaguely right than precisely wrong."** This tool does not pursue byte-level accuracy. Its goal is to help users cross the decision threshold of "512GB or 1TB?"

### 1.2 Single-Estimate Definition

Each tool/environment uses a **single estimated value** (GB), defined as:

> **Reasonable disk usage after approximately one year of normal use.**

This implicitly bundles installation footprint, user cache, and growth bloat into one number, without exposing them as independent dimensions — avoiding the trap of chasing unobservable cache precision.

### 1.3 Tool Layer vs. Project Layer Attribution

To prevent double-counting the same data across tool and project layers, the following boundary is defined (confirmed by GPT / GLM / Kimi cross-validation):

```
Tool layer = globally shared (binaries + global cache + global plugins + multi-version residue)
Project layer = per-project exclusive (node_modules / venv / target / .git / Library / build artifacts)
```

| Data | Layer | Rationale |
|------|:--:|------|
| `node_modules` | Project | npm explicitly installs dependencies within project directory |
| Git `.git` directory, LFS objects | Project | Belongs to repository; not part of global tooling |
| Python project-local venv | Project | `venv/` inside project; conda base stays at tool layer |
| Rust `target/` build directory | Project | Per-project, not shared |
| Unity `Library/` | Project | Project-level asset cache, one-to-one with project |
| Xcode DerivedData | Tool | Xcode-managed, shared across projects |
| Gradle global cache | Tool | `~/.gradle/caches` shared by all projects |

### 1.4 Source Confidence Tiers

| Tier | Definition | Example |
|:----:|------|------|
| **A** | Official docs/store pages explicitly listing disk space requirements | Steam page "Requires XX GB available space" |
| **B** | Verifiable from official channels | npm `unpackedSize`, GitHub Release package size |
| **C** | Community consensus (cross-post verification) or live measurement | User-measured install folder size |
| **D** | Reasonable estimate, marked "(estimated)" | Lesser-known tools with no public data; extrapolated from similar software |

---

## 2. Operating Systems

| Item | Estimate | Tier | Basis |
|------|:---:|:--:|------|
| macOS (incl. Homebrew) | **75GB** | C | Fresh install ~30GB + Homebrew & formulas ~35GB + cache |
| Windows (incl. WinGet) | **80GB** | C | Fresh install ~40GB + drivers/updates ~30GB + buffer |
| Linux | **45GB** | C | Common distro fresh install 30-40GB + package manager cache |

---

## 3. AI Tools

> **Measurement source**: Live measurements via Windows Settings → Apps → Installed apps; npm data from registry.npmjs.org official API.

| Tool | Measured Install | Annual Bloat | **Estimate** | Tier | Old Value |
|------|:---:|:---:|:---:|:--:|:---:|
| **ChatGPT** | 1.97GB (live) | +50% (conversation cache, 1yr) | **3GB** | C | 10GB |
| **Cursor** | 1.07GB (live, v0.45.14) | +87% (extensions+index+version residue) | **2GB** | C | 3GB |
| **Claude Code** | 241MB (npm unpackedSize) | +300% (MCP plugins+session logs+versions) | **1GB** | B | 10GB |
| **GitHub Copilot** | 300MB (live) | +70% (extension auto-updates) | **0.5GB** | C | 2GB |

> **Note**: ChatGPT and Copilot live measurements from Windows system app list, excluding `AppData` user cache. Annual bloat coefficients already cover cache growth.

---

## 4. Development Tools

> Community consensus and experience-based estimates. Individual entries note calculation logic.

| Tool | Estimate | Tier | Basis |
|------|:---:|:--:|------|
| **VS Code** | 2GB | C | Core ~400MB + extensions (5-20) ~1-2GB |
| **Git** | 0.5GB | C | Binary + global config only. Repo `.git` & LFS objects belong to project layer |
| **GitHub Desktop** | 1GB | D | Electron app ~400MB + repo metadata cache |
| **Node.js** | 6GB | C | nvm multi-version + npm global packages + npx cache only. Project `node_modules` belongs to project layer |
| **Python** | 6GB | C | conda base env + pip global cache only. Project-local venv belongs to project layer |
| **Rust** | 8GB | C | Rustup toolchain + cargo registry cache only. Project `target/` belongs to project layer |
| **Xcode** | 60GB | B | Xcode.xip ~15GB + simulators ~20GB + DerivedData ~25GB |
| **Android Studio** | 40GB | B | IDE ~5GB + SDK ~15GB + AVD images ~10GB + Gradle global cache ~10GB |
| **WeChat DevTools** | 5GB | D | Core ~2GB (nwjs+plugins) + build cache ~3GB |
| **Figma** | 2GB | C | Electron desktop ~2GB, lightweight caching |
| **Adobe / Affinity** | 30GB | C | PS+AI+AE ≈ 15GB, Affinity suite ≈ 6GB + scratch disk |
| **Unity** | 30GB | B | Hub + engine + multi-version + Asset Store cache. Project `Library/` belongs to project layer |
| **Unreal Engine** | 120GB | C | Editor 40-60GB + multi-platform targets 30-40GB + Marketplace cache |
| **Blender** | 5GB | C | Installed ~2GB + plugins & cache ~3GB |
| **DaVinci Resolve** | 7GB | C | Installed ~5GB + Fusion cache + plugins (project media & render cache belong to project files) |

### 4.1 Design Assets (Removed)

The original entry "Design Assets" (design resource accumulation, 50GB, Tier D) has been removed. Cross-project reusable design assets (icons, fonts, templates, reference materials) are now reflected in the **Designer scenario per-project size** (8GB/project, including ~3GB asset reference buffer).

---

## 5. Target Platforms

| Platform | Estimate | Tier | Basis |
|------|:---:|:--:|------|
| **Web** | 0GB | A | Browser is built-in; build tools already counted in Node.js |
| **Windows** | 5GB | D | SDK + runtime install residue buffer |
| **macOS** | 5GB | D | Same as above |
| **Linux** | 5GB | D | Same as above |
| **iOS** | 5GB | B | SDK+simulators already in Xcode (60GB); certificates/archives/symbol files only |
| **Android** | 5GB | B | SDK+AVD already in Android Studio (40GB); same as above |
| **WeChat Mini Program** | 5GB | D | Already in WeChat DevTools; extra mini-program package cache |

> **Note**: iOS / Android platform revised from 20GB to 5GB on 2026-07-17, excluding overlap with SDK tooling.

---

## 6. Runtime Environments

| Environment | Estimate | Tier | Basis |
|------|:---:|:--:|------|
| **Docker** | 50GB | C | Desktop ~5GB + images ~30GB + volume data ~15GB |
| **Windows VM** | 120GB | C | VHDX dynamic expansion; recommended reserve 80-120GB |
| **Linux VM** | 50GB | C | Common allocation 30-50GB |
| **Dual Boot** | 150GB | C | Boot Camp / Linux partition 100-200GB |

---

## 7. Use Scenarios & Per-Project Sizes

| Scenario | Default OS | Per-Project | Tier | Basis |
|------|------|:---:|:--:|------|
| **Web Development** | macOS | 3GB | D | Source + node_modules + build output |
| **Mobile Development** | macOS | 4GB | D | Source + Pods/Gradle + IPA/APK output |
| **Desktop Development** | macOS | 5GB | D | Includes Electron deps or .NET build output |
| **Designer** | macOS | 8GB | D | ~5GB project files + 3GB asset reference buffer |
| **Game Development** | Windows | 35GB | D | Source + assets (models/textures/audio) + Library/build cache |
| **Content Creation** | macOS | 20GB | D | Raw footage + editing projects + rendered output (multiple versions) |

> **Note**: All Tier D estimates. Highly dependent on individual habits. This is the most uncertain part under the "vaguely right" principle.

---

## 8. Safety Redundancy (Fixed Tiers)

| Capacity | Redundancy |
|------|:---:|
| 256GB | 30GB |
| 512GB | 50GB |
| 1TB | 80GB |
| 2TB | 100GB |

> Product rule, not technical data.

---

## 9. Status Classification & Recommended Capacity

| Rule | Definition |
|------|------|
| Status thresholds | Remaining <10% → Tight; 10%-20% → Manageable; 20%-40% → Comfortable; >40% → Spacious |
| Recommended capacity | Total used (incl. redundancy) <180GB → 256; 180-400 → 512; 400-850 → 1TB; >850 → 2TB |

> Product rule, not technical data.

---

## 10. Cross-Validation Guide

> The following content is provided for feeding to other LLMs for independent validation.

### Validation Task

You are a storage capacity estimation expert. The document above defines the data model for a new-computer storage needs calculator. Please complete the following tasks:

1. **Review all estimates in Sections 2–7 item by item.** Judge whether each value is reasonable. If reasonable, reply "✅". If disputed, provide your recommended value and basis.
2. **For Tier D entries, provide what you consider a more reasonable range** (e.g., "3-8GB, median 5GB").
3. **For Section 7 per-project sizes**, give your experience-based judgment per scenario — the typical disk usage of a median project in that scenario.
4. **Output format:**

```
| Item | Original Value | Your Verdict | Recommended Value or Range | Brief Rationale |
|------|---------------|-------------|---------------------------|-----------------|
```

### Guidelines When Responding

- You are an independent third party. You need not agree with the original. Even if you judge it "generally reasonable," provide your own independent estimate for cross-comparison.
- If your estimate deviates >30% from the original, briefly explain why in the rationale.
- Do not say "it depends on usage habits" without giving a number — provide a reasonable median estimate and its range.

---

## Version History

| Date | Changes |
|------|------|
| 2026-07-17 | v1: Initial version. AI Tools 4 items revised via live measurement; iOS/Android platform 20→5GB; Design Assets removed; Designer per-project 5→8GB |
| 2026-07-17 | v2: Tool/Project layer boundary separation (GPT/GLM/Kimi cross-validation). Git 1→0.5, Node.js 15→6, Python 10→6, Rust 15→8, Unity 50→30, DaVinci Resolve 5→7; Game Development per-project 30→35, Content Creation per-project 15→20 |
