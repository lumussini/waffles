import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { calculateRecipe } from '../domain/calculateRecipe'
import { useI18n } from '../i18n/I18nContext'
import type { MessageKey } from '../i18n/messages'
import { getRecipe, recipes } from '../recipes'
import type { RecipeVariant, UnitSystem } from '../recipes/types'
import type { AppState } from '../state/storage'
import { DEFAULT_RECIPE_ID, loadState, saveState } from '../state/storage'
import { CountControl } from './CountControl'
import { DirectionList } from './DirectionList'
import { IngredientList } from './IngredientList'
import { SettingsDrawer } from './SettingsDrawer'
import { VariantSelector } from './VariantSelector'
import { VeganToggle } from './VeganToggle'
import { WafflyCompanion } from './WafflyCompanion'
import { WelcomeScreen } from './WelcomeScreen'

export function AppShell() {
  const { t } = useI18n()
  const [state, setState] = useState<AppState>(() => loadState(window.localStorage))
  const welcomeKey = `welcomeTip.${state.recipeId}` as MessageKey
  const [tip, setTip] = useState<string | null>(t(welcomeKey))
  const prevRecipeId = useRef(state.recipeId)
  const closeTip = useCallback(() => setTip(null), [])

  useEffect(() => {
    saveState(state, window.localStorage)
  }, [state])

  const recipe = getRecipe(state.recipeId) ?? getRecipe(DEFAULT_RECIPE_ID)!

  const activeVariant: RecipeVariant | undefined = useMemo(() => {
    if (!recipe.variants) return undefined
    return (
      recipe.variants.find((v) => v.id === state.variantId) ??
      recipe.variants.find((v) => v.id === recipe.defaultVariantId) ??
      recipe.variants[0]
    )
  }, [recipe, state.variantId])

  const activeIngredients = activeVariant?.ingredients ?? recipe.ingredients
  const activeDirectionIds = activeVariant?.directionIds ?? recipe.directionIds

  const ingredients = useMemo(
    () =>
      calculateRecipe(recipe, recipe.scaling ? state.count : undefined, {
        vegan: state.vegan,
        ingredients: activeIngredients,
      }),
    [recipe, state.count, state.vegan, activeIngredients],
  )

  const selectRecipe = (recipeId: string) => {
    setState((prev) => {
      const nextRecipe = getRecipe(recipeId)
      const defaultVariant = nextRecipe?.defaultVariantId ?? null
      return { ...prev, recipeId, variantId: defaultVariant, view: 'recipe' as const }
    })
  }

  const goHome = () => {
    setState((prev) => ({ ...prev, view: 'welcome' }))
  }

  useEffect(() => {
    if (prevRecipeId.current !== state.recipeId) {
      prevRecipeId.current = state.recipeId
      setTip(t(`welcomeTip.${state.recipeId}` as MessageKey))
    }
  }, [state.recipeId, t])

  const setCount = (count: number) => {
    setState((prev) => ({ ...prev, count }))
  }

  const setVegan = (vegan: boolean) => {
    setState((prev) => ({ ...prev, vegan }))
  }

  const setUnits = (units: UnitSystem) => {
    setState((prev) => ({ ...prev, units }))
  }

  const setVariantId = (variantId: string) => {
    setState((prev) => ({ ...prev, variantId }))
  }

  const showServingTip = () => {
    setTip(t('servingTip'))
  }

  if (state.view === 'welcome') {
    return (
      <div className="app-shell">
        <WelcomeScreen recipes={recipes} onSelectRecipe={selectRecipe} />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button
          type="button"
          className="home-button"
          onClick={goHome}
          aria-label={t('homeLabel')}
        >
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
        <h1 className="app-title">{t(recipe.nameKey as MessageKey)}</h1>
        <SettingsDrawer units={state.units} onUnitsChange={setUnits} />
      </header>

      <div className="app-body">
        <main className="app-main">
          {recipe.scaling && (
            <section className="count-card" aria-labelledby="count-heading">
              <div className="count-card-header">
                <h2 id="count-heading" className="count-heading">
                  {t(recipe.scaling.countHeadingKey as MessageKey)}
                </h2>
                <button
                  type="button"
                  className="help-button"
                  onClick={showServingTip}
                  aria-label={t('helpLabel')}
                >
                  ?
                </button>
              </div>
              <CountControl
                value={state.count}
                min={recipe.scaling.min}
                max={recipe.scaling.max}
                onChange={setCount}
                increaseLabel={t(recipe.scaling.increaseLabelKey as MessageKey)}
                decreaseLabel={t(recipe.scaling.decreaseLabelKey as MessageKey)}
                inputLabel={t(recipe.scaling.unitLabelKey as MessageKey)}
              />
            </section>
          )}

          {!recipe.scaling && !recipe.variants && (
            <p className="fixed-batch-label">{t('fixedBatch')}</p>
          )}

          {recipe.variants && activeVariant && (
            <VariantSelector
              variants={recipe.variants}
              selectedId={activeVariant.id}
              onChange={setVariantId}
            />
          )}

          <IngredientList ingredients={ingredients} units={state.units} />

          {recipe.veganizable && <VeganToggle checked={state.vegan} onChange={setVegan} />}

          {activeDirectionIds && activeDirectionIds.length > 0 && (
            <DirectionList directionIds={activeDirectionIds} />
          )}
        </main>

        <WafflyCompanion message={tip} onClose={closeTip} />
      </div>
    </div>
  )
}
