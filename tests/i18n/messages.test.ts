import { describe, expect, it } from 'vitest'
import { locales, messages } from '../../src/i18n/messages'

describe('messages', () => {
  it('defines the same keys for every locale', () => {
    const enKeys = Object.keys(messages.en).sort()
    for (const locale of locales) {
      expect(Object.keys(messages[locale]).sort()).toEqual(enKeys)
    }
  })

  it('has no empty translations', () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(messages[locale])) {
        expect(value.trim(), `${locale}.${key}`).not.toBe('')
      }
    }
  })
})
