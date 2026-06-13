import React from 'react'
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg'

// Lightweight stroke-based icon set (Feather-style) so the whole app shares one
// cohesive, theme-aware visual language instead of inconsistent emoji.
export type IconName =
  | 'home'
  | 'sounds'
  | 'mixer'
  | 'timer'
  | 'settings'
  | 'play'
  | 'pause'
  | 'stop'
  | 'shuffle'
  | 'moon'
  | 'sun'
  | 'plus'
  | 'save'
  | 'search'
  | 'close'
  | 'check'
  | 'lock'
  | 'trash'
  | 'chevronRight'
  | 'share'
  | 'star'
  | 'volume'
  | 'volumeLow'
  | 'volumeMute'
  | 'wind'
  | 'sliders'
  | 'heart'
  | 'cloud'
  | 'alert'
  | 'sparkles'
  | 'refresh'

interface IconProps {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
  fill?: string
}

function IconInner({ name, size = 24, color = '#fff', strokeWidth = 2, fill = 'none' }: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill,
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderPaths(name, color, common)}
    </Svg>
  )
}

function renderPaths(name: IconName, color: string, c: any) {
  switch (name) {
    case 'home':
      return (
        <>
          <Path d="M3 10.5 12 3l9 7.5" {...c} />
          <Path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" {...c} />
          <Path d="M9.5 21v-6h5v6" {...c} />
        </>
      )
    case 'sounds':
      return (
        <>
          <Line x1="4" y1="12" x2="4" y2="12" {...c} />
          <Path d="M3 13v-2M7 16V8M11 18V6M15 15V9M19 13v-2M21 12.5v-1" {...c} />
        </>
      )
    case 'mixer':
    case 'sliders':
      return (
        <>
          <Line x1="4" y1="21" x2="4" y2="14" {...c} />
          <Line x1="4" y1="10" x2="4" y2="3" {...c} />
          <Line x1="12" y1="21" x2="12" y2="12" {...c} />
          <Line x1="12" y1="8" x2="12" y2="3" {...c} />
          <Line x1="20" y1="21" x2="20" y2="16" {...c} />
          <Line x1="20" y1="12" x2="20" y2="3" {...c} />
          <Line x1="1" y1="14" x2="7" y2="14" {...c} />
          <Line x1="9" y1="8" x2="15" y2="8" {...c} />
          <Line x1="17" y1="16" x2="23" y2="16" {...c} />
        </>
      )
    case 'timer':
      return (
        <>
          <Circle cx="12" cy="13" r="8" {...c} />
          <Line x1="12" y1="13" x2="12" y2="9" {...c} />
          <Line x1="12" y1="13" x2="15" y2="14.5" {...c} />
          <Line x1="9" y1="2" x2="15" y2="2" {...c} />
          <Line x1="12" y1="2" x2="12" y2="5" {...c} />
        </>
      )
    case 'settings':
      return (
        <>
          <Circle cx="12" cy="12" r="3" {...c} />
          <Path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 8.5 19a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 5 8.5a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9.5a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9.5a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" {...c} />
        </>
      )
    case 'play':
      return <Path d="M7 4.5v15l13-7.5z" stroke={color} strokeWidth={c.strokeWidth} strokeLinejoin="round" fill={color} />
    case 'pause':
      return (
        <>
          <Rect x="6" y="5" width="4" height="14" rx="1" fill={color} stroke={color} strokeWidth={c.strokeWidth} />
          <Rect x="14" y="5" width="4" height="14" rx="1" fill={color} stroke={color} strokeWidth={c.strokeWidth} />
        </>
      )
    case 'stop':
      return <Rect x="6" y="6" width="12" height="12" rx="2" fill={color} stroke={color} strokeWidth={c.strokeWidth} />
    case 'shuffle':
      return (
        <>
          <Path d="M16 3h5v5" {...c} />
          <Path d="M4 20 21 3" {...c} />
          <Path d="M21 16v5h-5" {...c} />
          <Path d="M15 15l6 6" {...c} />
          <Path d="M4 4l5 5" {...c} />
        </>
      )
    case 'moon':
      return <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" {...c} />
    case 'sun':
      return (
        <>
          <Circle cx="12" cy="12" r="4" {...c} />
          <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" {...c} />
        </>
      )
    case 'plus':
      return <Path d="M12 5v14M5 12h14" {...c} />
    case 'save':
      return (
        <>
          <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" {...c} />
          <Polyline points="17 21 17 13 7 13 7 21" {...c} />
          <Polyline points="7 3 7 8 15 8" {...c} />
        </>
      )
    case 'search':
      return (
        <>
          <Circle cx="11" cy="11" r="7" {...c} />
          <Line x1="21" y1="21" x2="16.65" y2="16.65" {...c} />
        </>
      )
    case 'close':
      return <Path d="M18 6 6 18M6 6l12 12" {...c} />
    case 'check':
      return <Polyline points="20 6 9 17 4 12" {...c} />
    case 'lock':
      return (
        <>
          <Rect x="4" y="11" width="16" height="10" rx="2" {...c} />
          <Path d="M8 11V7a4 4 0 0 1 8 0v4" {...c} />
        </>
      )
    case 'trash':
      return (
        <>
          <Polyline points="3 6 5 6 21 6" {...c} />
          <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...c} />
        </>
      )
    case 'chevronRight':
      return <Polyline points="9 6 15 12 9 18" {...c} />
    case 'share':
      return (
        <>
          <Circle cx="18" cy="5" r="3" {...c} />
          <Circle cx="6" cy="12" r="3" {...c} />
          <Circle cx="18" cy="19" r="3" {...c} />
          <Line x1="8.6" y1="10.5" x2="15.4" y2="6.5" {...c} />
          <Line x1="8.6" y1="13.5" x2="15.4" y2="17.5" {...c} />
        </>
      )
    case 'star':
      return <Path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" {...c} />
    case 'heart':
      return <Path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21.3l8.8-8.6a5 5 0 0 0 0-7.1z" {...c} />
    case 'volume':
      return (
        <>
          <Path d="M3 9v6h4l5 4V5L7 9z" {...c} />
          <Path d="M16 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12" {...c} />
        </>
      )
    case 'volumeLow':
      return (
        <>
          <Path d="M3 9v6h4l5 4V5L7 9z" {...c} />
          <Path d="M16 8.5a5 5 0 0 1 0 7" {...c} />
        </>
      )
    case 'volumeMute':
      return (
        <>
          <Path d="M3 9v6h4l5 4V5L7 9z" {...c} />
          <Path d="M22 9l-6 6M16 9l6 6" {...c} />
        </>
      )
    case 'wind':
      return <Path d="M3 8h11a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h8" {...c} />
    case 'cloud':
      return <Path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 1 0 6 14.5" {...c} />
    case 'alert':
      return (
        <>
          <Path d="M10.3 4l-8 13.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0z" {...c} />
          <Line x1="12" y1="9" x2="12" y2="13" {...c} />
          <Line x1="12" y1="17" x2="12" y2="17" {...c} />
        </>
      )
    case 'sparkles':
      return (
        <>
          <Path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" {...c} />
          <Path d="M19 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" {...c} />
        </>
      )
    case 'refresh':
      return (
        <>
          <Polyline points="23 4 23 10 17 10" {...c} />
          <Path d="M20.5 14a8.5 8.5 0 1 1-2-8.9L23 10" {...c} />
        </>
      )
    default:
      return null
  }
}

export const Icon = React.memo(IconInner)
