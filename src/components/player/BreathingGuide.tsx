import React, { useEffect, useMemo, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { useTheme } from '../../constants/ThemeContext'

const RING_SIZE = 200
const STROKE_WIDTH = 3
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const INHALE_MS = 4000
const HOLD_MS = 1000
const EXHALE_MS = 6000

type BreathPhase = 'inhale' | 'hold' | 'exhale'

interface BreathingGuideProps {
  enabled: boolean
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

function BreathingGuideInner({ enabled }: BreathingGuideProps) {
  const { colors } = useTheme()
  const progress = useSharedValue(0)
  const phaseText = useSharedValue<string>('')

  const updatePhase = useCallback((phase: string) => {
    phaseText.value = phase
  }, [])

  useEffect(() => {
    if (!enabled) {
      progress.value = withTiming(0, { duration: 300 })
      return
    }

    const runCycle = () => {
      progress.value = withSequence(
        withTiming(1, {
          duration: INHALE_MS,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(1, {
          duration: HOLD_MS,
        }),
        withTiming(0, {
          duration: EXHALE_MS,
          easing: Easing.inOut(Easing.sin),
        }),
      )
    }

    runCycle()
  }, [enabled])

  const animatedProps = useAnimatedProps(() => {
    const offset = CIRCUMFERENCE * (1 - progress.value)
    return {
      strokeDashoffset: offset,
    }
  }, [progress])

  const phaseLabel = useMemo(() => {
    if (!enabled) return ''
    return ''
  }, [enabled])

  if (!enabled) return null

  return (
    <View style={styles.container}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={styles.ring}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke={colors.textMuted}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          opacity={0.3}
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
          opacity={0.8}
        />
      </Svg>
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
})
