import { describe, expect, it } from 'vitest'
import { calculateRecipe } from '../../src/domain/calculateRecipe'
import { getRecipe } from '../../src/recipes'
import type { ScaledIngredient } from '../../src/domain/calculateRecipe'
import type { Recipe } from '../../src/recipes/types'

const waffles = getRecipe('waffles')!
const bolitas = getRecipe('bolitas')!

function quantities(servings: number, vegan = false): ScaledIngredient[] {
  return calculateRecipe(waffles, servings, { vegan })
}

function expectQuantity(list: ScaledIngredient[], id: string, expected: number): void {
  const entry = list.find((scaled) => scaled.ingredient.id === id)
  expect(entry).toBeDefined()
  expect(entry?.quantity).toBeCloseTo(expected, 6)
}

function expectUsQuantity(list: ScaledIngredient[], id: string, expected: number): void {
  const entry = list.find((scaled) => scaled.ingredient.id === id)
  expect(entry).toBeDefined()
  expect(entry?.usQuantity).toBeCloseTo(expected, 6)
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

  it('scales a non-standard count of 3 as base * 3/4', () => {
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
      nameKey: 'sample',
      scaling: {
        baseServings: 1,
        min: 1,
        max: 10,
        countHeadingKey: '',
        increaseLabelKey: '',
        decreaseLabelKey: '',
        unitLabelKey: '',
      },
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

  it('throws for invalid target servings on a scalable recipe', () => {
    expect(() => quantities(0)).toThrow()
    expect(() => quantities(Number.NaN)).toThrow()
  })
})

describe('fixed-batch recipes', () => {
  it('returns base quantities when no targetServings is provided', () => {
    const list = calculateRecipe(bolitas)
    const redBeans = list.find((item) => item.ingredient.id === 'red-beans')
    expect(redBeans?.quantity).toBe(1)

    const coconutOil = list.find((item) => item.ingredient.id === 'coconut-oil')
    expect(coconutOil?.quantity).toBe(60)

    const cocoa = list.find((item) => item.ingredient.id === 'cocoa-powder')
    expect(cocoa?.quantity).toBe(31)
  })

  it('does not scale ingredients for a fixed-batch recipe', () => {
    const list = calculateRecipe(bolitas)
    const sugar = list.find((item) => item.ingredient.id === 'raw-cane-sugar')
    expect(sugar?.quantity).toBe(55)
  })

  it('handles optional ingredients with null quantities', () => {
    const list = calculateRecipe(bolitas)
    const flavoring = list.find((item) => item.ingredient.id === 'flavoring')
    expect(flavoring?.quantity).toBeNull()
    expect(flavoring?.ingredient.optional).toBe(true)

    const coating = list.find((item) => item.ingredient.id === 'coating')
    expect(coating?.quantity).toBeNull()
    expect(coating?.ingredient.optional).toBe(true)
  })

  it('does not require targetServings for a recipe without scaling', () => {
    expect(() => calculateRecipe(bolitas)).not.toThrow()
  })
})

describe('US quantities', () => {
  it('returns base US quantities for 4 waffles', () => {
    const list = quantities(4)
    expectUsQuantity(list, 'milk', 0.75)
    expectUsQuantity(list, 'flour', 1)
    expectUsQuantity(list, 'fat', 0.25)
    expectUsQuantity(list, 'baking-powder', 1.5)
    expectUsQuantity(list, 'sugar', 1.5)
    expectUsQuantity(list, 'salt', 0.25)
    expectUsQuantity(list, 'vanilla', 0.25)
  })

  it('scales US quantities proportionally', () => {
    const list = quantities(8)
    expectUsQuantity(list, 'milk', 1.5)
    expectUsQuantity(list, 'flour', 2)
    expectUsQuantity(list, 'fat', 0.5)
    expectUsQuantity(list, 'baking-powder', 3)
  })

  it('returns correct US units for waffle ingredients', () => {
    const list = quantities(4)
    const milk = list.find((s) => s.ingredient.id === 'milk')
    expect(milk?.usUnit).toBe('cup')
    const flour = list.find((s) => s.ingredient.id === 'flour')
    expect(flour?.usUnit).toBe('cup')
    const bp = list.find((s) => s.ingredient.id === 'baking-powder')
    expect(bp?.usUnit).toBe('tsp')
  })

  it('returns base US quantities for bolitas', () => {
    const list = calculateRecipe(bolitas)
    expectUsQuantity(list, 'coconut-oil', 0.25)
    expectUsQuantity(list, 'raw-cane-sugar', 0.25)
    expectUsQuantity(list, 'cocoa-powder', 0.33)
  })

  it('returns correct US units for bolitas ingredients', () => {
    const list = calculateRecipe(bolitas)
    const coconut = list.find((s) => s.ingredient.id === 'coconut-oil')
    expect(coconut?.usUnit).toBe('cup')
    const cocoa = list.find((s) => s.ingredient.id === 'cocoa-powder')
    expect(cocoa?.usUnit).toBe('cup')
  })

  it('ingredients without US equivalents fall back to metric', () => {
    const list = quantities(4)
    const milk = list.find((s) => s.ingredient.id === 'milk')
    expect(milk?.usQuantity).toBeDefined()
    expect(milk?.usUnit).toBe('cup')
  })
})

describe('vegan cake recipe', () => {
  const cake = getRecipe('vegan-cake')!

  it('exists in the recipe catalog', () => {
    expect(cake).toBeDefined()
    expect(cake.id).toBe('vegan-cake')
  })

  it('has no scaling (fixed batch)', () => {
    expect(cake.scaling).toBeUndefined()
  })

  it('has variants defined', () => {
    expect(cake.variants).toBeDefined()
    expect(cake.variants).toHaveLength(2)
    expect(cake.variants![0].id).toBe('basic')
    expect(cake.variants![1].id).toBe('zebra')
  })

  it('defaults to the basic variant', () => {
    expect(cake.defaultVariantId).toBe('basic')
  })

  it('basic variant has 9 ingredients', () => {
    const basic = cake.variants![0]
    expect(basic.ingredients).toHaveLength(9)
  })

  it('basic variant does not include cocoa-extra', () => {
    const basic = cake.variants![0]
    const ids = basic.ingredients.map((i) => i.id)
    expect(ids).not.toContain('cocoa-extra')
  })

  it('zebra variant has 10 ingredients (basic + extra cocoa)', () => {
    const zebra = cake.variants![1]
    expect(zebra.ingredients).toHaveLength(10)
  })

  it('zebra variant includes cocoa-extra', () => {
    const zebra = cake.variants![1]
    const extra = zebra.ingredients.find((i) => i.id === 'cocoa-extra')
    expect(extra).toBeDefined()
    expect(extra?.baseQuantity).toBe(16)
    expect(extra?.unit).toBe('g')
  })

  it('basic variant returns base quantities via calculateRecipe', () => {
    const basicIngredients = cake.variants![0].ingredients
    const list = calculateRecipe(cake, undefined, { ingredients: basicIngredients })
    const flour = list.find((i) => i.ingredient.id === 'flour')
    expect(flour?.quantity).toBe(240)
    expect(flour?.unit).toBe('g')
  })

  it('zebra variant returns base quantities plus extra cocoa', () => {
    const zebraIngredients = cake.variants![1].ingredients
    const list = calculateRecipe(cake, undefined, { ingredients: zebraIngredients })
    const extra = list.find((i) => i.ingredient.id === 'cocoa-extra')
    expect(extra?.quantity).toBe(16)
    expect(extra?.unit).toBe('g')
  })

  it('basic variant has direction ids', () => {
    const basic = cake.variants![0]
    expect(basic.directionIds).toBeDefined()
    expect(basic.directionIds!.length).toBeGreaterThan(0)
  })

  it('zebra variant has more directions than basic', () => {
    const basic = cake.variants![0]
    const zebra = cake.variants![1]
    expect(zebra.directionIds!.length).toBeGreaterThan(basic.directionIds!.length)
  })

  it('does not throw when calculating without targetServings', () => {
    expect(() => calculateRecipe(cake)).not.toThrow()
  })
})
