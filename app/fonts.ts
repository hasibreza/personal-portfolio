import localFont from 'next/font/local'

/* Self-hosted variable fonts (SIL Open Font License — see app/fonts/LICENSE-*.txt).
   Served from this site; nothing is loaded from Google at runtime. */

export const inter = localFont({
  src: './fonts/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
})

export const spaceGrotesk = localFont({
  src: './fonts/space-grotesk-latin-wght-normal.woff2',
  variable: '--font-space-grotesk',
  weight: '300 700',
  display: 'swap',
})

export const jetbrainsMono = localFont({
  src: './fonts/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-jetbrains-mono',
  weight: '100 800',
  display: 'swap',
})
