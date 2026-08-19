interface MonogramProps {
  className?: string
  size?: number
}

export default function Monogram({ className = '', size = 72 }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <circle cx="60" cy="60" r="56" fill="none" stroke="#C9A962" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="48" fill="none" stroke="#C9A962" strokeOpacity="0.4" strokeWidth="0.6" />
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fill="#F5E6C8"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="28"
        letterSpacing="4"
      >
        A · R
      </text>
    </svg>
  )
}
