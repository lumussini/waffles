import { resolveIngredientName } from '../recipes'
import type { Ingredient, Recipe } from '../recipes/types'

export type ScaledIngredient = {
  ingredient: Recipe['ingredients'][number]
  name: string
  quantity: number | null
  unit: string
  usQuantity: number | null
  usUnit: string
  vegan: boolean
}

export type CalculateOptions = {
  vegan?: boolean
  ingredients?: Ingredient[]
}

export function calculateRecipe(
  recipe: Recipe,
  targetServings?: number,
  options: CalculateOptions = {},
): ScaledIngredient[] {
  const vegan = options.vegan === true
  const ingredients = options.ingredients ?? recipe.ingredients

  let factor: number
  if (recipe.scaling) {
    if (targetServings === undefined || !Number.isFinite(targetServings) || targetServings <= 0) {
      throw new Error(
        `calculateRecipe: invalid targetServings "${targetServings}" for scalable recipe`,
      )
    }
    factor = targetServings / recipe.scaling.baseServings
  } else {
    factor = 1
  }

  return ingredients.map((ingredient) => {
    const name = resolveIngredientName(ingredient, vegan)
    const unit = vegan ? (ingredient.veganUnit ?? ingredient.unit) : ingredient.unit

    let quantity: number | null
    if (ingredient.baseQuantity === null) {
      quantity = null
    } else {
      const baseQuantity = vegan
        ? (ingredient.veganBaseQuantity ?? ingredient.baseQuantity)
        : ingredient.baseQuantity
      quantity = baseQuantity * factor
    }

    let usQuantity: number | null
    const usUnit = ingredient.usUnit ?? unit
    if (ingredient.usQuantity == null) {
      usQuantity = quantity
    } else {
      usQuantity = ingredient.usQuantity * factor
    }

    return { ingredient, name, quantity, unit, usQuantity, usUnit, vegan }
  })
}
