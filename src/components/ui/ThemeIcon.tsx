import { StyleSheet, Pressable } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { useCallback } from 'react'
import React from 'react'
import { usePreferencesStore } from '../../store/preferencesStore'
import * as Haptics from 'expo-haptics'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { Icon } from './Icon'

// Theme toggle with a playful rotate+pop transition between sun and moon.
function ThemeIconInner() {
  const { colors, isDark } = useTheme()
  const setThemeMode = usePreferencesStore(s => s.setThemeMode)
  const rotation = useSharedValue(0)
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }))

  const toggleTheme = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    rotation.value = withSpring(rotation.value + 180, { damping: 12, stiffness: 120 })
    scale.value = withSequence(
      withTiming(0.7, { duration: 110 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    )
    setThemeMode(isDark ? 'light' : 'dark')
  }, [isDark, setThemeMode, rotation, scale])

  return (
    <Pressable onPress={toggleTheme} hitSlop={10} accessibilityRole="button" accessibilityLabel="Toggle theme">
      <Animated.View style={[styles.button, animStyle]}>
        <Icon name={isDark ? 'sun' : 'moon'} size={22} color={colors.textSecondary} />
      </Animated.View>
    </Pressable>
  )
}

export const ThemeIcon = React.memo(ThemeIconInner)

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
