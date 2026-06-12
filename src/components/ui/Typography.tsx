import React from 'react'
import { Text, type TextProps, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { type } from '../../constants/typography'
import { useMemo } from 'react'

const TYPOGRAPHY_VARIANTS = {
  T1: type.hero,
  T2: type.display,
  T3: type.headingL,
  T4: type.headingM,
  T5: type.bodyL,
  T6: type.bodyM,
  T7: type.caption,
} as const

type TypographyVariant = keyof typeof TYPOGRAPHY_VARIANTS

interface TypographyProps extends TextProps {
  variant: TypographyVariant
  color?: string
}

function TypographyInner({ variant, color, style, ...props }: TypographyProps) {
  const { colors } = useTheme()

  const variantStyle = useMemo(() => {
    const s = TYPOGRAPHY_VARIANTS[variant]
    return {
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing,
    }
  }, [variant])

  const dynamicStyle = useMemo(() => ({
    color: color ?? colors.textPrimary,
  }), [color, colors.textPrimary])

  return <Text style={[variantStyle, dynamicStyle, style]} {...props} />
}

export const Typography = React.memo(TypographyInner)
