import { formatQuantity } from '../domain/formatQuantity'
import type { ScaledIngredient } from '../domain/calculateRecipe'
import { useI18n } from '../i18n/I18nContext'
import type { MessageKey } from '../i18n/messages'

type IngredientRowProps = {
  ingredient: ScaledIngredient
}

export function IngredientRow({ ingredient }: IngredientRowProps) {
  const { t } = useI18n()
  const hasVeganName = ingredient.ingredient.veganName != null
  const nameKey = (ingredient.vegan && hasVeganName
    ? `ingredient.${ingredient.ingredient.id}.vegan`
    : `ingredient.${ingredient.ingredient.id}`) as MessageKey
  const amount =
    ingredient.quantity === null
      ? null
      : `${formatQuantity(ingredient.quantity)} ${ingredient.unit}`.trim()

  return (
    <li className="ingredient-row">
      <span className="ingredient-name">{t(nameKey)}</span>
      <span className="ingredient-amount">{amount ?? '—'}</span>
    </li>
  )
}
