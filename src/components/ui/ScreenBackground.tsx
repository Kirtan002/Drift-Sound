import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg'
import { useTheme } from '../../constants/ThemeContext'

interface ScreenBackgroundProps {
  children: React.ReactNode
  // Slight accent tint variation per screen for subtle variety.
  variant?: 'default' | 'warm' | 'cool'
}

// Ambient gradient backdrop: a soft accent glow at the top fading into the base
// color. Gives every screen depth without per-screen artwork. Purely decorative
// and pointer-transparent.
function ScreenBackgroundInner({ children, variant = 'default' }: ScreenBackgroundProps) {
  const { colors } = useTheme()
  const { width, height } = useWindowDimensions()

  const glow =
    variant === 'warm' ? colors.amber
    : variant === 'cool' ? colors.accent
    : colors.glowTop

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <Svg style={StyleSheet.absoluteFill} width={width} height={height} pointerEvents="none">
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="0%" r="85%">
            <Stop offset="0" stopColor={glow} stopOpacity={variant === 'default' ? 1 : 0.22} />
            <Stop offset="0.55" stopColor={colors.glowMid} stopOpacity={variant === 'default' ? 1 : 0} />
            <Stop offset="1" stopColor={colors.bg} stopOpacity={variant === 'default' ? 1 : 0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#glow)" />
      </Svg>
      {children}
    </View>
  )
}

export const ScreenBackground = React.memo(ScreenBackgroundInner)

const styles = StyleSheet.create({
  root: { flex: 1 },
})
