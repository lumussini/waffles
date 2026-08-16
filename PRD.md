# PRD — Ultimate Waffle Ingredients Calculator

## 1. Overview

Build a small, responsive web app that replaces the current Google Sheets waffle ingredient calculator.

The current spreadsheet has one main job:

1. User chooses how many waffles they want.
2. The app calculates the required quantity of each ingredient.
3. User can enable a **Veganize** option that changes the relevant ingredient names/variants.
4. The UI presents the result in a playful, friendly way inspired by the spreadsheet.

The first version is intentionally limited to **waffles**. The architecture should make it straightforward to add other recipes later without rewriting the calculation engine or the UI foundation.

The attached spreadsheet screenshot is the visual/product reference.

---

## 2. Product goals

### Primary goals

- Make waffle ingredient scaling faster and easier than using the spreadsheet.
- Work well on desktop and mobile browsers.
- Keep the interaction extremely simple: choose waffle count → read ingredients.
- Preserve the playful personality of the spreadsheet.
- Make veganization a first-class option.
- Keep recipe/calculation logic independent from the UI so it can later be reused by a native app.
- Ship in English and German with automatic locale detection (and a manual `?lang`/`?locale` override).

### Non-goals for v1

- User accounts.
- Cloud sync.
- Social features.
- Shopping lists.
- Recipe editing by end users.
- Multiple recipes in the UI.
- Backend/database.
- Nutrition calculations.
- Unit conversion.
- Authentication.
- Payments.

---

## 3. Reference spreadsheet

The screenshot shows:

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

Malk is when you choose Veganize, Milk otherwise
Margarine is when you choose Veganize, Butter otherwise
Margarine can be replaced by Oil then 10ml should be used instead of 15g

**Implementation notes**

- The recipe is encoded in the data model with `baseServings: 4`, so the per-1-waffle numbers above are stored ×4 (e.g. Milk 180 ml for 4 waffles). Scaling factor is `target count / 4`.
- Vinegar appeared in the spreadsheet screenshot without any visible quantity; it was **removed from the recipe entirely** by product decision, so the v1 app has no vinegar ingredient.
---

## 4. Core calculation

The source recipe is encoded in the data model for **4 waffles** (`baseServings: 4`); other counts scale linearly with factor `count / 4`.

Examples:

### 4 waffles

- Malk: 180 ml
- Flour: 120 g
- Margarine: 60 g
- Baking powder: 7 g
- Sugar: 6.8 g
- Salt: 1.2 g
- Vanilla extract: 1.2 ml

### 8 waffles

- Malk: 360 ml
- Flour: 240 g
- Margarine: 120 g
- Baking powder: 14 g
- Sugar: 13.6 g
- Salt: 2.4 g
- Vanilla extract: 2.4 ml

### 2 waffles

- Malk: 90 ml
- Flour: 60 g
- Margarine: 30 g
- Baking powder: 3.5 g
- Sugar: 3.4 g
- Salt: 0.6 g
- Vanilla extract: 0.6 ml

The calculation engine must use numeric values rather than string manipulation.

---

## 5. Waffle count input

### Requirements

- Default value: **4** (but remember previous user input)
- User can increase/decrease the number.
- Provide obvious `+` and `−` controls.
- Also allow direct numeric input if practical.
- Minimum: **1 waffle**
- Maximum: **50 waffles** for v1.
- The displayed ingredient quantities update immediately when the count changes.
- Invalid/empty input must never produce `NaN`, `undefined`, or broken UI.

### Recommendation copy

Show the serving guidance as a short tip rather than persistent text:

- A subtle `?` button in the count-card header opens the tip.
- Waffly (the mascot) presents the tip in a comic-font speech bubble.
- The tip auto-hides after ~4.5 s; tapping Waffly (or Enter/Space when focused) dismisses it immediately.

> Recommended serving: 2 per adult, 1.5 per kid.

This is guidance only; it does not need to automatically calculate servings in v1.

### Rounding

Quantities should be displayed in a human-friendly way while retaining accurate internal values.

Suggested display rules:

- Do not show unnecessary trailing zeroes.
- Preserve enough precision for small quantities.
- Examples:
  - `180 ml`, not `180.0 ml`
  - `6.8 g`
  - `3.5 g`
  - `0.6 g`

Do not round in a way that materially changes the recipe.

Implement formatting as a reusable function rather than formatting values inside individual UI components.

---

## 6. Veganize mode

The spreadsheet contains a checkbox labeled:

> VEGANIZE!?

The web app should provide the same concept as a clear toggle/checkbox.

### Behavior

