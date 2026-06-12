import React, { useCallback, useMemo, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Svg, { Circle } from 'react-native-svg'
import { useTheme } from '../../constants/ThemeContext'
import * as Haptics from 'expo-haptics'

const DIAL_SIZE = 240
const STROKE_WIDTH = 6
const RADIUS = (DIAL_SIZE - STROKE_WIDTH * 2) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const CENTER = DIAL_SIZE / 2

const TIMER_PRESETS = [0, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120] as const
const MAX_MINUTES = 120

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface TimerDialProps {
  value: number
  onChange: (minutes: number) => void
}

function snapToPreset(minutes: number): number {
  let closest: number = TIMER_PRESETS[0]
  let minDiff = Infinity
  for (const p of TIMER_PRESETS) {
    const diff = Math.abs(p - minutes)
    if (diff < minDiff) {
      minDiff = diff
      closest = p
    }
  }
  return closest
}

function TimerDialInner({ value, onChange }: TimerDialProps) {
  const { colors } = useTheme()
  const offset = useSharedValue(CIRCUMFERENCE)
  const lastSnap = useSharedValue<number>(value)
  const [displayTime, setDisplayTime] = useState(value)

  const fraction = useMemo(() => Math.min(1, Math.max(0, value / MAX_MINUTES)), [value])
  const currentOffset = useMemo(() => CIRCUMFERENCE * (1 - fraction), [fraction])

  const updateFromAngle = useCallback((angle: number) => {
    const t = angle / (2 * Math.PI)
    const rawMinutes = t * MAX_MINUTES
    const snapped = snapToPreset(rawMinutes)
    const newOffset = CIRCUMFERENCE * (1 - t)

    if (snapped !== lastSnap.value) {
      lastSnap.value = snapped
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light)
    }

    offset.value = newOffset
    runOnJS(setDisplayTime)(rawMinutes)
  }, [offset, lastSnap])

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      const dx = e.x - CENTER
      const dy = e.y - CENTER
      let angle = Math.atan2(dy, dx)
      angle = (angle + 2 * Math.PI) % (2 * Math.PI)
      angle = (angle + 3 * Math.PI / 2) % (2 * Math.PI)
      updateFromAngle(angle)
    })
    .onUpdate((e) => {
      const dx = e.x - CENTER
      const dy = e.y - CENTER
      let angle = Math.atan2(dy, dx)
      angle = (angle + 2 * Math.PI) % (2 * Math.PI)
      angle = (angle + 3 * Math.PI / 2) % (2 * Math.PI)
      updateFromAngle(angle)
    })
    .onEnd(() => {
      const snapped = snapToPreset(displayTime)
      const t = snapped / MAX_MINUTES
      const newOffset = CIRCUMFERENCE * (1 - t)
      offset.value = withSpring(newOffset, { damping: 15 })
      runOnJS(onChange)(snapped)
    })

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: offset.value,
  }), [offset])

  const displayLabel = useMemo(() => {
    if (value === 0) return '∞'
    if (value >= 60) {
      const h = Math.floor(value / 60)
      const m = value % 60
      return m > 0 ? `${h}h ${m}m` : `${h}h`
    }
    return `${value} min`
  }, [value])

  const tapGesture = Gesture.Tap().onEnd((e) => {
    const dx = e.x - CENTER
    const dy = e.y - CENTER
    let angle = Math.atan2(dy, dx)
    angle = (angle + 2 * Math.PI) % (2 * Math.PI)
    angle = (angle + 3 * Math.PI / 2) % (2 * Math.PI)
    const t = angle / (2 * Math.PI)
    const rawMinutes = t * MAX_MINUTES
    const snapped = snapToPreset(rawMinutes)
    const newOffset = CIRCUMFERENCE * (1 - snapped / MAX_MINUTES)
    offset.value = withSpring(newOffset, { damping: 15 })
    onChange(snapped)
  })

  const composed = Gesture.Race(panGesture, tapGesture)

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <View style={styles.dialWrap}>
          <Svg width={DIAL_SIZE} height={DIAL_SIZE}>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke={colors.border}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              opacity={0.5}
            />
            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke={colors.accent}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedProps}
              strokeLinecap="round"
              transform={`rotate(-90, ${CENTER}, ${CENTER})`}
            />
          </Svg>
          <View style={[styles.centerLabel]}>
            <Text style={[styles.timeText, { color: colors.textPrimary }]}>
              {displayLabel}
            </Text>
            <Text style={[styles.subText, { color: colors.textMuted }]}>
              {value > 0 ? 'then fade out' : 'no timer'}
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
    gap: 4,
  },
  timeText: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    fontVariant: ['tabular-nums'],
  },
  subText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
})
