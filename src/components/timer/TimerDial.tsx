import React, { useCallback, useMemo, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'
import { useTheme } from '../../constants/ThemeContext'
import * as Haptics from 'expo-haptics'

const DIAL_SIZE = 250
const STROKE_WIDTH = 14
const RADIUS = (DIAL_SIZE - STROKE_WIDTH * 2) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const CENTER = DIAL_SIZE / 2

const TIMER_PRESETS = [0, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120]
const MAX_MINUTES = 120

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface TimerDialProps {
  value: number
  onChange: (minutes: number) => void
}

// Snap helper runs both on the JS thread (commit) and is mirrored as a worklet
// for live haptic feedback while dragging.
function snapToPreset(minutes: number): number {
  'worklet'
  let closest = TIMER_PRESETS[0]
  let minDiff = Infinity
  for (let i = 0; i < TIMER_PRESETS.length; i++) {
    const diff = Math.abs(TIMER_PRESETS[i] - minutes)
    if (diff < minDiff) {
      minDiff = diff
      closest = TIMER_PRESETS[i]
    }
  }
  return closest
}

function TimerDialInner({ value, onChange }: TimerDialProps) {
  const { colors } = useTheme()
  const fraction = useSharedValue(Math.min(1, Math.max(0, value / MAX_MINUTES)))
  const lastSnap = useSharedValue(value)
  const [liveMinutes, setLiveMinutes] = useState<number | null>(null)

  // Keep the arc in sync when the value changes externally (presets), but not
  // while the user is mid-drag (liveMinutes != null).
  useMemo(() => {
    if (liveMinutes === null) {
      fraction.value = withSpring(Math.min(1, Math.max(0, value / MAX_MINUTES)), { damping: 18 })
    }
  }, [value])

  const onSnapChange = useCallback((m: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setLiveMinutes(m)
  }, [])

  const commit = useCallback((m: number) => {
    setLiveMinutes(null)
    onChange(m)
  }, [onChange])

  const setDragging = useCallback((m: number) => {
    setLiveMinutes(m)
  }, [])

  const angleToFraction = (x: number, y: number) => {
    'worklet'
    const dx = x - CENTER
    const dy = y - CENTER
    let angle = Math.atan2(dy, dx)
    angle = (angle + 2 * Math.PI) % (2 * Math.PI)
    angle = (angle + (3 * Math.PI) / 2) % (2 * Math.PI)
    return angle / (2 * Math.PI)
  }

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      const t = angleToFraction(e.x, e.y)
      fraction.value = t
      const snapped = snapToPreset(t * MAX_MINUTES)
      lastSnap.value = snapped
      runOnJS(setDragging)(snapped)
    })
    .onUpdate((e) => {
      const t = angleToFraction(e.x, e.y)
      fraction.value = t
      const snapped = snapToPreset(t * MAX_MINUTES)
      if (snapped !== lastSnap.value) {
        lastSnap.value = snapped
        runOnJS(onSnapChange)(snapped)
      }
    })
    .onEnd(() => {
      const snapped = snapToPreset(fraction.value * MAX_MINUTES)
      fraction.value = withSpring(snapped / MAX_MINUTES, { damping: 18 })
      runOnJS(commit)(snapped)
    })

  const tapGesture = Gesture.Tap().onEnd((e) => {
    const t = angleToFraction(e.x, e.y)
    const snapped = snapToPreset(t * MAX_MINUTES)
    fraction.value = withSpring(snapped / MAX_MINUTES, { damping: 18 })
    runOnJS(commit)(snapped)
  })

  const composed = Gesture.Race(panGesture, tapGesture)

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - fraction.value),
  }))

  const shown = liveMinutes ?? value
  const displayLabel = useMemo(() => {
    if (shown <= 0) return '∞'
    if (shown >= 60) {
      const h = Math.floor(shown / 60)
      const m = shown % 60
      return m > 0 ? `${h}h ${m}m` : `${h}h`
    }
    return `${shown}`
  }, [shown])

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <View style={styles.dialWrap}>
          <Svg width={DIAL_SIZE} height={DIAL_SIZE}>
            <Defs>
              <LinearGradient id="dial" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={colors.accent} />
                <Stop offset="1" stopColor={colors.green} />
              </LinearGradient>
            </Defs>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke={colors.border}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke="url(#dial)"
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedProps}
              strokeLinecap="round"
              transform={`rotate(-90, ${CENTER}, ${CENTER})`}
            />
          </Svg>
          <View style={styles.centerLabel}>
            <Text style={[styles.timeText, { color: colors.textPrimary }]}>{displayLabel}</Text>
            <Text style={[styles.subText, { color: colors.textMuted }]}>
              {shown > 0 ? 'minutes' : 'no timer'}
            </Text>
          </View>
        </View>
      </GestureDetector>
    </View>
  )
}

export const TimerDial = React.memo(TimerDialInner)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dialWrap: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    gap: 2,
  },
  timeText: {
    fontSize: 52,
    fontFamily: 'Nunito_700Bold',
    fontVariant: ['tabular-nums'],
  },
  subText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
})
