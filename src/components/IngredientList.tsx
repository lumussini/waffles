import type { ScaledIngredient } from '../domain/calculateRecipe'
import type { UnitSystem } from '../recipes/types'
import { useI18n } from '../i18n/I18nContext'
import { IngredientRow } from './IngredientRow'

type IngredientListProps = {
  ingredients: ScaledIngredient[]
  units: UnitSystem
}

export function IngredientList({ ingredients, units }: IngredientListProps) {
  const { t } = useI18n()
  return (
    <ul className="ingredient-list" aria-label={t('ingredients')}>
      {ingredients.map((ingredient) => (
        <IngredientRow key={ingredient.ingredient.id} ingredient={ingredient} units={units} />
      ))}
    </ul>
  )
}
