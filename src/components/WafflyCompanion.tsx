import { useEffect } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { WaffleIllustration } from './WaffleIllustration'

export const TIP_DURATION_MS = 4500

type WafflyCompanionProps = {
  message: string | null
  onClose: () => void
}

export function WafflyCompanion({ message, onClose }: WafflyCompanionProps) {
  const { t } = useI18n()
  useEffect(() => {
    if (!message) {
      return
    }
    const timer = window.setTimeout(onClose, TIP_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [message, onClose])

  const interactive = message !== null

  return (
    <aside
      className={message ? 'calculator-art is-active' : 'calculator-art'}
      onClick={interactive ? onClose : undefined}
      onKeyDown={(event) => {
        if (interactive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClose()
        }
      }}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? t('hideTip') : undefined}
    >
      <WaffleIllustration />
      {message && (
        <p className="companion-bubble" role="status">
          {message}
        </p>
      )}
    </aside>
  )
}
