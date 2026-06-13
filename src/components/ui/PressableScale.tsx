import React, { useCallback } from 'react'
import { Pressable, type PressableProps, type ViewStyle, type StyleProp } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  scaleTo?: number
  haptic?: boolean
  hapticStyle?: Haptics.ImpactFeedbackStyle
}

// Reusable tactile button: scales + dims on press-in and springs back on
// release, with optional haptic. Used everywhere for a consistent "rich" feel.
function PressableScaleInner({
  children,
  style,
  scaleTo = 0.95,
  haptic = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  const handlePressIn = useCallback((e: any) => {
    scale.value = withTiming(scaleTo, { duration: 90 })
    opacity.value = withTiming(0.85, { duration: 90 })
    onPressIn?.(e)
  }, [scaleTo, onPressIn, scale, opacity])

  const handlePressOut = useCallback((e: any) => {
    scale.value = withSpring(1, { damping: 14, stiffness: 220 })
    opacity.value = withTiming(1, { duration: 140 })
    onPressOut?.(e)
  }, [onPressOut, scale, opacity])

  const handlePress = useCallback((e: any) => {
    if (haptic) Haptics.impactAsync(hapticStyle)
    onPress?.(e)
  }, [haptic, hapticStyle, onPress])

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...rest}
    >
      <Animated.View style={[style, animStyle]}>{children}</Animated.View>
    </Pressable>
  )
}

export const PressableScale = React.memo(PressableScaleInner)
