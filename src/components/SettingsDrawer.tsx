import { useCallback, useEffect, useRef } from 'react'
import { useI18n } from '../i18n/I18nContext'
import type { UnitSystem } from '../recipes/types'

type SettingsDrawerProps = {
  units: UnitSystem
  onUnitsChange: (units: UnitSystem) => void
}

export function SettingsDrawer({ units, onUnitsChange }: SettingsDrawerProps) {
  const { t } = useI18n()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const isOpenRef = useRef(false)

  const close = useCallback(() => {
    if (!isOpenRef.current) return
    isOpenRef.current = false
    panelRef.current?.classList.remove('is-open')
    document.querySelector('.settings-drawer-backdrop')?.classList.remove('is-open')
    triggerRef.current?.focus()
  }, [])

  const open = useCallback(() => {
    if (isOpenRef.current) return
    isOpenRef.current = true
    panelRef.current?.classList.add('is-open')
    document.querySelector('.settings-drawer-backdrop')?.classList.add('is-open')
    panelRef.current?.focus()
  }, [])

  const toggle = useCallback(() => {
    if (isOpenRef.current) close()
    else open()
  }, [open, close])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenRef.current) close()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="settings-menu-button"
        onClick={toggle}
        aria-label={t('settingsLabel')}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      <div className="settings-drawer-backdrop" onClick={close} aria-hidden="true" />

      <div ref={panelRef} className="settings-drawer" role="dialog" aria-label={t('settingsLabel')} tabIndex={-1}>
        <div className="settings-drawer-header">
          <h2 className="settings-drawer-title">{t('settingsLabel')}</h2>
          <button type="button" className="settings-drawer-close" onClick={close} aria-label={t('closeMenu')}>
            ✕
          </button>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">{t('unitsLabel')}</h3>
          <div className="settings-radio-group" role="radiogroup" aria-label={t('unitsLabel')}>
            <label className={`settings-radio${units === 'metric' ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="units"
                value="metric"
                checked={units === 'metric'}
                onChange={() => onUnitsChange('metric')}
                className="sr-only"
              />
              <span className="settings-radio-label">{t('metricLabel')}</span>
            </label>
            <label className={`settings-radio${units === 'us' ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="units"
                value="us"
                checked={units === 'us'}
                onChange={() => onUnitsChange('us')}
                className="sr-only"
              />
              <span className="settings-radio-label">{t('usLabel')}</span>
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
