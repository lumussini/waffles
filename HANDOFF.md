# HANDOFF — Little Bites

Status of the project at handoff, including how to run, test, extend, and deploy it.

## What this is

A small, responsive, PWA-ready web app called **Little Bites** with multiple recipes (waffles, bolitas, vegan cake) and Waffly the mascot. Built to be the successor to a Google Sheets ingredient calculator, with a playful personality. The domain/recipe logic is plain TypeScript so it can later be reused by a Capacitor/native app.

- Defaults to English, detects the device language, and supports German.
- Persists recipe selection, count, vegan preference, units, and variant in `localStorage`.
- Works offline after the first visit (service worker with build-time precache).
- Deployed to GitHub Pages under `/little-bites/`.

## Stack & tooling

| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript (~5.8) |
| Build | Vite 6 (base `/little-bites/` when `GITHUB_ACTIONS=true`) |
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
  app/App.tsx                      # shell (renders AppShell)
  components/
    AppShell.tsx                   # main app: state, tips, recipe switching, layout
    CountControl.tsx               # generic − input + (clamped 1–50)
    IngredientList.tsx             # <ul> with aria-label
    IngredientRow.tsx              # translates name, formats quantity
    VariantSelector.tsx            # radio pill group for recipe variants
    VeganToggle.tsx                # VEGANIZE!? checkbox
    DirectionList.tsx              # numbered ordered list of direction steps
    RecipeDrawer.tsx               # (removed — recipes navigated from home screen)
    SettingsDrawer.tsx             # gear → slide-in from right, metric/US toggle
    VariantSelector.tsx            # recipe variant picker (Basic/Zebra for cake)
    WaffleIllustration.tsx         # the waffle art (Waffly mascot)
    WafflyCompanion.tsx            # mascot bubble: tips, auto-hide, tap-to-dismiss
    WelcomeScreen.tsx              # home screen: Waffly + bubble + recipe card grid
  domain/
    calculateRecipe.ts             # generic scaling engine
    formatQuantity.ts              # float-noise-safe formatting + formatUsQuantity
  i18n/
    messages.ts                    # en/de strings (typed MessageKey)
    locale.ts                      # detectLocale(tag, query) — pure, testable
    I18nContext.tsx                # I18nProvider + useI18n hook
  recipes/
    types.ts                       # Recipe, Ingredient, RecipeVariant, UnitSystem
    waffles.ts                     # waffle recipe (scaling, veganizable)
    bolitas.ts                     # fixed-batch recipe, 6 ingredients, 4 directions
    vegan-cake.ts                  # vegan cake with Basic/Zebra variants
    index.ts                       # recipe catalog, getRecipe, resolveIngredientName
  state/storage.ts                 # AppState + localStorage load/save
  main.tsx                         # entry, I18nProvider, SW registration
tests/
  domain/  calculateRecipe.test.ts, formatQuantity.test.ts
  i18n/    locale.test.ts, messages.test.ts
  ui/      AppShell.test.tsx
  setup.ts
public/
  sw.js, manifest.webmanifest, icon.svg
