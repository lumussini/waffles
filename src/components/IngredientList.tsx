import type { ScaledIngredient } from '../domain/calculateRecipe'
import { IngredientRow } from './IngredientRow'

type IngredientListProps = {
  ingredients: ScaledIngredient[]
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <ul className="ingredient-list" aria-label="Ingredients">
      {ingredients.map((ingredient) => (
        <IngredientRow key={ingredient.ingredient.id} ingredient={ingredient} />
      ))}
    </ul>
  )
}
