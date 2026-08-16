import { locales, type Locale } from './messages'

const QUERY_PARAMS = ['lang', 'locale'] as const

function matchLocale(tag: string): Locale | null {
  const normalized = tag.trim().toLowerCase()
  for (const locale of locales) {
    if (normalized === locale || normalized.startsWith(`${locale}-`)) {
      return locale
    }
  }
  return null
}

export function detectLocale(languageTag: string, query: string): Locale {
  const params = new URLSearchParams(query)
  for (const param of QUERY_PARAMS) {
    const value = params.get(param)
    if (value) {
      const matched = matchLocale(value)
      if (matched) {
        return matched
      }
    }
  }
  return matchLocale(languageTag) ?? 'en'
}
