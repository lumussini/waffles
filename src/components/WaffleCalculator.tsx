import { useCallback, useEffect, useMemo, useState } from 'react'
import { calculateRecipe } from '../domain/calculateRecipe'
import { useI18n } from '../i18n/I18nContext'
import { getRecipe } from '../recipes'
import type { AppState } from '../state/storage'
import { loadState, saveState, WAFFLE_COUNT_MAX, WAFFLE_COUNT_MIN } from '../state/storage'
import { IngredientList } from './IngredientList'
import { VeganToggle } from './VeganToggle'
import { WaffleCountControl } from './WaffleCountControl'
import { WafflyCompanion } from './WafflyCompanion'

export function WaffleCalculator() {
  const { t } = useI18n()
  const [state, setState] = useState<AppState>(() => loadState(window.localStorage))
  const [tip, setTip] = useState<string | null>(t('welcomeTip'))
  const closeTip = useCallback(() => setTip(null), [])

  useEffect(() => {
    saveState(state, window.localStorage)
  }, [state])

  const recipe = getRecipe('waffles')
  if (!recipe) {
    throw new Error('Waffle recipe not found in catalog')
  }

  const ingredients = useMemo(
    () => calculateRecipe(recipe, state.waffleCount, { vegan: state.vegan }),
    [recipe, state],
  )

  const setWaffleCount = (waffleCount: number) => {
    setState((prev) => ({ ...prev, waffleCount }))
  }

  const setVegan = (vegan: boolean) => {
    setState((prev) => ({ ...prev, vegan }))
  }

  const showServingTip = () => {
    setTip(t('servingTip'))
  }

  return (
    <div className="calculator">
      <header className="calculator-header">
        <h1 className="calculator-title">{t('title')}</h1>
      </header>

      <div className="calculator-body">
        <main className="calculator-main">
          <section className="count-card" aria-labelledby="count-heading">
            <div className="count-card-header">
              <h2 id="count-heading" className="count-heading">
                {t('countHeading')}
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
            <WaffleCountControl
              value={state.waffleCount}
              min={WAFFLE_COUNT_MIN}
              max={WAFFLE_COUNT_MAX}
              onChange={setWaffleCount}
            />
          </section>

          <IngredientList ingredients={ingredients} />

          <VeganToggle checked={state.vegan} onChange={setVegan} />
        </main>

        <WafflyCompanion message={tip} onClose={closeTip} />
      </div>
    </div>
  )
}
