const FRACTIONS: [number, string][] = [
  [1 / 12, '1/12'],
  [1 / 6, '1/6'],
  [1 / 4, '1/4'],
  [1 / 3, '1/3'],
  [5 / 12, '5/12'],
  [1 / 2, '1/2'],
  [7 / 12, '7/12'],
  [2 / 3, '2/3'],
  [3 / 4, '3/4'],
  [5 / 6, '5/6'],
  [11 / 12, '11/12'],
]

function nearestFraction(decimal: number): string | null {
  let best: [number, string] | null = null
  let bestDist = Infinity
  for (const [value, label] of FRACTIONS) {
    const dist = Math.abs(decimal - value)
    if (dist < bestDist) {
      bestDist = dist
      best = [value, label]
    }
  }
  if (best == null || bestDist > 0.06) return null
  return best[1]
}

export function formatQuantity(value: number): string {
  if (!Number.isFinite(value)) {
    return ''
  }
  const cleaned = Number(value.toFixed(6))
  return String(cleaned)
}

export function formatUsQuantity(value: number): string {
  if (!Number.isFinite(value)) {
    return ''
  }
  const whole = Math.floor(value)
  const decimal = value - whole
  if (decimal < 0.06) {
    return String(whole || value)
  }
  const frac = nearestFraction(decimal)
  if (frac == null) {
    return formatQuantity(value)
  }
  if (whole > 0) {
    return `${whole} ${frac}`
  }
  return frac
}
