import { useI18n } from '../i18n/I18nContext'
import type { MessageKey } from '../i18n/messages'
import type { Recipe } from '../recipes/types'
import { WaffleIllustration } from './WaffleIllustration'

type WelcomeScreenProps = {
  recipes: Recipe[]
  onSelectRecipe: (id: string) => void
}

export function WelcomeScreen({ recipes, onSelectRecipe }: WelcomeScreenProps) {
  const { t } = useI18n()

  return (
    <div className="welcome-screen">
      <p className="welcome-brand">Little Bites</p>

      <div className="welcome-hero">
        <div className="welcome-waffly">
          <WaffleIllustration />
          <p className="companion-bubble" role="status">
            {t('welcomeSubtitle')}
          </p>
        </div>
      </div>

      <div className="welcome-recipes">
        {recipes.map((recipe) => (
          <button
            key={recipe.id}
            type="button"
            className="welcome-recipe-card"
            onClick={() => onSelectRecipe(recipe.id)}
          >
            <span className="welcome-recipe-name">
              {t(recipe.nameKey as MessageKey)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
