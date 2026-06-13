import { StyleSheet, View } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { useCallback, useMemo } from 'react'
import React from 'react'
import * as Haptics from 'expo-haptics'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated'
import { Pressable } from 'react-native'
import { Icon, type IconName } from './Icon'

interface IconButtonProps {
  icon: IconName
  size?: number
  color?: string
  haptic?: boolean
  onPress?: () => void
  // Optional filled circular background.
  variant?: 'plain' | 'soft'
  accessibilityLabel?: string
}

// Tactile icon button backed by the SVG icon set. Scales on press for feedback.
function IconButtonInner({
  icon,
  size = 22,
  color,
  haptic = true,
  onPress,
  variant = 'plain',
  accessibilityLabel,
}: IconButtonProps) {
  const { colors } = useTheme()
  const scale = useSharedValue(1)

  const iconColor = useMemo(() => color ?? colors.textSecondary, [color, colors.textSecondary])

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.88, { duration: 80 })
  }, [scale])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 240 })
  }, [scale])

  const handlePress = useCallback(() => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress?.()
  }, [haptic, onPress])

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
    >
      <Animated.View
        style={[
          styles.button,
          variant === 'soft' && { backgroundColor: colors.bgCard },
          animStyle,
        ]}
      >
        <Icon name={icon} size={size} color={iconColor} />
      </Animated.View>
    </Pressable>
  )
}

export const IconButton = React.memo(IconButtonInner)

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
