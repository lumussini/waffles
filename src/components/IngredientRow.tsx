import { formatQuantity, formatUsQuantity } from '../domain/formatQuantity'
import type { ScaledIngredient } from '../domain/calculateRecipe'
import type { UnitSystem } from '../recipes/types'
import { useI18n } from '../i18n/I18nContext'
import type { MessageKey } from '../i18n/messages'

type IngredientRowProps = {
  ingredient: ScaledIngredient
  units: UnitSystem
}

export function IngredientRow({ ingredient, units }: IngredientRowProps) {
  const { t } = useI18n()
  const hasVeganName = ingredient.ingredient.veganName != null
  const nameKey = (ingredient.vegan && hasVeganName
    ? `ingredient.${ingredient.ingredient.id}.vegan`
    : `ingredient.${ingredient.ingredient.id}`) as MessageKey

  const optional = ingredient.ingredient.optional

  const useUs = units === 'us' && ingredient.usQuantity != null
  const displayQuantity = useUs ? ingredient.usQuantity : ingredient.quantity
  const displayUnit = useUs ? ingredient.usUnit : ingredient.unit

  const noteKey =
    !useUs && ingredient.ingredient.noteId
      ? (`note.${ingredient.ingredient.noteId}` as MessageKey)
      : undefined

  const amount =
    displayQuantity === null
      ? null
      : `${useUs ? formatUsQuantity(displayQuantity) : formatQuantity(displayQuantity)} ${displayUnit}`.trim()

  return (
    <li className={`ingredient-row${optional ? ' is-optional' : ''}`}>
      <span className="ingredient-name">
        {t(nameKey)}
        {optional && <span className="ingredient-optional">{t('optional')}</span>}
      </span>
      <span className="ingredient-amount">
        {amount ? (
          <>
            {amount}
            {noteKey && <span className="ingredient-note"> ({t(noteKey)})</span>}
          </>
        ) : (
          '—'
        )}
      </span>
    </li>
  )
}
