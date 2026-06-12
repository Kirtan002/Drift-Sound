import { View, type ViewProps, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { useMemo } from 'react'
import React from 'react'

type CardVariant = 'elevated' | 'flat' | 'outline'

interface CardProps extends ViewProps {
  variant?: CardVariant
}

function CardInner({ variant = 'flat', style, children, ...props }: CardProps) {
  const { colors } = useTheme()

  const cardStyle = useMemo(() => {
    const base = {
      backgroundColor: colors.bgCard,
      borderRadius: 16,
      padding: 16,
    }

    switch (variant) {
      case 'elevated':
        return { ...base, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 }
      case 'outline':
        return { ...base, borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent' }
      case 'flat':
      default:
        return base
    }
  }, [variant, colors])

  return <View style={[cardStyle, style]} {...props}>{children}</View>
}

export const Card = React.memo(CardInner)
