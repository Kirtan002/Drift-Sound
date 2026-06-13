export const DARK = {
  bg:              '#0C0C12',
  bgSurface:       '#14141E',
  bgCard:          '#1C1C2A',
  bgCardHover:     '#222232',

  textPrimary:     '#F0EFE8',
  textSecondary:   '#8A8A9A',
  textMuted:       '#4A4A5A',

  accent:          '#6C8EFF',
  accentDim:       '#1A2348',
  accentGlow:      'rgba(108, 142, 255, 0.18)',

  green:           '#4ADE80',
  greenDim:        '#14291E',
  amber:           '#FBBF24',
  amberDim:        '#2D2208',
  red:             '#F87171',
  redDim:          '#2D0D0D',

  border:          'rgba(255,255,255,0.07)',
  borderStrong:    'rgba(255,255,255,0.13)',
  overlay:         'rgba(0,0,0,0.6)',

  // Ambient backdrop gradient stops (top glow → base).
  glowTop:         '#171A2E',
  glowMid:         '#101019',
  scrim:           'rgba(12,12,18,0.72)',
} as const

export const LIGHT = {
  bg:              '#F6F5F0',
  bgSurface:       '#FFFFFF',
  bgCard:          '#EDECE7',
  bgCardHover:     '#E4E2DC',

  textPrimary:     '#1A1A22',
  textSecondary:   '#6A6A7A',
  textMuted:       '#ABABBA',

  accent:          '#4A6BDB',
  accentDim:       '#E8ECFB',
  accentGlow:      'rgba(74, 107, 219, 0.12)',

  green:           '#16A34A',
  greenDim:        '#DCFCE7',
  amber:           '#D97706',
  amberDim:        '#FEF3C7',
  red:             '#DC2626',
  redDim:          '#FEE2E2',

  border:          'rgba(0,0,0,0.07)',
  borderStrong:    'rgba(0,0,0,0.13)',
  overlay:         'rgba(255,255,255,0.7)',

  glowTop:         '#FFFFFF',
  glowMid:         '#F0EFEA',
  scrim:           'rgba(246,245,240,0.72)',
} as const

export type ThemeColors = typeof DARK
