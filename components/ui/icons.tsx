import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const MoonIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Svg>
)
export const SunIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
)
export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
)
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)
export const DownloadIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={2}>
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </Svg>
)
export const ServerIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.6}>
    <rect x="3" y="4" width="18" height="6" rx="1.5" />
    <rect x="3" y="14" width="18" height="6" rx="1.5" />
    <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
  </Svg>
)
export const DatabaseIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.6}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </Svg>
)
export const NetworkIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.6}>
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="5" cy="19" r="2.5" />
    <circle cx="19" cy="19" r="2.5" />
    <path d="M12 7.5v4M12 11.5L6.5 17M12 11.5l5.5 5.5" />
  </Svg>
)
export const ShieldIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.6}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
)
export const ChartIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.6}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </Svg>
)
export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Svg>
)
export const LinkedInIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </Svg>
)
export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-6" />
  </Svg>
)
export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
)
export const UploadIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.6}>
    <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
  </Svg>
)
export const RssIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={2}>
    <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1.5" />
  </Svg>
)
export const WarningIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={2}>
    <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
  </Svg>
)

export const expertiseIcons = {
  server: ServerIcon,
  database: DatabaseIcon,
  network: NetworkIcon,
  shield: ShieldIcon,
  chart: ChartIcon,
} as const

export type ExpertiseIconName = keyof typeof expertiseIcons
