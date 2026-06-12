import { useState, useCallback, useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito'
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { ThemeProvider, useTheme } from '../src/constants/ThemeContext'
import {
  useAudioNotification,
  usePlayerNotification,
  setupNotificationResponseHandler,
} from '../src/hooks/useAudioNotification'
import { registerBackgroundAudio } from '../src/audio/BackgroundTask'
import { cloudSoundManager } from '../src/audio/CloudSoundManager'
import { AnimatedSplash } from '../src/components/player/AnimatedSplash'

SplashScreen.preventAutoHideAsync()

function RootLayoutInner() {
  const { isDark } = useTheme()

  useAudioNotification()
  usePlayerNotification()

  useEffect(() => {
    const sub = setupNotificationResponseHandler()
    return () => sub.remove()
  }, [])

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
        <Stack.Screen name="mix/[code]" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  })
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashFinish = useCallback(async () => {
    setShowSplash(false)
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    if (fontsLoaded) {
      cloudSoundManager.init()
      registerBackgroundAudio()
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootLayoutInner />
          {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
