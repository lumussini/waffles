export function WaffleIllustration() {
  return (
    <svg
      className="waffle-illustration"
      viewBox="0 0 260 240"
      role="img"
      aria-label="A cheerful waffle with butter"
    >
      <defs>
        <pattern id="waffle-grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="#b96a1f" strokeWidth="6" strokeLinecap="round" />
        </pattern>
      </defs>
      <ellipse cx="130" cy="152" rx="96" ry="72" fill="#8a4b1d" />
      <ellipse cx="130" cy="148" rx="96" ry="70" fill="#c97b2d" />
      <rect x="40" y="60" width="180" height="150" rx="20" fill="#e89b3c" stroke="#b96a1f" strokeWidth="6" />
      <rect x="40" y="60" width="180" height="150" rx="20" fill="url(#waffle-grid)" />
      <rect x="100" y="42" width="60" height="40" rx="10" fill="#ffe066" stroke="#d9a400" strokeWidth="5" />
      <path d="M100 60h60" stroke="#d9a400" strokeWidth="4" />
      <circle cx="108" cy="132" r="6" fill="#4a2a08" />
      <circle cx="152" cy="132" r="6" fill="#4a2a08" />
      <path d="M114 156 Q130 170 146 156" fill="none" stroke="#4a2a08" strokeWidth="5" strokeLinecap="round" />
      <circle cx="96" cy="146" r="7" fill="#f9b4a0" opacity="0.85" />
      <circle cx="164" cy="146" r="7" fill="#f9b4a0" opacity="0.85" />
    </svg>
  )
}