- Default: off but remember user preference
- When off, show the normal recipe ingredient names.
- When on, show the veganized ingredient names/variants.
- The quantities should continue to use the same scaling engine unless a future recipe definition explicitly says otherwise.
- Switching vegan mode must not reset the waffle count.

### Important implementation detail

Do **not** hardcode vegan name replacements directly inside UI components.

Represent veganization in the recipe data/model, for example conceptually:

```ts
type Ingredient = {
  id: string
  name: string
  veganName?: string
  baseQuantity?: number
  unit: string
}
```

The exact vegan labels should match the existing spreadsheet/source recipe. If the source spreadsheet does not make the replacements unambiguous, use a clearly marked placeholder/configuration rather than inventing recipe facts.

The architecture should support future cases where veganization changes quantities or adds/removes ingredients, even if v1 only needs name changes.

---

## 7. Recipe data model

The UI should not contain recipe-specific calculation logic.

Use a recipe definition roughly equivalent to:

```ts
type Recipe = {
  id: string
  name: string
  baseServings: number
  ingredients: Ingredient[]
  veganizable?: boolean
}

type Ingredient = {
  id: string
  name: string
  veganName?: string
  baseQuantity: number | null
  unit: string
  veganBaseQuantity?: number
  veganUnit?: string
}
```

For v1:

- `id`: `waffles`
- `name`: `Ultimate Waffle`
- `baseServings`: `4`
- `veganizable`: `true`

The calculation engine should accept a recipe and target count, rather than knowing that the recipe is waffles.

This is the main architectural requirement for adding more recipes later.

---

## 8. Future multi-recipe architecture

Do not build the multi-recipe feature now, but make it possible.

A future version should be able to have:

```text
Recipe catalog
├── waffles
├── pancakes
├── brownies
└── ...
```

The calculation layer should therefore expose a generic operation such as:

```text
calculateRecipe(recipe, targetServings)
```

The first UI can simply load the waffle recipe directly.

Do not introduce a database or complex CMS just to support this future.

---

## 9. UX / UI requirements

### Overall feel

The app should feel like a polished, modern version of the existing spreadsheet rather than a generic recipe website.

Desired characteristics:

- playful
- warm
- friendly
- simple
- slightly whimsical
- highly readable
- mobile-friendly

### Layout

Recommended structure:

```text
┌─────────────────────────────────┐
│  Ultimate waffle ingredients    │
│  calculator                     │
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
│   [ Waffly: "It's waffle time!"]│
│        [ waffle mascot ]        │
└─────────────────────────────────┘
```

The `?` next to "How many waffles?" opens the serving tip via Waffly. On mobile, Waffly floats as a tappable mascot and only appears while a tip is visible; on desktop it is permanent side art next to the calculator.

This is a conceptual layout, not a pixel-perfect requirement.

### Desktop

- Ingredient list should be the primary content.
- Decorative waffle artwork can sit alongside the calculator.
- Avoid excessive whitespace.
- Keep the calculator visually dominant.

### Mobile

- Stack content vertically.
- Waffle artwork should move below or near the ingredient list.
- Controls must be easy to tap.
- No horizontal scrolling.

### Accessibility

- Semantic HTML.
- Proper label for waffle count.
- Accessible names for plus/minus buttons.
- Keyboard accessible controls.
- Visible focus states.
- Sufficient text/background contrast.
- Vegan toggle must have an accessible label.
- Do not communicate information through color alone.

---

## 10. Visual direction

Use the screenshot as inspiration, but do not attempt to reproduce Google Sheets itself.

Important visual cues from the reference:

- Large playful title.
- Strong red title treatment.
- Blue ingredient list area.
- Large, high-contrast ingredient names and quantities.
- Yellow/gold callout for the serving recommendation.
- Playful decorative elements.
- Waffle illustration.
- Colorful **VEGANIZE!?** treatment.

The implementation should use a small, intentional design system rather than many arbitrary colors.

### Typography

- Title and Waffly's speech bubble use the display font **Lilita One** (comic-style, loaded from Google Fonts).
- Body, controls, and ingredient values use **Nunito**.
- The app must remain usable if the web fonts fail to load (fallbacks: Trebuchet MS / Comic Sans MS, system sans).

---

## 11. Responsive behavior

Target breakpoints should be based on layout needs rather than specific device models.

At minimum:

- small mobile
- large mobile/tablet
- desktop

The calculator should look intentional at all sizes.

The primary interaction must remain above the fold on a typical phone.

---

## 12. State management

The app only needs a small amount of state in v1:

```ts
type AppState = {
  waffleCount: number
  vegan: boolean
}
```

No global state library is necessary unless the implementation genuinely benefits from one.

State should live at the smallest sensible level.

