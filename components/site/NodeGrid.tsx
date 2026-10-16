/** Decorative private-cloud node grid behind the hero portrait. */
export function NodeGrid({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 420 480"
      fill="none"
      className={`text-accent pointer-events-none ${className}`}
    >
      <g stroke="currentColor" strokeOpacity="0.25">
        <path d="M20 60H400M20 180H400M20 300H400M20 420H400M60 20V460M180 20V460M300 20V460" />
        <path
          d="M60 60L180 180L300 60M180 180L300 300L180 420M60 300L180 180"
          strokeOpacity="0.45"
        />
      </g>
      <g fill="currentColor">
        <circle cx="60" cy="60" r="5" />
        <circle cx="300" cy="60" r="5" />
        <circle cx="180" cy="180" r="6" />
        <circle cx="60" cy="300" r="5" />
        <circle cx="300" cy="300" r="5" />
        <circle cx="180" cy="420" r="5" />
      </g>
    </svg>
  )
}
