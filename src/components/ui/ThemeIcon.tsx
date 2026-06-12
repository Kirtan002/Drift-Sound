import { Pressable, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { useCallback } from 'react'
import React from 'react'
import { usePreferencesStore } from '../../store/preferencesStore'
import * as Haptics from 'expo-haptics'

function ThemeIconInner() {
  const { colors, isDark } = useTheme()
  const setThemeMode = usePreferencesStore(s => s.setThemeMode)

  const toggleTheme = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setThemeMode(isDark ? 'light' : 'dark')
  }, [isDark, setThemeMode])

  return (
    <Pressable onPress={toggleTheme} style={styles.button} hitSlop={8}>
      <Text style={[styles.icon, { color: colors.textSecondary }]}>
        {isDark ? '☀️' : '🌙'}
      </Text>
    </Pressable>
  )
}

export const ThemeIcon = React.memo(ThemeIconInner)

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
  },
})
