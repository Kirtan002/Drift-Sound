import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { useTheme } from '../../constants/ThemeContext'

const RING_SIZE = 220
const STROKE_WIDTH = 3
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const INHALE_MS = 4000
const HOLD_MS = 1000
const EXHALE_MS = 6000
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS

interface BreathingGuideProps {
  enabled: boolean
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

function BreathingGuideInner({ enabled }: BreathingGuideProps) {
  const { colors } = useTheme()
  const progress = useSharedValue(0)
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    cancelAnimation(progress)
    if (!enabled) {
      progress.value = withTiming(0, { duration: 300 })
      return
    }

    // One continuous, repeating inhale → hold → exhale cycle.
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: INHALE_MS, easing: Easing.inOut(Easing.sin) }),
        withDelay(HOLD_MS, withTiming(1, { duration: 0 })),
        withTiming(0, { duration: EXHALE_MS, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    )

    // Drive the phase label on the JS thread, looping in lockstep.
    let cancelled = false
    const tick = () => {
      if (cancelled) return
      runOnJS(setPhase)('in')
      const t1 = setTimeout(() => !cancelled && setPhase('hold'), INHALE_MS)
      const t2 = setTimeout(() => !cancelled && setPhase('out'), INHALE_MS + HOLD_MS)
      return [t1, t2]
    }
    setPhase('in')
    const timers: any[] = []
    const loop = setInterval(() => {
      const ts = tick()
      if (ts) timers.push(...ts)
    }, CYCLE_MS)
    const initial = tick()
    if (initial) timers.push(...initial)

    return () => {
      cancelled = true
      clearInterval(loop)
      timers.forEach(clearTimeout)
    }
  }, [enabled])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }))

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.92 + progress.value * 0.12 }],
  }))

  if (!enabled) return null

  const phaseLabel = phase === 'in' ? 'Breathe in' : phase === 'hold' ? 'Hold' : 'Breathe out'

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={scaleStyle}>
        <Svg width={RING_SIZE} height={RING_SIZE} style={styles.ring}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={colors.textMuted}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            opacity={0.25}
          />
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={colors.accent}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
      <Text style={[styles.phase, { color: colors.textSecondary }]}>{phaseLabel}</Text>
    </View>
  )
}

export const BreathingGuide = React.memo(BreathingGuideInner)

const styles = StyleSheet.create({
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    transform: [{ rotate: '-90deg' }],
  },
  phase: {
    position: 'absolute',
    bottom: -28,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
  },
})
