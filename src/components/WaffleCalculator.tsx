import { useCallback, useEffect, useMemo, useState } from 'react'
import { calculateRecipe } from '../domain/calculateRecipe'
import { getRecipe } from '../recipes'
import type { AppState } from '../state/storage'
import { loadState, saveState, WAFFLE_COUNT_MAX, WAFFLE_COUNT_MIN } from '../state/storage'
import { IngredientList } from './IngredientList'
import { VeganToggle } from './VeganToggle'
import { WaffleCountControl } from './WaffleCountControl'
import { WafflyCompanion } from './WafflyCompanion'

const WELCOME_TIP = "It's waffle time!"
const SERVING_TIP = 'Recommended serving: 2 per adult, 1.5 per kid.'

export function WaffleCalculator() {
  const [state, setState] = useState<AppState>(() => loadState(window.localStorage))
  const [tip, setTip] = useState<string | null>(WELCOME_TIP)
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
    setTip(SERVING_TIP)
  }

  return (
    <div className="calculator">
      <header className="calculator-header">
        <h1 className="calculator-title">Ultimate waffle ingredients calculator</h1>
        <p className="calculator-subtitle">Scale a batch, then make it whatever you need it to be.</p>
      </header>

      <div className="calculator-body">
        <main className="calculator-main">
          <section className="count-card" aria-labelledby="count-heading">
            <div className="count-card-header">
              <h2 id="count-heading" className="count-heading">
                How many waffles?
              </h2>
              <button
                type="button"
                className="help-button"
                onClick={showServingTip}
                aria-label="Show recommended serving per person"
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
