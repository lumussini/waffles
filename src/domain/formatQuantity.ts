export function formatQuantity(value: number): string {
  if (!Number.isFinite(value)) {
    return ''
  }
  const cleaned = Number(value.toFixed(6))
  return String(cleaned)
}
