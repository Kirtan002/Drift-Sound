import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated'
import { useTheme } from '../../constants/ThemeContext'

const BAR_COUNT = 11
const BAR_SPEEDS = [1200, 900, 1500, 800, 1100, 700, 1300, 950, 1600, 850, 1000]
const BAR_WIDTHS = [4, 6, 4, 8, 4, 6, 4, 8, 4, 6, 4]
const MAX_HEIGHT = 80
const MIN_HEIGHT = 8
const PAUSED_HEIGHT = 4

interface WaveformBarProps {
  speed: number
  width: number
  isPlaying: boolean
  color: string
}

function WaveformBar({ speed, width, isPlaying, color }: WaveformBarProps) {
  const height = useSharedValue(MIN_HEIGHT)

  useEffect(() => {
    if (isPlaying) {
      const target = MIN_HEIGHT + Math.random() * (MAX_HEIGHT - MIN_HEIGHT)
      height.value = withRepeat(
        withSequence(
          withTiming(target, { duration: speed / 2 }),
          withTiming(MIN_HEIGHT, { duration: speed / 2 }),
        ),
        -1,
        false
      )
    } else {
      height.value = withTiming(PAUSED_HEIGHT, { duration: 400 })
    }
  }, [isPlaying])

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
  }))

  return (
    <Animated.View
      style={[
        styles.bar,
        { width, backgroundColor: color, opacity: 0.7 },
        animStyle,
      ]}
    />
  )
}

const MemoizedWaveformBar = React.memo(WaveformBar)

interface WaveformAnimProps {
  isPlaying: boolean
}

function WaveformAnimInner({ isPlaying }: WaveformAnimProps) {
  const { colors } = useTheme()

  const bars = useMemo(() =>
    Array.from({ length: BAR_COUNT }, (_, i) => (
      <MemoizedWaveformBar
        key={i}
        speed={BAR_SPEEDS[i]}
        width={BAR_WIDTHS[i]}
        isPlaying={isPlaying}
        color={colors.accent}
      />
    )),
    [isPlaying, colors.accent]
  )

  return (
    <View style={styles.container}>
      {bars}
    </View>
  )
}

export const WaveformAnim = React.memo(WaveformAnimInner)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: MAX_HEIGHT,
  },
  bar: {
    borderRadius: 2,
  },
})
