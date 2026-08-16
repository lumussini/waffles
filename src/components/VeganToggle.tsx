import { useI18n } from '../i18n/I18nContext'

type VeganToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function VeganToggle({ checked, onChange }: VeganToggleProps) {
  const { t } = useI18n()
  return (
    <label className="vegan-toggle">
      <input
        type="checkbox"
        className="vegan-toggle-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="vegan-toggle-label">{t('veganize')}</span>
    </label>
  )
}
