import { describe, expect, it } from 'vitest'
import { locales, messages, type MessageKey } from '../../src/i18n/messages'

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

  it('contains recipe name translations', () => {
    expect(messages.en['recipe.waffles']).toBe('Ultimate Waffles')
    expect(messages.de['recipe.waffles']).toBe('Ultimative Waffeln')
    expect(messages.en['recipe.bolitas']).toBe("Mechi's Chocolate Bean Balls")
    expect(messages.de['recipe.bolitas']).toBe('Mechis Schoko-Bohnenbällchen')
  })

  it('contains direction translations', () => {
    const directionKeys = [
      'direction.combine-dry',
      'direction.add-remaining',
      'direction.cook',
      'direction.top',
      'direction.process',
      'direction.chill',
      'direction.form',
      'direction.roll',
    ]
    for (const key of directionKeys) {
      expect(messages.en[key as MessageKey], `en.${key}`).toBeTruthy()
      expect(messages.de[key as MessageKey], `de.${key}`).toBeTruthy()
    }
  })

  it('contains bolitas ingredient translations', () => {
    const ingredientKeys = [
      'ingredient.red-beans',
      'ingredient.coconut-oil',
      'ingredient.raw-cane-sugar',
      'ingredient.cocoa-powder',
      'ingredient.flavoring',
      'ingredient.coating',
    ]
    for (const key of ingredientKeys) {
      expect(messages.en[key as MessageKey], `en.${key}`).toBeTruthy()
      expect(messages.de[key as MessageKey], `de.${key}`).toBeTruthy()
    }
  })

  it('contains note translations', () => {
    expect(messages.en['note.rinsed']).toBe('rinsed')
    expect(messages.de['note.rinsed']).toBe('gewaschen')
  })

  it('contains settings translations', () => {
    expect(messages.en.settingsLabel).toBe('Settings')
    expect(messages.de.settingsLabel).toBe('Einstellungen')
    expect(messages.en.unitsLabel).toBe('Units')
    expect(messages.de.unitsLabel).toBe('Einheiten')
    expect(messages.en.metricLabel).toBe('Metric (g, ml)')
    expect(messages.en.usLabel).toBe('US (cups, tsp)')
    expect(messages.de.metricLabel).toBe('Metrisch (g, ml)')
    expect(messages.de.usLabel).toBe('US (Tassen, TL)')
  })

  it('contains per-recipe welcome tip translations', () => {
    expect(messages.en['welcomeTip.waffles']).toBe("It's waffle time!")
    expect(messages.de['welcomeTip.waffles']).toBe('Es ist Waffelzeit!')
    expect(messages.en['welcomeTip.bolitas']).toBe('A birthday classic!')
    expect(messages.de['welcomeTip.bolitas']).toBe('Ein Geburtstagsklassiker!')
    expect(messages.en['welcomeTip.vegan-cake']).toBe('Moist and chocolatey!')
    expect(messages.de['welcomeTip.vegan-cake']).toBe('Feucht und schokoladig!')
  })

  it('contains vegan cake recipe translations', () => {
    expect(messages.en['recipe.vegan-cake']).toBe('Vegan Cake')
    expect(messages.de['recipe.vegan-cake']).toBe('Veganer Kuchen')
    expect(messages.en['variant.basic']).toBe('Basic')
    expect(messages.de['variant.basic']).toBe('Basis')
    expect(messages.en['variant.zebra']).toBe('Zebra')
    expect(messages.de['variant.zebra']).toBe('Zebra')
  })

  it('contains vegan cake ingredient translations', () => {
    const ingredientKeys = [
      'ingredient.cocoa',
      'ingredient.baking-soda',
      'ingredient.water',
      'ingredient.oil',
      'ingredient.vinegar',
      'ingredient.cocoa-extra',
    ]
    for (const key of ingredientKeys) {
      expect(messages.en[key as MessageKey], `en.${key}`).toBeTruthy()
      expect(messages.de[key as MessageKey], `de.${key}`).toBeTruthy()
    }
  })

  it('contains vegan cake direction translations', () => {
    const directionKeys = [
      'direction.cake.preheat',
      'direction.cake.mix-dry',
      'direction.cake.mix-wet',
      'direction.cake.combined',
      'direction.cake.pour',
      'direction.cake.bake',
      'direction.cake.cool',
      'direction.cake.serve',
      'direction.cake.separate',
      'direction.cake.cocoa-mix',
      'direction.cake.alternate',
      'direction.cake.swirl',
      'direction.cake.slice',
    ]
    for (const key of directionKeys) {
      expect(messages.en[key as MessageKey], `en.${key}`).toBeTruthy()
      expect(messages.de[key as MessageKey], `de.${key}`).toBeTruthy()
    }
  })
})
