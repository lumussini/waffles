import { useI18n } from '../i18n/I18nContext'
import type { MessageKey } from '../i18n/messages'
import type { RecipeVariant } from '../recipes/types'

type VariantSelectorProps = {
  variants: RecipeVariant[]
  selectedId: string
  onChange: (variantId: string) => void
}

export function VariantSelector({ variants, selectedId, onChange }: VariantSelectorProps) {
  const { t } = useI18n()

  return (
    <fieldset className="variant-selector">
      <legend className="sr-only">Recipe variant</legend>
      <div className="variant-selector-options" role="radiogroup">
        {variants.map((variant) => (
          <label
            key={variant.id}
            className={`variant-option${variant.id === selectedId ? ' is-active' : ''}`}
          >
            <input
              type="radio"
              name="recipe-variant"
              value={variant.id}
              checked={variant.id === selectedId}
              onChange={() => onChange(variant.id)}
              className="sr-only"
            />
            {t(variant.labelKey as MessageKey)}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