The selected waffle count and vegan mode do not need server persistence.

Optional enhancement:

- Persist the last selected waffle count and vegan mode in `localStorage`.

If implemented, this should be progressive enhancement, not a dependency for correctness.

---

## 13. Technical direction

Recommended stack:

- React
- TypeScript
- Vite
- CSS or a lightweight styling approach
- PWA-ready structure

Avoid adding a backend for v1.

### Why this structure

The calculation engine and recipe data should be plain TypeScript so they can later be reused by:

- a React Native app
- Expo
- another web client
- tests
- future recipes

The UI should depend on the domain model, not the other way around.

### Suggested project structure

```text
src/
  app/
    App.tsx
  components/
    WaffleCalculator.tsx
    WaffleCountControl.tsx
    IngredientList.tsx
    IngredientRow.tsx
    VeganToggle.tsx
    WaffleIllustration.tsx
    WafflyCompanion.tsx
  i18n/
    messages.ts
    locale.ts
    I18nContext.tsx
  recipes/
    types.ts
    waffles.ts
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
    WaffleCalculator.test.tsx
```

The exact structure may differ if the implementation has a good reason, but the separation between domain logic, recipe data, and presentation should remain.

---

## 14. PWA / future native readiness

The first release is a web app.

It should be easy to evolve into a native application later.

For v1 (implemented):

- responsive UI
- no backend dependency, no authentication
- recipe/calculation logic isolated from browser APIs (plain TypeScript, reusable by a Capacitor/native app later)
- PWA: web manifest + service worker; the app shell, hashed JS/CSS, icon and manifest are **precached at build time**, so the app works offline after the first visit (stale-while-revalidate for runtime requests)
- Locale detection reads `navigator.language`, which behaves the same inside a Capacitor WebView

Do not build a native wrapper yet.

---

## 15. Error handling

The user should never see technical errors for normal input.

Handle:

- empty count
- non-numeric count
- count below 1
- count above 50
- malformed recipe ingredient data

For user input:

- constrain or clamp values appropriately.
- Keep the last valid value when possible.
- Never render `NaN`.

For developer/data errors:

- fail loudly in development.
- provide a safe fallback in production.

---

## 16. Testing requirements

### Unit tests

The calculation engine must have tests for:

1. Base recipe:
   - 4 waffles returns the original quantities.
2. Half recipe:
   - 2 waffles returns half quantities.
3. Double recipe:
   - 8 waffles returns double quantities.
4. Larger recipe:
   - 12 waffles returns 3× quantities.
5. Non-standard count:
   - 3 waffles correctly calculates `base × 3 / 4`.
6. Vegan mode does not alter quantities unless explicitly configured by recipe data.
7. Ingredients with unresolved/null quantities are handled without producing `NaN`.

### UI tests

Verify:

- default count is 4
- plus increments count
- minus decrements count
- minimum is respected
- maximum is respected
- quantities update immediately
- vegan toggle changes the displayed labels
- veganize does not break ingredients that have no vegan variant
- waffle count remains unchanged when toggling vegan mode
- Waffly shows a welcome tip on load, auto-hides it, and dismisses it on tap
- German renders when `?lang=de` is set; unsupported locales fall back to English

### Example acceptance test

Given:

- waffle count = 8
- vegan = on

Then the ingredient list includes:

- Malk — 360 ml
- Flour — 240 g
- Margarine — 120 g
- Baking powder — 14 g
- Sugar — 13.6 g
- Salt — 2.4 g
- Vanilla extract — 2.4 ml

With vegan = off the same test shows Milk and Butter (see the label rule in §3).

---

## 17. Acceptance criteria

The v1 release is complete when:

- [ ] The app loads without a backend.
- [ ] The default waffle count is 4.
- [ ] User can change the waffle count from 1 to 50.
- [ ] Ingredient quantities scale correctly from the 4-waffle base recipe.
- [ ] Quantities are displayed with sensible formatting.
- [ ] Veganize toggle is present and functional.
- [ ] Vegan labels are data-driven rather than hardcoded in presentation components.
- [ ] Vinegar is absent from the recipe (removed by product decision).
- [ ] English and German are supported, auto-detected, and overridable via `?lang`/`?locale`.
- [ ] Waffly companion shows tips and is dismissible.
- [ ] The app is usable on mobile and desktop.
- [ ] Keyboard and screen-reader basics are covered.
- [ ] Calculation logic has automated tests.
- [ ] No backend, login, or database is required.
- [ ] Recipe-specific data is separated from generic calculation logic.
- [ ] Adding another recipe later would not require rewriting the calculation engine.
- [ ] The deployed app (GitHub Pages under `/waffles/`) works offline after the first visit.

