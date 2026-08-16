# HANDOFF — Ultimate Waffle Ingredients Calculator

Status of the project at handoff, including how to run, test, extend, and deploy it.

## What this is

A small, responsive, PWA-ready web app that scales the "Ultimate Waffle" recipe to any count (1–50) and can veganize it. Built to be the successor to a Google Sheets calculator, with a playful Waffly mascot. The domain/recipe logic is plain TypeScript so it can later be reused by a Capacitor/native app.

- Defaults to English, detects the device language, and supports German.
- Persists the waffle count and vegan preference in `localStorage`.
- Works offline after the first visit (service worker with build-time precache).
- Deployed to GitHub Pages under `/waffles/`.

## Stack & tooling

| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript (~5.8) |
| Build | Vite 6 (base `/waffles/` when `GITHUB_ACTIONS=true`) |
| Tests | Vitest 3 + Testing Library + jsdom |
| Styling | Plain CSS with CSS custom properties in `src/index.css` |
| PWA | `public/manifest.webmanifest` + `public/sw.js` (precache injected at build) |
| Localization | Hand-rolled i18n in `src/i18n/` (no library) |
| Node | v20.8.1 (CI uses Node 20), npm 10.1.0 |

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # vitest run
npm run typecheck    # tsc -b --noEmit
npm run build        # tsc -b && vite build -> dist/
npm run preview      # serve the built dist/
```

Try locales: `http://localhost:5173/?lang=de` (also accepts `?locale=de`).

## Project structure

```
src/
  app/App.tsx                      # shell (just renders the calculator)
  components/
    WaffleCalculator.tsx           # screen: state, tips, composition
    WaffleCountControl.tsx         # − input +  control (clamped 1–50)
    IngredientList.tsx             # <ul> with aria-label
    IngredientRow.tsx              # translates name, formats quantity
    VeganToggle.tsx                # VEGANIZE!? checkbox
    WaffleIllustration.tsx         # the waffle art
    WafflyCompanion.tsx            # mascot bubble: tips, auto-hide, tap-to-dismiss
  domain/
    calculateRecipe.ts             # generic scaling engine
    formatQuantity.ts              # float-noise-safe formatting
  i18n/
    messages.ts                    # en/de strings (typed MessageKey)
    locale.ts                      # detectLocale(tag, query) — pure, testable
    I18nContext.tsx                # I18nProvider + useI18n hook
  recipes/
    types.ts, waffles.ts, index.ts # recipe catalog (baseServings: 4)
  state/storage.ts                 # AppState + localStorage load/save
  main.tsx                         # entry, I18nProvider, SW registration
tests/
  domain/  calculateRecipe.test.ts, formatQuantity.test.ts
  i18n/    locale.test.ts, messages.test.ts
  ui/      WaffleCalculator.test.tsx
  setup.ts
public/
  sw.js, manifest.webmanifest, icon.svg
.github/workflows/deploy.yml
vite.config.ts                     # base path + swPrecache plugin
```

## Recipe & domain model

- The base recipe is encoded as a **4-waffle batch** (`baseServings: 4`); scaling factor is `count / 4`.
- Quantities: Milk/Malk 180 ml, Flour 120 g, Butter/Margarine 60 g, Baking powder 7 g, Sugar 6.8 g, Salt 1.2 g, Vanilla extract 1.2 ml.
- **Vinegar was intentionally removed** (product decision; it had no quantity in the source).
- `Ingredient` supports `veganName`, `veganBaseQuantity`, `veganUnit` for future substitutions. Only Milk→Malk and Butter→Margarine are used today.
- `calculateRecipe(recipe, targetServings, { vegan })` is recipe-agnostic; `ScaledIngredient` carries a `vegan` flag used by the UI to pick the right translated name (only swaps when the ingredient actually has a `veganName`).
- `formatQuantity` strips float noise and trailing zeroes (`6.8000001 → 6.8`).

## Localization (how to add a locale)

1. Add the locale id to `locales` in `src/i18n/messages.ts` and a full `messages` block. The `Record<Locale, Record<MessageKey, string>>` type + the `tests/i18n/messages.test.ts` completeness check enforce parity with `en`.
2. Detection is `?lang=` / `?locale=` override → `navigator.language` (matches `de-DE`, `en-US`, …) → `en`. Works in a Capacitor WebView unchanged.
3. Ingredient names are keys (`ingredient.<id>` and `ingredient.<id>.vegan`); only add the `.vegan` key for ingredients that actually have a `veganName`.

## Waffly companion

- `TIP_DURATION_MS = 4500`; welcome tip on load, serving tip via the `?` button in the count-card header.
- Bubble uses the comic display font (`Lilita One`).
- Mobile: floats as a 96 px tap target, visible only while a tip is active. Desktop: permanent side art.
- Tap or Enter/Space dismisses the tip; bubble has `role="status"`.

## PWA / offline

- `sw.js` is a template; the `swPrecache` plugin in `vite.config.ts` injects the hashed asset list (`self.__PRECACHE__`) at build time using SW-relative paths (`./assets/...`), which is what makes offline work under `/waffles/`.
- Strategy: stale-while-revalidate; offline navigations fall back to cached `index.html`. Cache versioned as `waffles-calculator-v2` — bump on breaking SW changes.
- Google Fonts are cross-origin and not cached; offline falls back to system fonts.
- Verify a build with `GITHUB_ACTIONS=true npm run build` and inspect `dist/sw.js` (precache list) and `dist/index.html` (asset URLs prefixed `/waffles/`).

## Deployment (GitHub Pages)

- Push to `main` → `.github/workflows/deploy.yml` runs `npm test` + build, uploads `dist`, deploys via `actions/deploy-pages@v4`.
- Prereqs: repository named `waffles`, Pages Source = "GitHub Actions".
- Not a git repo yet — `git init`, add remote, push to enable the workflow.

## Current status

- **49 tests passing** across 5 files (domain, i18n, UI), `tsc -b` clean, production build clean for both `/` and `/waffles/` bases.
- Implementation follows PRD §3 label rule (vegan OFF → Milk/Butter, ON → Malk/Margarine). Note: PRD §16's original example contradicted §3 (showed Malk/Margarine with vegan off); the acceptance example was corrected in the PRD to vegan = on.

## Open items

- PWA installability/prompt not implemented (manifest exists; `display: standalone`).
- No favicon beyond `icon.svg` used as app icon.
- Confirmed behavior (arrow position, bubble size) not yet visually verified by the user on a device.
- `?lang`/`?locale` is read once at mount; changing it via SPA navigation won't re-render without a reload.
- Google Fonts require network; offline falls back to system fonts.
