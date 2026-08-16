import { describe, expect, it } from 'vitest'
import { calculateRecipe } from '../../src/domain/calculateRecipe'
import { getRecipe } from '../../src/recipes'
import type { ScaledIngredient } from '../../src/domain/calculateRecipe'
import type { Recipe } from '../../src/recipes/types'

const waffles = getRecipe('waffles')

function quantities(servings: number, vegan = false): ScaledIngredient[] {
  if (!waffles) {
    throw new Error('Waffle recipe missing')
  }
  return calculateRecipe(waffles, servings, { vegan })
}

function expectQuantity(list: ScaledIngredient[], id: string, expected: number): void {
  const entry = list.find((scaled) => scaled.ingredient.id === id)
  expect(entry).toBeDefined()
  expect(entry?.quantity).toBeCloseTo(expected, 6)
}

describe('calculateRecipe', () => {
  it('returns the original quantities for the 4-waffle base recipe', () => {
    const list = quantities(4)
    expectQuantity(list, 'milk', 180)
    expectQuantity(list, 'flour', 120)
    expectQuantity(list, 'fat', 60)
    expectQuantity(list, 'baking-powder', 7)
    expectQuantity(list, 'sugar', 6.8)
    expectQuantity(list, 'salt', 1.2)
    expectQuantity(list, 'vanilla', 1.2)
  })

  it('returns half quantities for 2 waffles', () => {
    const list = quantities(2)
    expectQuantity(list, 'milk', 90)
    expectQuantity(list, 'flour', 60)
    expectQuantity(list, 'fat', 30)
    expectQuantity(list, 'baking-powder', 3.5)
    expectQuantity(list, 'sugar', 3.4)
    expectQuantity(list, 'salt', 0.6)
    expectQuantity(list, 'vanilla', 0.6)
  })

  it('returns double quantities for 8 waffles', () => {
    const list = quantities(8)
    expectQuantity(list, 'milk', 360)
    expectQuantity(list, 'flour', 240)
    expectQuantity(list, 'fat', 120)
    expectQuantity(list, 'baking-powder', 14)
    expectQuantity(list, 'sugar', 13.6)
    expectQuantity(list, 'salt', 2.4)
    expectQuantity(list, 'vanilla', 2.4)
  })

  it('returns triple quantities for 12 waffles', () => {
    const list = quantities(12)
    expectQuantity(list, 'milk', 540)
    expectQuantity(list, 'flour', 360)
    expectQuantity(list, 'fat', 180)
    expectQuantity(list, 'baking-powder', 21)
    expectQuantity(list, 'sugar', 20.4)
    expectQuantity(list, 'salt', 3.6)
    expectQuantity(list, 'vanilla', 3.6)
  })

  it('scales a non-standard count of 3 as base × 3/4', () => {
    const list = quantities(3)
    expectQuantity(list, 'milk', 135)
    expectQuantity(list, 'flour', 90)
    expectQuantity(list, 'fat', 45)
    expectQuantity(list, 'baking-powder', 5.25)
    expectQuantity(list, 'sugar', 5.1)
    expectQuantity(list, 'salt', 0.9)
    expectQuantity(list, 'vanilla', 0.9)
  })

  it('does not alter quantities in vegan mode unless the recipe configures it', () => {
    const regular = quantities(8, false)
    const vegan = quantities(8, true)
    for (const scaled of vegan) {
      const matching = regular.find((item) => item.ingredient.id === scaled.ingredient.id)
      expect(matching).toBeDefined()
      expect(scaled.quantity).toBe(matching?.quantity)
    }
  })

  it('resolves vegan names from recipe data only', () => {
    const regular = quantities(4, false)
    const vegan = quantities(4, true)

    expect(regular.find((item) => item.ingredient.id === 'milk')?.name).toBe('Milk')
    expect(regular.find((item) => item.ingredient.id === 'fat')?.name).toBe('Butter')

    expect(vegan.find((item) => item.ingredient.id === 'milk')?.name).toBe('Malk')
    expect(vegan.find((item) => item.ingredient.id === 'fat')?.name).toBe('Margarine')
  })

  it('handles ingredients with unresolved quantities without producing NaN', () => {
    const recipeWithUnknown: Recipe = {
      id: 'sample',
      name: 'Sample',
      baseServings: 1,
      ingredients: [
        { id: 'known', name: 'Known', baseQuantity: 10, unit: 'g' },
        { id: 'unknown', name: 'Unknown', baseQuantity: null, unit: 'g' },
      ],
    }
    const list = calculateRecipe(recipeWithUnknown, 2)

    const known = list.find((item) => item.ingredient.id === 'known')
    const unknown = list.find((item) => item.ingredient.id === 'unknown')

    expect(known?.quantity).toBe(20)
    expect(unknown?.quantity).toBeNull()
    expect(Number.isNaN(unknown?.quantity)).toBe(false)
  })

  it('throws for invalid target servings', () => {
    expect(() => quantities(0)).toThrow()
    expect(() => quantities(Number.NaN)).toThrow()
  })
})
