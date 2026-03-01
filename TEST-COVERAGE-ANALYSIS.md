# Test Coverage Analysis

## Current State

The codebase has **zero tests** and **no test infrastructure**. There is no test framework installed (no vitest, jest, playwright, or similar), no test scripts in `package.json`, and no CI/CD pipeline to enforce quality gates.

This means every deployment relies entirely on manual verification.

---

## Recommended Test Strategy

Given that this is a static Astro site with i18n, data-driven content, and client-side JS interactions, the following areas would benefit most from automated testing. They are ordered by **impact-to-effort ratio** — highest value first.

---

### 1. i18n Utility Functions (Unit Tests) — HIGH PRIORITY

**Files:** `src/i18n/utils.ts`, `src/i18n/config.ts`

**Why:** These pure TypeScript functions are the backbone of the entire i18n routing system. A bug here silently breaks navigation across all 8 languages.

**What to test:**

| Function | Test cases |
|----------|-----------|
| `t(locale, key)` | Returns correct translation for valid locale+key; falls back to English when key missing in target locale; returns the raw key when missing in all locales |
| `getLocaleFromUrl(url)` | `"/"` → `"en"`, `"/vi/about"` → `"vi"`, `"/ko/renting"` → `"ko"`, `"/unknown/path"` → `"en"`, `"/en/about"` → `"en"` |
| `localizedUrl(locale, path)` | Default locale returns path unchanged; non-default locale prepends prefix; handles root path `"/"` correctly (no trailing slash like `"/vi/"`) |
| `switchLocaleUrl(path, target)` | Strips existing locale prefix and applies new one; handles switching from default to non-default and vice versa; handles root paths |
| `getNonDefaultLocales()` | Returns all locales except `"en"`; result length is 7 |

