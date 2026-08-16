import { describe, expect, it } from 'vitest'
import { formatQuantity, formatUsQuantity } from '../../src/domain/formatQuantity'

describe('formatQuantity', () => {
  it.each([
    [180, '180'],
    [120, '120'],
    [60, '60'],
    [7, '7'],
    [6.8, '6.8'],
    [3.5, '3.5'],
    [1.2, '1.2'],
    [0.6, '0.6'],
    [0.3, '0.3'],
    [5.25, '5.25'],
    [0.075, '0.075'],
    [13.6, '13.6'],
    [360, '360'],
    [0, '0'],
  ])('formats %f as "%s"', (value, expected) => {
    expect(formatQuantity(value)).toBe(expected)
  })

  it('strips floating point noise', () => {
    expect(formatQuantity(0.8999999999999999)).toBe('0.9')
    expect(formatQuantity(0.1 + 0.2)).toBe('0.3')
    expect(formatQuantity(1.7 * 3)).toBe('5.1')
  })

  it('returns an empty string for non-finite values', () => {
    expect(formatQuantity(Number.NaN)).toBe('')
    expect(formatQuantity(Number.POSITIVE_INFINITY)).toBe('')
    expect(formatQuantity(Number.NEGATIVE_INFINITY)).toBe('')
  })
})

describe('formatUsQuantity', () => {
  it('formats whole numbers without fractions', () => {
    expect(formatUsQuantity(1)).toBe('1')
    expect(formatUsQuantity(2)).toBe('2')
    expect(formatUsQuantity(0)).toBe('0')
  })

  it('formats common baking fractions', () => {
    expect(formatUsQuantity(0.25)).toBe('1/4')
    expect(formatUsQuantity(0.33)).toBe('1/3')
    expect(formatUsQuantity(0.5)).toBe('1/2')
    expect(formatUsQuantity(0.67)).toBe('2/3')
    expect(formatUsQuantity(0.75)).toBe('3/4')
  })

  it('formats mixed numbers', () => {
    expect(formatUsQuantity(1.25)).toBe('1 1/4')
    expect(formatUsQuantity(1.5)).toBe('1 1/2')
    expect(formatUsQuantity(1.75)).toBe('1 3/4')
    expect(formatUsQuantity(2.5)).toBe('2 1/2')
  })

  it('falls back to decimal for awkward values', () => {
    expect(formatUsQuantity(0.17)).toBe('1/6')
    expect(formatUsQuantity(2.858344)).toBe('2 5/6')
    expect(formatUsQuantity(0.08)).toBe('1/12')
  })

  it('returns an empty string for non-finite values', () => {
    expect(formatUsQuantity(Number.NaN)).toBe('')
    expect(formatUsQuantity(Number.POSITIVE_INFINITY)).toBe('')
  })
})
