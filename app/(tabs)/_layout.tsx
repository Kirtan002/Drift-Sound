import { Tabs } from 'expo-router'
import { useTheme } from '../../src/constants/ThemeContext'
import { View, StyleSheet } from 'react-native'
import { S } from '../../src/constants/spacing'
import { useMemo } from 'react'

function TabIcon({ focused, icon }: { focused: boolean; icon: string }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconActive]}>
      <View style={styles.iconDot} />
    </View>
  )
}

export default function TabLayout() {
  const { colors, isDark } = useTheme()

  const tabBarStyle = useMemo(() => ({
    backgroundColor: colors.bgSurface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 88,
    paddingBottom: S.xxl,
    paddingTop: S.sm,
  }), [colors])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle,
        tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter_500Medium' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="home" />,
        }}
      />
      <Tabs.Screen
        name="sounds"
        options={{
          title: 'Sounds',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="sounds" />,
        }}
      />
      <Tabs.Screen
        name="mixer"
        options={{
          title: 'Mixer',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="mixer" />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="timer" />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconActive: {
    backgroundColor: 'rgba(108, 142, 255, 0.15)',
  },
  iconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'currentColor',
  },
})