---

## 18. Definition of done

### Product

- Calculator matches the intended behavior of the spreadsheet.
- Visual design clearly takes inspiration from the spreadsheet while feeling like a real web app.
- Responsive layout works at mobile and desktop widths.
- Veganize interaction is clear.

### Engineering

- TypeScript types are used for recipe/domain data.
- Calculation logic is isolated and tested.
- No recipe quantities are embedded directly in multiple UI components.
- No unnecessary backend infrastructure.
- No console errors during normal use.
- Production build succeeds.

### Quality

- Test suite passes.
- Manual mobile check completed.
- Manual desktop check completed.
- Keyboard interaction checked.
- Basic accessibility checked.

---

## 19. Open questions / source-of-truth items

These should be resolved before treating the recipe as final:

1. ~~Vinegar quantity~~ **Resolved:** the screenshot showed the name with no quantity; vinegar was removed from the recipe entirely by product decision.
2. ~~Exact vegan labels~~ **Resolved:** Malk (Milk) and Margarine (Butter) taken from the spreadsheet; labels are data-driven and easy to change.
3. ~~Veganization quantity changes~~ **Resolved:** v1 does not change quantities; the engine supports per-ingredient `veganBaseQuantity`/`veganUnit` for the future.
4. **Whether waffle count may be fractional:** v1 ships integer waffle counts (1–50, clamped). Change only if the original spreadsheet intentionally supports fractions.
5. **Additional locales:** v1 ships English + German. Adding a locale means adding a `messages` block; completeness is enforced by the type system and a test.
6. **"Malk" is an invented brand name:** kept verbatim from the spreadsheet; confirm branding before any store release.

Do not block the initial UI implementation on these questions if the implementation can keep the recipe values/configuration isolated and easy to update.

---

## 20. Implementation guidance for OpenCode / Big Pickle

Implement in small, verifiable steps:

1. Set up the React + TypeScript web app.
2. Create typed recipe/domain models.
3. Add the waffle recipe data from this PRD.
4. Implement and unit-test the generic scaling calculation.
5. Implement quantity formatting.
6. Build the waffle count control.
7. Build the ingredient list.
8. Build the vegan toggle using recipe data.
9. Apply the visual design inspired by the screenshot.
10. Make the layout responsive.
11. Add accessibility details.
12. Run tests and production build.
13. Perform a final manual pass against the acceptance criteria.
14. Add i18n (en/de), locale detection, and the `?lang`/`?locale` override.
15. Polish the Waffly companion (tips, tap-to-dismiss, comic-font bubble).
16. Harden the PWA for offline (build-time precache of hashed assets) and deploy to GitHub Pages under `/waffles/`.

Do not over-engineer v1. The app is a small calculator with a clean path toward a multi-recipe product.

---

## 21. Localization (implemented)

- Locales: English (`en`, default) and German (`de`).
- Detection order: `?lang=` / `?locale=` query parameter → device `navigator.language` → `en`.
- Examples: `?lang=de` forces German; an unsupported value (e.g. `?lang=fr`) falls back to the device language.
- German copy uses locale-aware number style (e.g. "1,5 pro Kind").
- Device detection works unchanged in a future Capacitor WebView.
- Ingredient names are translated per ingredient id; the vegan variant name is only swapped when the recipe actually defines a `veganName` (non-exception ingredients keep their normal name in vegan mode).

## 22. Waffly companion (implemented)

- Mascot speech bubble rendered in the comic-style display font.
- On mobile the mascot floats as a tappable target (96 px) and only appears while a tip is visible; on desktop it is permanent side art.
- Shows a welcome tip on load and the serving tip from the `?` help button.
- Tips auto-hide after ~4.5 s; tapping Waffly (or pressing Enter/Space when focused) dismisses them immediately.

## 23. Deployment & offline behavior (implemented)

- Vite `base` is `/waffles/` when `GITHUB_ACTIONS=true`, otherwise `/`; this drives all asset URLs, the `BASE_URL`-prefixed service worker registration, and the manifest paths.
- GitHub Actions workflow (`.github/workflows/deploy.yml`) runs tests, builds, and deploys to Pages. Pages Source must be set to "GitHub Actions" and the repository named `waffles`.
- A build-time Vite plugin injects the hashed asset list into `sw.js` (`self.__PRECACHE__`), so the install step precaches the app shell, JS, CSS, icon, and manifest from service-worker-relative paths (safe under `/waffles/`).
- Fetch strategy is stale-while-revalidate; offline navigations fall back to the cached `index.html`. Cache name is versioned (`waffles-calculator-v2`).
- Google Fonts are cross-origin and not cached; offline renders fall back to system fonts.
