import { Tabs } from 'expo-router'
import { useTheme } from '../../src/constants/ThemeContext'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMemo } from 'react'
import { Icon, type IconName } from '../../src/components/ui/Icon'

function TabIcon({ focused, name, color }: { focused: boolean; name: IconName; color: string }) {
  return (
    <View style={styles.iconContainer}>
      <Icon name={name} size={24} color={color} strokeWidth={focused ? 2.4 : 2} />
      {focused && <View style={[styles.dot, { backgroundColor: color }]} />}
    </View>
  )
}

export default function TabLayout() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  const tabBarStyle = useMemo(() => ({
    backgroundColor: colors.bgSurface,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 64 + insets.bottom,
    paddingBottom: insets.bottom + 6,
    paddingTop: 8,
  }), [colors, insets.bottom])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle,
        tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sounds"
        options={{
          title: 'Sounds',
          tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} name="sounds" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mixer"
        options={{
          title: 'Mixer',
          tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} name="sliders" color={color} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} name="timer" color={color} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: -4,
  },
})
