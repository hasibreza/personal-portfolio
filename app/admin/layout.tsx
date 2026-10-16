import type { Metadata } from 'next'

/** The whole /admin area is private: never indexed, never followed. */
export const metadata: Metadata = {
  title: { absolute: 'Admin – Hasib Reza' },
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
