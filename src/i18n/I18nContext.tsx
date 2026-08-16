import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { detectLocale } from './locale'
import { messages, type Locale, type MessageKey } from './messages'

export type I18nValue = {
  locale: Locale
  t: (key: MessageKey) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const value = useMemo<I18nValue>(() => {
    const locale = detectLocale(navigator.language, window.location.search)
    return {
      locale,
      t: (key: MessageKey) => messages[locale][key] ?? messages.en[key],
    }
  }, [])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return value
}
