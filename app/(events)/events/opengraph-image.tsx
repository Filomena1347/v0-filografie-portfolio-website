import { ImageResponse } from 'next/og'

export const alt = 'Event Coverage Prague – Your event in good hands.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
          background: '#FFFFFF',
          color: '#111111',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, letterSpacing: 3, color: '#5E5E5E' }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: '#E5484D', marginRight: 18 }} />
          PHOTO & VIDEO FOR TRADE FAIRS AND CONFERENCES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40, fontSize: 124, lineHeight: 1, letterSpacing: -4 }}>
          <span>Your event</span>
          <span>in good hands.</span>
        </div>
      </div>
    ),
    size,
  )
}
