import { getRecipe } from '../recipes'
import type { UnitSystem } from '../recipes/types'

export type AppState = {
  recipeId: string
  count: number
  vegan: boolean
  units: UnitSystem
  variantId: string | null
  view: 'welcome' | 'recipe'
}

export const COUNT_MIN = 1
export const COUNT_MAX = 50
export const DEFAULT_COUNT = 4
export const DEFAULT_RECIPE_ID = 'waffles'

export const DEFAULT_STATE: AppState = {
  recipeId: DEFAULT_RECIPE_ID,
  count: DEFAULT_COUNT,
  vegan: false,
  units: 'metric',
  variantId: null,
  view: 'welcome',
}

const STORAGE_KEY = 'little-bites:state'

export function clampCount(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_COUNT
  }
  const rounded = Math.round(value)
  return Math.min(COUNT_MAX, Math.max(COUNT_MIN, rounded))
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export function loadState(storage: StorageLike): AppState {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) {
      return DEFAULT_STATE
    }
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      recipeId:
        typeof parsed.recipeId === 'string' && getRecipe(parsed.recipeId)
          ? parsed.recipeId
          : DEFAULT_RECIPE_ID,
      count:
        typeof parsed.count === 'number'
          ? clampCount(parsed.count)
          : DEFAULT_COUNT,
      vegan: typeof parsed.vegan === 'boolean' ? parsed.vegan : DEFAULT_STATE.vegan,
      units: parsed.units === 'us' || parsed.units === 'metric' ? parsed.units : DEFAULT_STATE.units,
      variantId: typeof parsed.variantId === 'string' ? parsed.variantId : null,
      view: parsed.view === 'welcome' || parsed.view === 'recipe' ? parsed.view : 'recipe',
    }
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: AppState, storage: StorageLike): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable (private browsing, disabled cookies). Ignore.
  }
}
