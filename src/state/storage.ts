export type AppState = {
  waffleCount: number
  vegan: boolean
}

export const WAFFLE_COUNT_MIN = 1
export const WAFFLE_COUNT_MAX = 50
export const DEFAULT_WAFFLE_COUNT = 4

export const DEFAULT_STATE: AppState = {
  waffleCount: DEFAULT_WAFFLE_COUNT,
  vegan: false,
}

const STORAGE_KEY = 'waffles:calculator-state'

export function clampWaffleCount(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_WAFFLE_COUNT
  }
  const rounded = Math.round(value)
  return Math.min(WAFFLE_COUNT_MAX, Math.max(WAFFLE_COUNT_MIN, rounded))
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
      waffleCount:
        typeof parsed.waffleCount === 'number'
          ? clampWaffleCount(parsed.waffleCount)
          : DEFAULT_WAFFLE_COUNT,
      vegan: typeof parsed.vegan === 'boolean' ? parsed.vegan : DEFAULT_STATE.vegan,
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
