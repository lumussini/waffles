import { formatQuantity } from '../domain/formatQuantity'
import type { ScaledIngredient } from '../domain/calculateRecipe'

type IngredientRowProps = {
  ingredient: ScaledIngredient
}

export function IngredientRow({ ingredient }: IngredientRowProps) {
  const amount =
    ingredient.quantity === null
      ? null
      : `${formatQuantity(ingredient.quantity)} ${ingredient.unit}`.trim()

  return (
    <li className="ingredient-row">
      <span className="ingredient-name">{ingredient.name}</span>
      <span className="ingredient-amount">{amount ?? '—'}</span>
    </li>
  )
}
