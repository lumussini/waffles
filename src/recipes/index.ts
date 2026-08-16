import { bolitas } from './bolitas'
import { veganCake } from './vegan-cake'
import { waffles } from './waffles'
import type { Ingredient, Recipe } from './types'

export type { Ingredient, Recipe, RecipeVariant } from './types'

export const recipes: Recipe[] = [waffles, bolitas, veganCake]

export function getRecipe(id: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id)
}

export function resolveIngredientName(ingredient: Ingredient, vegan: boolean): string {
  if (vegan && ingredient.veganName) {
    return ingredient.veganName
  }
  return ingredient.name
}
