import { Pressable, Text, type PressableProps, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { useCallback, useMemo } from 'react'
import React from 'react'
import * as Haptics from 'expo-haptics'

interface IconButtonProps extends PressableProps {
  icon: string
  size?: number
  color?: string
  haptic?: boolean
}

function IconButtonInner({ icon, size = 24, color, haptic = true, onPress, style, ...props }: IconButtonProps) {
  const { colors } = useTheme()

  const iconColor = useMemo(() => color ?? colors.textSecondary, [color, colors.textSecondary])
  const iconSize = useMemo(() => size, [size])

  const handlePress = useCallback((e: any) => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onPress?.(e)
  }, [haptic, onPress])

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }, style as any]}
      hitSlop={8}
      {...props}
    >
      <Text style={[styles.icon, { fontSize: iconSize, color: iconColor }]}>{icon}</Text>
    </Pressable>
  )
}

export const IconButton = React.memo(IconButtonInner)

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
})