**Suggested tool:** Vitest (integrates natively with Astro's Vite-based toolchain).

---

### 2. Translation File Integrity (Unit Tests) — HIGH PRIORITY

**Files:** `src/i18n/translations/*.json` (8 files, 196 keys each)

**Why:** With 196 keys across 8 languages, it is easy for a key to be missing, misspelled, or left as a copy-paste of the English string. This is not caught at build time.

**What to test:**

- Every non-default locale file has the exact same set of keys as `en.json`
- No translation value is an empty string `""`
- Dynamic placeholders (e.g., `{year}` in `footer.copyright`) exist in all translations that use them
- No translation value is identical to its English counterpart (flag for review — may indicate untranslated content)
- All translation keys referenced in components actually exist in `en.json`

---

### 3. Data File Validation (Unit Tests) — MEDIUM PRIORITY

**Files:** `src/data/services.json`, `src/data/faq.json`, `src/data/testimonials.json`

**Why:** These JSON files drive pricing cards, FAQ accordions, and testimonials. Invalid structure (missing fields, wrong types) would cause runtime rendering errors with no warning during build.

**What to test:**

- `services.json`: Each pricing item has `id`, `name`, `price` (number), `currency`, `duration`, `description`, `features` (non-empty array), `cta`, `highlighted` (boolean). Each pillar page has `slug`, `title`, `description`, `icon`.
- `faq.json`: Is an array of objects each with `question` (string) and `answer` (string), both non-empty.
- `testimonials.json`: Has `enabled` (boolean) and `items` (array). Each item has `id`, `name`, `country`, `role`, `text`, `rating` (1-5).

---

### 4. Astro Build Smoke Test (Integration Test) — MEDIUM PRIORITY

**Why:** The Astro build process validates templates, catches import errors, and generates all static pages. A passing build is the single strongest signal that the site is deployable.

**What to test:**

- `astro build` completes with exit code 0
- Output directory (`dist/`) contains expected HTML files for all routes:
  - 12 root routes: `/index.html`, `/renting/index.html`, etc.
  - 7 × 12 = 84 locale-prefixed routes: `/vi/index.html`, `/ko/renting/index.html`, etc.
- Total page count matches expected (96+ HTML files)

**Suggested approach:** A simple shell script or Vitest test that runs the build and asserts file existence.

---

### 5. SEO and Meta Tag Validation (Integration Test) — MEDIUM PRIORITY

**Files:** `src/layouts/BaseLayout.astro` and all pages

**Why:** SEO is a stated critical concern (Failure Mode #5 in CLAUDE.md). Broken meta tags, missing hreflang, or wrong canonical URLs would silently degrade organic traffic.

**What to test (post-build HTML inspection):**

- Every generated HTML file has a `<title>` that is not empty and includes the site name
- Every page has a `<meta name="description">` with content
- Every page has `<link rel="canonical">` pointing to itself
- Every page has 8 `<link rel="alternate" hreflang="...">` tags + 1 `x-default`
- `<html lang="...">` matches the correct BCP 47 tag for the page's locale
- Open Graph tags (`og:title`, `og:description`, `og:image`) are present

---

### 6. Accessibility Checks (Integration/E2E Test) — MEDIUM PRIORITY

**Why:** The site targets users from 8 different countries with varying accessibility needs. CLAUDE.md specifies proper heading hierarchy, alt text, and ARIA labels as requirements.

**What to test:**

- Every page has exactly one `<h1>`
- Heading hierarchy is sequential (no `<h1>` followed by `<h3>` skipping `<h2>`)
- All interactive elements (buttons, links) have accessible labels
- `aria-label` is present on the nav, mobile menu toggle, and back-to-top button
- Color contrast ratios meet WCAG AA (especially gold-on-white text)

**Suggested tool:** axe-core (via `@axe-core/cli` or Playwright integration).

---

### 7. Client-Side JavaScript Behavior (E2E Tests) — LOWER PRIORITY

**Files:** `Nav.astro` (mobile menu), `BackToTop.astro`, `ReadingProgress.astro`, `LanguageSwitcher.astro`, `FaqAccordion.astro`

**Why:** These components use vanilla JS for interactivity. While the site is designed for progressive enhancement, broken JS means broken UX for the 80% mobile traffic coming from Facebook.

**What to test:**

- **Mobile menu:** Clicking hamburger toggles menu visibility and `aria-expanded`; hamburger animates to X
- **Back-to-top:** Button is hidden at scroll position 0; becomes visible after scrolling 400px; clicking scrolls to top
- **Reading progress bar:** Width is 0% at top; 100% at bottom; updates on scroll
- **FAQ accordion:** Clicking a question reveals the answer; icon rotates; only HTML `<details>` behavior (no JS needed, but verify)
- **Language switcher:** Selecting a language navigates to the correct locale-prefixed URL

**Suggested tool:** Playwright (headless browser testing).

---

### 8. Visual Regression Testing — LOWER PRIORITY

**Why:** The site's design is a key differentiator (Failure Mode #3: "User doesn't trust site that looks like template"). Visual regressions on the premium glassmorphism nav, gold gradient CTAs, or typography would undermine trust.

**What to test:**

- Screenshot comparison of homepage hero section across viewport widths (375px, 768px, 1280px)
- Screenshot comparison of pillar page layout (TOC sidebar, reading progress bar)
- Screenshot comparison of pricing cards on `/how-it-works`

**Suggested tool:** Playwright with `toHaveScreenshot()` or Percy/Chromatic.

---

## Recommended Implementation Order

| Phase | What | Tool | Estimated Files |
|-------|------|------|----------------|
| **Phase 1** | Install Vitest, write i18n utility tests + translation integrity tests | Vitest | 2-3 test files |
| **Phase 2** | Add data file validation tests + build smoke test | Vitest | 2 test files |
| **Phase 3** | Add SEO meta tag validation (post-build HTML parsing) | Vitest + node HTML parser | 1 test file |
| **Phase 4** | Add CI/CD pipeline (GitHub Actions) running build + tests on every PR | GitHub Actions | 1 workflow file |
| **Phase 5** | Install Playwright, add E2E tests for client-side JS + accessibility | Playwright + axe-core | 2-3 test files |
| **Phase 6** | Add visual regression tests | Playwright screenshots | 1 test file |

---

## Quick Start

To bootstrap the test infrastructure:

```bash
# Install Vitest
npm install -D vitest

# Add test script to package.json
# "scripts": { "test": "vitest run", "test:watch": "vitest" }

# Create first test file
mkdir -p tests
# Start with src/i18n/__tests__/utils.test.ts
```

---

## Summary

| Area | Priority | Type | Risk if untested |
|------|----------|------|-----------------|
| i18n utilities | HIGH | Unit | Broken navigation for 7 languages |
| Translation integrity | HIGH | Unit | Missing/wrong text across the site |
| Data file validation | MEDIUM | Unit | Broken pricing, FAQ, testimonials |
| Build smoke test | MEDIUM | Integration | Deploying a broken site |
| SEO meta tags | MEDIUM | Integration | Silent SEO degradation |
| Accessibility | MEDIUM | Integration | Excluding users, legal risk |
| Client-side JS | LOWER | E2E | Broken mobile UX for 80% of traffic |
| Visual regression | LOWER | E2E | Design trust erosion |

The highest-impact starting point is **Phase 1**: install Vitest and write tests for the i18n utilities and translation file integrity. These are pure functions with clear inputs/outputs, easy to test, and protect the most fragile part of the system (8-language routing and content).
