import { resolveIngredientName } from '../recipes'
import type { Ingredient, Recipe } from '../recipes/types'

export type ScaledIngredient = {
  ingredient: Ingredient
  name: string
  quantity: number | null
  unit: string
  vegan: boolean
}

export type CalculateOptions = {
  vegan?: boolean
}

export function calculateRecipe(
  recipe: Recipe,
  targetServings: number,
  options: CalculateOptions = {},
): ScaledIngredient[] {
  if (!Number.isFinite(targetServings) || targetServings <= 0) {
    throw new Error(`calculateRecipe: invalid targetServings "${targetServings}"`)
  }

  const vegan = options.vegan === true
  const factor = targetServings / recipe.baseServings

  return recipe.ingredients.map((ingredient) => {
    const name = resolveIngredientName(ingredient, vegan)
    const unit = vegan ? (ingredient.veganUnit ?? ingredient.unit) : ingredient.unit

    if (ingredient.baseQuantity === null) {
      return { ingredient, name, quantity: null, unit, vegan }
    }

    const baseQuantity = vegan
      ? (ingredient.veganBaseQuantity ?? ingredient.baseQuantity)
      : ingredient.baseQuantity

    return { ingredient, name, quantity: baseQuantity * factor, unit, vegan }
  })
}
