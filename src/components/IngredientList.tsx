import type { ScaledIngredient } from '../domain/calculateRecipe'
import { useI18n } from '../i18n/I18nContext'
import { IngredientRow } from './IngredientRow'

type IngredientListProps = {
  ingredients: ScaledIngredient[]
}

export function IngredientList({ ingredients }: IngredientListProps) {
  const { t } = useI18n()
  return (
    <ul className="ingredient-list" aria-label={t('ingredients')}>
      {ingredients.map((ingredient) => (
        <IngredientRow key={ingredient.ingredient.id} ingredient={ingredient} />
      ))}
    </ul>
  )
}
