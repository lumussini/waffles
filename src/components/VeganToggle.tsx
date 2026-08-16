type VeganToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function VeganToggle({ checked, onChange }: VeganToggleProps) {
  return (
    <label className="vegan-toggle">
      <input
        type="checkbox"
        className="vegan-toggle-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="vegan-toggle-label">VEGANIZE!?</span>
    </label>
  )
}
