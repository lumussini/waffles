# PRD — Little Bites

## 1. Overview

Build a small, responsive web app called **Little Bites** that replaces the current Google Sheets waffle ingredient calculator and grows into a multi-recipe kitchen companion.

What the app does today:

1. User picks a recipe from the home screen (waffles, bolitas, or vegan cake).
2. For scalable recipes, the user chooses a serving count and the app calculates ingredient quantities.
3. User can enable a **Veganize** option that changes the relevant ingredient names/variants.
4. For recipes with variants (e.g. Basic/Zebra cake), the user picks a variant and ingredients/directions update.
5. The UI presents results in a playful, friendly way with Waffly the mascot.

The architecture separates recipe/calculation logic from the UI so it can later be reused by a native app.

---

## 2. Product goals

### Primary goals

- Make ingredient scaling faster and easier than using the spreadsheet.
- Work well on desktop and mobile browsers.
- Keep the interaction extremely simple: pick a recipe → read ingredients.
- Preserve the playful personality of the spreadsheet.
- Make veganization a first-class option.
- Support multiple recipes with a home screen for navigation.
- Keep recipe/calculation logic independent from the UI so it can later be reused by a native app.
- Ship in English and German with automatic locale detection (and a manual `?lang`/`?locale` override).

### Non-goals

- User accounts.
- Cloud sync.
- Social features.
- Shopping lists.
- Recipe editing by end users.
- Backend/database.
- Nutrition calculations.
- Authentication.
- Payments.

---

## 3. Reference spreadsheet

The original screenshot showed:

- Title: **Ultimate waffle ingredients calculator**
- A waffle count input currently set to **4**
- Up/down controls for changing the count
- A recommendation note: **2 per adult, 1.5 per kid recommended**
- Ingredient rows
- A **VEGANIZE!?** checkbox
- A decorative waffle image
- Playful colors, typography, and shapes

The spreadsheet's base recipe is for **4 waffles**.

### Base recipe captured from the screenshot

| Ingredient | Base quantity | Unit |
|---|---:|---|
| Malk | 45 | ml |
| Flour | 30 | g |
| Margarine | 15 | g |
| Baking powder | 1.75 | g |
| Sugar | 1.7 | g |
| Salt | 0.3 | g |
| Vanilla extract | 0.3 | ml |

Malk is when you choose Veganize, Milk otherwise.
Margarine is when you choose Veganize, Butter otherwise.

**Implementation notes**

- The recipe is encoded in the data model with `baseServings: 4`, so the per-1-waffle numbers above are stored ×4 (e.g. Milk 180 ml for 4 waffles). Scaling factor is `target count / 4`.
- Vinegar was removed from the recipe entirely by product decision.

---

## 4. Core calculation

The source recipe is encoded in the data model for **4 waffles** (`baseServings: 4`); other counts scale linearly with factor `count / 4`.

The calculation engine accepts a recipe and target count, and supports an optional `ingredients` override for variant support:

```ts
calculateRecipe(recipe, count, { vegan, ingredients })
```

---

## 5. Serving count input

### Requirements

- Default value: **4** (but remember previous user input).
- User can increase/decrease the number.
- Provide obvious `+` and `−` controls.
- Also allow direct numeric input.
- Minimum: **1**. Maximum: **50**.
- The displayed ingredient quantities update immediately when the count changes.
- Invalid/empty input must never produce `NaN`, `undefined`, or broken UI.

### Recommendation copy

Show the serving guidance as a short tip rather than persistent text:

- A subtle `?` button in the count-card header opens the tip.
- Waffly presents the tip in a comic-font speech bubble.
- The tip auto-hides after ~4.5 s; tapping Waffly dismisses it immediately.

> Recommended serving: 2 per adult, 1.5 per kid.

### Rounding

Quantities should be displayed in a human-friendly way while retaining accurate internal values.

- Do not show unnecessary trailing zeroes.
- Preserve enough precision for small quantities.
- Implement formatting as a reusable function (`formatQuantity`, `formatUsQuantity`).

---

## 6. Veganize mode

### Behavior

- Default: off but remember user preference.
- When off, show the normal recipe ingredient names.
- When on, show the veganized ingredient names/variants.
- The quantities continue to use the same scaling engine.
- Switching vegan mode must not reset the serving count.

### Important implementation detail

Do **not** hardcode vegan name replacements directly inside UI components. Represent veganization in the recipe data model. The architecture supports future cases where veganization changes quantities or adds/removes ingredients.

---

## 7. Recipe data model

```ts
type Recipe = {
  id: string
  nameKey: string
  ingredients: Ingredient[]
  scaling?: RecipeScaling
  veganizable?: boolean
  directionIds?: string[]
  variants?: RecipeVariant[]
  defaultVariantId?: string
}

type RecipeVariant = {
  id: string
  labelKey: string
  ingredients: Ingredient[]
  directionIds?: string[]
}

type Ingredient = {
  id: string
  baseQuantity: number | null
  unit: string
  veganName?: string
  noteId?: string
  optional?: boolean
  usQuantity?: number
  usUnit?: string
}
```

