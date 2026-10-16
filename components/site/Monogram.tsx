export function Monogram({ size = 40 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="bg-ink text-bg font-display flex items-center justify-center rounded-[10px] text-base font-bold"
    >
      HR
    </span>
  )
}
