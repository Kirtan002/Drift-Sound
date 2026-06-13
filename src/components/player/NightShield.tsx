import React, { useEffect, useState, useCallback } from 'react'
import { Text, StyleSheet, Pressable } from 'react-native'
import { useKeepAwake } from 'expo-keep-awake'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated'

interface NightShieldProps {
  onDismiss?: () => void
}

// Ultra-dim full-screen clock for bedside use. Fades in, keeps the screen awake,
// and gently drifts the clock so OLED pixels don't burn in. Tap to dismiss.
function NightShieldInner({ onDismiss }: NightShieldProps) {
  useKeepAwake()
  const [time, setTime] = useState('')
  const opacity = useSharedValue(0)
  const drift = useSharedValue(0)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours().toString().padStart(2, '0')
      const m = now.getMinutes().toString().padStart(2, '0')
      setTime(`${h}:${m}`)
    }
    update()
    const id = setInterval(update, 15000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) })
    // Slow vertical drift to prevent OLED burn-in.
    drift.value = withRepeat(
      withSequence(
        withTiming(14, { duration: 30000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-14, { duration: 30000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    )
  }, [])

  const handleDismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished && onDismiss) runOnJS(onDismiss)()
    })
  }, [onDismiss])

  const rootStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  const clockStyle = useAnimatedStyle(() => ({ transform: [{ translateY: drift.value }] }))

  return (
    <Animated.View style={[styles.overlay, rootStyle]}>
      <Pressable style={styles.fill} onPress={handleDismiss}>
        <Animated.Text style={[styles.clock, clockStyle]}>{time}</Animated.Text>
        <Text style={styles.hint}>Tap to dismiss</Text>
      </Pressable>
    </Animated.View>
  )
}

export const NightShield = React.memo(NightShieldInner)

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    zIndex: 9999,
  },
  fill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clock: {
    color: '#2A2A33',
    fontSize: 88,
    fontFamily: 'Nunito_700Bold',
    fontVariant: ['tabular-nums'],
  },
  hint: {
    color: '#15151A',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    position: 'absolute',
    bottom: 64,
  },
})