---

## 8. Multi-recipe architecture (implemented)

The app now supports multiple recipes:

```text
Recipe catalog
├── waffles        (scalable, veganizable)
├── bolitas        (fixed batch, optional ingredients)
└── vegan-cake     (fixed batch, Basic/Zebra variants)
```

### Home screen

The home screen shows Waffly with a speech bubble ("Pick a recipe to get started") and a grid of recipe cards. A grid icon in the recipe header returns to the home screen at any time. First-time visitors see the home screen; returning users go straight to their last recipe.

### Recipe variants

The Vegan Cake recipe supports two variants:

- **Basic**: 9 ingredients, 8 directions
- **Zebra**: 10 ingredients (extra cocoa), 12 directions

Variant selection is persisted and rendered via a `VariantSelector` radio pill group.

---

## 9. UX / UI requirements

### Overall feel

- Playful, warm, friendly, simple, slightly whimsical, highly readable, mobile-friendly.

### Layout

```text
┌─────────────────────────────────┐
│  [grid]  Recipe Title    [gear] │
│                                 │
│  How many waffles?            ? │
│       −   4   +                 │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Milk             180 ml   │  │
│  │ Flour            120 g    │  │
│  │ Butter             60 g   │  │
│  │ Baking powder       7 g   │  │
│  │ Sugar              6.8 g  │  │
│  │ Salt               1.2 g  │  │
│  │ Vanilla extract    1.2 ml │  │
│  └───────────────────────────┘  │
│                                 │
│  ☑ VEGANIZE!?                   │
│                                 │
│  Directions                     │
│  1. Combine all dry...          │
│                                 │
│   [ Waffly: "It's waffle time!"]│
│        [ waffle mascot ]        │
└─────────────────────────────────┘
```

### Home screen

```text
┌─────────────────────────────────┐
│         Little Bites            │
│                                 │
│    "Pick a recipe to get started│
│         " (Waffly bubble)       │
│        [ waffle mascot ]        │
│                                 │
│  ┌───────────┐ ┌───────────┐   │
│  │ Ultimate  │ │ Mechi's   │   │
│  │ Waffles   │ │ Bolitas   │   │
│  └───────────┘ └───────────┘   │
│       ┌───────────┐            │
│       │ Vegan     │            │
│       │ Cake      │            │
│       └───────────┘            │
└─────────────────────────────────┘
```

### Desktop

- Ingredient list should be the primary content.
- Waffly sits alongside the recipe as permanent side art.
- Avoid excessive whitespace.

### Mobile

- Stack content vertically.
- Waffly floats as a tappable 96 px mascot, visible only while a tip is active.
- Controls must be easy to tap.
- No horizontal scrolling.

### Accessibility

- Semantic HTML.
- Proper label for serving count.
- Accessible names for plus/minus buttons.
- Keyboard accessible controls and variant selector.
- Visible focus states.
- Sufficient text/background contrast.
- Vegan toggle and variant selector have accessible labels.
- Do not communicate information through color alone.

---

## 10. Visual direction

Important visual cues:

- Large playful title with red text-shadow.
- Blue ingredient list area with alternating row colors.
- Large, high-contrast ingredient names and quantities.
- Yellow/gold callout for the serving recommendation.
- Playful decorative elements.
- Waffle illustration (Waffly mascot).
- Colorful **VEGANIZE!?** treatment.
- Metric/US unit toggle in settings drawer.

### Typography

- Title and Waffly's speech bubble use the display font **Lilita One** (loaded from Google Fonts).
- Body, controls, and ingredient values use **Nunito**.
- Fallbacks: Trebuchet MS / Comic Sans MS, system sans.

---

## 11. Responsive behavior

Target breakpoints based on layout needs:

- Small mobile
- Large mobile/tablet
- Desktop (≥900px)

The primary interaction must remain above the fold on a typical phone.

---

## 12. State management

```ts
type AppState = {
  recipeId: string
  count: number
  vegan: boolean
  units: UnitSystem
  variantId: string | null
  view: 'welcome' | 'recipe'
}
```

No global state library is necessary. State is persisted in `localStorage` under the key `little-bites:state`.

---

## 13. Technical direction

### Stack

- React 19 + TypeScript (~5.8)
- Vite 6
- CSS with custom properties (no framework)
- Vitest 3 + Testing Library + jsdom
- PWA: service worker + web manifest

### Suggested project structure

```text
src/
  app/
    App.tsx
  components/
    AppShell.tsx
    CountControl.tsx
    IngredientList.tsx
    IngredientRow.tsx
    VariantSelector.tsx
    VeganToggle.tsx
    DirectionList.tsx
    SettingsDrawer.tsx
    WaffleIllustration.tsx
    WafflyCompanion.tsx
    WelcomeScreen.tsx
  i18n/
    messages.ts
    locale.ts
    I18nContext.tsx
  recipes/
    types.ts
    waffles.ts
    bolitas.ts
    vegan-cake.ts
    index.ts
  domain/
    calculateRecipe.ts
    formatQuantity.ts
  state/
    storage.ts
  main.tsx

tests/
  domain/
    calculateRecipe.test.ts
    formatQuantity.test.ts
  i18n/
    locale.test.ts
    messages.test.ts
  ui/
    AppShell.test.tsx
  setup.ts
```

