import { useI18n } from '../i18n/I18nContext'
import type { MessageKey } from '../i18n/messages'

type DirectionListProps = {
  directionIds: string[]
}

export function DirectionList({ directionIds }: DirectionListProps) {
  const { t } = useI18n()
  return (
    <section className="directions">
      <h2 className="directions-heading">{t('directions')}</h2>
      <ol className="directions-list">
        {directionIds.map((id) => (
          <li key={id} className="direction-item">
            {t(`direction.${id}` as MessageKey)}
          </li>
        ))}
      </ol>
    </section>
  )
}
