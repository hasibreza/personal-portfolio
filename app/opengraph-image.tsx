import { ImageResponse } from 'next/og'

export const alt = 'Md. Hasib Reza — Virtualization & Private Cloud Infrastructure Specialist'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Default social share card (used by every page without its own image). */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#111315',
        color: '#ECEEF0',
        padding: 72,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: '#ECEEF0',
            color: '#111315',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          HR
        </div>
        <div style={{ fontSize: 26, color: '#5B8CFF', letterSpacing: 2 }}>
          VIRTUALIZATION · PRIVATE CLOUD · INFRASTRUCTURE
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1 }}>Md. Hasib Reza</div>
        <div style={{ fontSize: 40, color: '#ECEEF0' }}>
          I build infrastructure that doesn&apos;t go down.
        </div>
        <div style={{ fontSize: 28, color: '#A3A9B1' }}>
          CIO &amp; AMD, Sonali Life Insurance PLC · 16+ years in enterprise infrastructure
        </div>
      </div>
    </div>,
    size,
  )
}
