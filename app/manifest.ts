import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Md. Hasib Reza — Virtualization & Private Cloud Specialist',
    short_name: 'Hasib Reza',
    description:
      'CIO & AMD at Sonali Life Insurance PLC. 16+ years in VMware private cloud, data centre, networking and cybersecurity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#16181b',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
