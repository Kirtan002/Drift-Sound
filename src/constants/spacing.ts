import { Dimensions } from 'react-native'

export const S = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 48,
} as const

const W = Dimensions.get('window').width

export const hPad = W < 412 ? 16 : W < 600 ? 20 : W < 840 ? 32 : 48
export const cols = W < 600 ? 2 : W < 840 ? 3 : 4
export const cardW = (W - hPad * 2 - (cols - 1) * 12) / cols
