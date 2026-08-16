import { describe, expect, it } from 'vitest'
import { formatQuantity } from '../../src/domain/formatQuantity'

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
