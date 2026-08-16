import { useEffect, useState } from 'react'

type WaffleCountControlProps = {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export function WaffleCountControl({ value, min, max, onChange }: WaffleCountControlProps) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = (raw: string) => {
    const trimmed = raw.trim()
    if (trimmed === '') {
      setDraft(String(value))
      return
    }
    const parsed = Number(trimmed)
    if (Number.isNaN(parsed)) {
      setDraft(String(value))
      return
    }
    const clamped = Math.min(max, Math.max(min, Math.round(parsed)))
    onChange(clamped)
    setDraft(String(clamped))
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    setDraft(raw)
    const trimmed = raw.trim()
    if (trimmed !== '') {
      const parsed = Number(trimmed)
      if (!Number.isNaN(parsed)) {
        const clamped = Math.min(max, Math.max(min, Math.round(parsed)))
        onChange(clamped)
        setDraft(String(clamped))
      }
    }
  }

  const decrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const increment = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className="count-control">
      <button
        type="button"
        className="count-button"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease waffle count"
      >
        −
      </button>
      <input
        type="number"
        className="count-input"
        min={min}
        max={max}
        inputMode="numeric"
        value={draft}
        onChange={handleInputChange}
        onBlur={() => commit(draft)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commit(draft)
          }
        }}
        aria-label="Number of waffles"
      />
      <button
        type="button"
        className="count-button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase waffle count"
      >
        +
      </button>
    </div>
  )
}
