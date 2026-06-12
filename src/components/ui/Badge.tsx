import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { useMemo } from 'react'
import React from 'react'
import { S } from '../../constants/spacing'

type BadgeColor = 'accent' | 'green' | 'amber' | 'red'

interface BadgeProps {
  label: string
  color?: BadgeColor
}

function BadgeInner({ label, color = 'accent' }: BadgeProps) {
  const { colors } = useTheme()

  const badgeStyle = useMemo(() => {
    const map = {
      accent: { bg: colors.accentDim, text: colors.accent },
      green: { bg: colors.greenDim, text: colors.green },
      amber: { bg: colors.amberDim, text: colors.amber },
      red: { bg: colors.redDim, text: colors.red },
    }
    return map[color]
  }, [color, colors])

  return (
    <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
      <Text style={[styles.label, { color: badgeStyle.text }]}>{label}</Text>
    </View>
  )
}

export const Badge = React.memo(BadgeInner)

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: S.sm,
    paddingVertical: S.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.3,
  },
})