---

## 14. PWA / offline

- Vite `base` is `/little-bites/` when `GITHUB_ACTIONS=true`, otherwise `/`.
- A build-time Vite plugin injects the hashed asset list into `sw.js` (`self.__PRECACHE__`), so the install step precaches the app shell, JS, CSS, icon, and manifest.
- Fetch strategy is stale-while-revalidate; offline navigations fall back to cached `index.html`. Cache name: `little-bites-v1`.
- Google Fonts are cross-origin and not cached; offline renders fall back to system fonts.

---

## 15. Error handling

Handle:

- Empty count, non-numeric count, count below 1, count above 50.
- Malformed recipe ingredient data.
- Invalid saved state (falls back to defaults / home screen).
- localStorage unavailable (private browsing).

---

## 16. Testing requirements

### Unit tests

The calculation engine must have tests for:

1. Base recipe returns original quantities.
2. Half recipe returns half quantities.
3. Double recipe returns double quantities.
4. Larger recipe returns proportional quantities.
5. Non-standard count calculates correctly.
6. Vegan mode does not alter quantities unless configured.
7. Ingredients with unresolved/null quantities handled without `NaN`.
8. Bolitas fixed-batch recipe calculates correctly.
9. Vegan cake Basic and Zebra variants calculate correctly.

### UI tests

Verify:

- Home screen shows on first visit, lists all recipes.
- Selecting a recipe navigates to the recipe view.
- Home button returns to the home screen.
- Returning users skip the home screen.
- Serving count defaults, increments, decrements, min/max, direct input.
- Quantities update immediately.
- Vegan toggle changes displayed labels.
- Count unchanged when toggling vegan mode.
- Waffly shows welcome tip, auto-hides, dismisses on tap.
- Recipe switching via home screen works.
- Settings drawer opens/closes, metric/US toggle works.
- Variant selector works (Basic/Zebra), keyboard accessible.
- German renders when `?lang=de` is set.
- State persists across re-renders.
- Invalid saved state falls back to home screen.

---

## 17. Acceptance criteria

- [x] The app loads without a backend.
- [x] Home screen shows all recipes with Waffly greeting.
- [x] Serving count defaults to 4, range 1–50 for scalable recipes.
- [x] Ingredient quantities scale correctly from the base recipe.
- [x] Quantities displayed with sensible formatting (metric and US).
- [x] Veganize toggle is present and functional for waffles.
- [x] Vegan labels are data-driven, not hardcoded in UI.
- [x] Recipe variants (Basic/Zebra) work for vegan cake.
- [x] Fixed-batch recipes (bolitas) show without count control.
- [x] English and German supported, auto-detected, overridable.
- [x] Waffly companion shows per-recipe tips, dismissible.
- [x] Responsive layout works on mobile and desktop.
- [x] Keyboard and screen-reader basics covered.
- [x] Calculation logic has automated tests (126 passing).
- [x] No backend, login, or database required.
- [x] Recipe data separated from generic calculation logic.
- [x] Adding another recipe does not require rewriting the calculation engine.
- [x] Deployed app works offline after first visit.

---

## 18. Definition of done

### Product

- Home screen provides clear recipe navigation.
- Visual design is playful and intentional.
- Responsive layout works at mobile and desktop widths.
- Veganize and variant interactions are clear.

### Engineering

- TypeScript types used for recipe/domain data.
- Calculation logic is isolated and tested.
- No recipe quantities embedded in multiple UI components.
- All naming conventions aligned (`little-bites` branding throughout).
- Production build succeeds.

### Quality

- 126 tests passing.
- Manual mobile check completed.
- Manual desktop check completed.
- Keyboard interaction checked.
- Basic accessibility checked.

---

## 19. Implementation history

1. Set up React + TypeScript + Vite.
2. Created typed recipe/domain models.
3. Implemented generic scaling calculation + formatQuantity.
4. Built serving count control, ingredient list, vegan toggle.
5. Applied visual design inspired by the spreadsheet.
6. Made layout responsive.
7. Added accessibility.
8. Added i18n (en/de), locale detection.
9. Built Waffly companion (tips, auto-hide, tap-to-dismiss).
10. Added PWA support (service worker, manifest, offline).
11. Added bolitas recipe (fixed batch, optional ingredients).
12. Added vegan cake recipe with Basic/Zebra variants.
13. Added recipe drawer (hamburger → slide-in).
14. Added metric/US unit support with settings drawer.
15. Removed recipe drawer, replaced with home screen navigation.
16. Renamed app from "Ultimate Waffles" to "Little Bites".
17. Refactored all naming conventions to match new identity.
18. Renamed repo to `little-bites`, updated base path.
