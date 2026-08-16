import { describe, expect, it } from 'vitest'
import { detectLocale } from '../../src/i18n/locale'

describe('detectLocale', () => {
  it('detects German from the device language', () => {
    expect(detectLocale('de-DE', '')).toBe('de')
    expect(detectLocale('de', '')).toBe('de')
  })

  it('falls back to English for unsupported device languages', () => {
    expect(detectLocale('en-US', '')).toBe('en')
    expect(detectLocale('fr-FR', '')).toBe('en')
  })

  it('prefers the lang query parameter over the device language', () => {
    expect(detectLocale('en-US', '?lang=de')).toBe('de')
    expect(detectLocale('de-DE', '?lang=en')).toBe('en')
  })

  it('also supports the locale query parameter', () => {
    expect(detectLocale('en-US', '?locale=de')).toBe('de')
  })

  it('falls back to the device language for an unsupported query value', () => {
    expect(detectLocale('de-DE', '?lang=fr')).toBe('de')
    expect(detectLocale('en-US', '?lang=fr')).toBe('en')
  })

  it('ignores unrelated query parameters', () => {
    expect(detectLocale('de-DE', '?source=test')).toBe('de')
  })
})