.github/workflows/deploy.yml
vite.config.ts                     # base path + swPrecache plugin
```

## Recipes

| Recipe | ID | Scaling | Variants | Veganizable |
|---|---|---|---|---|
| Ultimate Waffles | `waffles` | 1–50 servings | — | Yes |
| Mechi's Chocolate Bean Balls | `bolitas` | Fixed batch | — | No |
| Vegan Cake | `vegan-cake` | Fixed batch | Basic, Zebra | No |

- The waffle recipe is encoded as a **4-waffle batch** (`baseServings: 4`); scaling factor is `count / 4`.
- Bolitas: fixed-batch with optional ingredients and notes.
- Vegan Cake: two variants (Basic = 9 ingredients, 8 directions; Zebra = 10 ingredients with extra cocoa, 12 directions).
- `calculateRecipe(recipe, count, { vegan, ingredients })` is recipe-agnostic; accepts optional `ingredients` override for variant support.
- `formatQuantity` strips float noise and trailing zeroes.

## App state

```ts
type AppState = {
  recipeId: string        // selected recipe
  count: number           // serving count (1–50, used by scalable recipes)
  vegan: boolean
  units: UnitSystem       // 'metric' | 'us'
  variantId: string | null
  view: 'welcome' | 'recipe'
}
```

Stored under `little-bites:state` in `localStorage`. Returning users go straight to their last recipe; first-time visitors see the home screen.

## Home screen

The home screen replaces the old sidebar recipe drawer. It shows Waffly with a speech bubble ("Pick a recipe to get started"), a grid of recipe cards, and a small "Little Bites" brand mark at the top. The grid icon in the recipe header returns to the home screen at any time.

## Settings & units

- Settings drawer (gear icon) slides in from the right with metric/US toggle.
- US units show cup equivalents (e.g. `3/4 cup` instead of `180 ml`).
- `formatUsQuantity` handles fraction display (`1 1/2 cup`).
- Units preference persists across re-renders and recipe switches.

## Localization (how to add a locale)

1. Add the locale id to `locales` in `src/i18n/messages.ts` and a full `messages` block. The `Record<Locale, Record<MessageKey, string>>` type + the `tests/i18n/messages.test.ts` completeness check enforce parity with `en`.
2. Detection is `?lang=` / `?locale=` override → `navigator.language` (matches `de-DE`, `en-US`, …) → `en`. Works in a Capacitor WebView unchanged.
3. Ingredient names are keys (`ingredient.<id>` and `ingredient.<id>.vegan`); only add the `.vegan` key for ingredients that actually have a `veganName`.

## Waffly companion

- `TIP_DURATION_MS = 4500`; welcome tip on load, serving tip via the `?` button in the count-card header.
- Bubble uses the comic display font (`Lilita One`).
- Mobile: floats as a 96 px tap target, visible only while a tip is active. Desktop: permanent side art.
- Tap or Enter/Space dismisses the tip; bubble has `role="status"`.
- Per-recipe welcome tips (`welcomeTip.waffles`, `welcomeTip.bolitas`, `welcomeTip.vegan-cake`).

## PWA / offline

- `sw.js` is a template; the `swPrecache` plugin in `vite.config.ts` injects the hashed asset list (`self.__PRECACHE__`) at build time using SW-relative paths (`./assets/...`), which is what makes offline work under `/little-bites/`.
- Strategy: stale-while-revalidate; offline navigations fall back to cached `index.html`. Cache versioned as `little-bites-v1` — bump on breaking SW changes.
- Google Fonts are cross-origin and not cached; offline falls back to system fonts.
- Verify a build with `GITHUB_ACTIONS=true npm run build` and inspect `dist/sw.js` (precache list) and `dist/index.html` (asset URLs prefixed `/little-bites/`).

## Deployment (GitHub Pages)

- Push to `main` → `.github/workflows/deploy.yml` runs `npm test` + build, uploads `dist`, deploys via `actions/deploy-pages@v4`.
- Prereqs: repository named `little-bites`, Pages Source = "GitHub Actions".

## Current status

- **126 tests passing** across 5 files (domain, i18n, UI), `tsc -b` clean, production build clean for both `/` and `/little-bites/` bases.
- All naming conventions aligned: storage key `little-bites:state`, component names `AppShell`/`CountControl`, CSS classes `app-*`/`companion-art`, cache `little-bites-v1`.

## Open items

- PWA installability/prompt not implemented (manifest exists; `display: standalone`).
- No favicon beyond `icon.svg` used as app icon.
- `?lang`/`?locale` is read once at mount; changing it via SPA navigation won't re-render without a reload.
- Google Fonts require network; offline falls back to system fonts.
- PRD.md and this file could benefit from a visual pass to match the current multi-recipe state.
