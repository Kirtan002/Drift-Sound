import React, { useEffect } from 'react'
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated'

interface EqualizerProps {
  isPlaying: boolean
  color: string
  size?: 'sm' | 'md'
  barCount?: number
  style?: StyleProp<ViewStyle>
}

const SPEEDS = [620, 480, 700, 540, 600, 460, 660]
const PEAKS = [0.55, 1, 0.7, 0.9, 0.5, 0.85, 0.65]

function Bar({ index, isPlaying, color, maxH, barW }: {
  index: number; isPlaying: boolean; color: string; maxH: number; barW: number
}) {
  const minH = Math.max(3, maxH * 0.18)
  const h = useSharedValue(minH)

  useEffect(() => {
    cancelAnimation(h)
    if (isPlaying) {
      const peak = minH + (maxH - minH) * PEAKS[index % PEAKS.length]
      const speed = SPEEDS[index % SPEEDS.length]
      h.value = withRepeat(
        withSequence(
          withTiming(peak, { duration: speed }),
          withTiming(minH, { duration: speed })
        ),
        -1,
        true
      )
    } else {
      h.value = withTiming(minH, { duration: 300 })
    }
  }, [isPlaying])

  const animStyle = useAnimatedStyle(() => ({ height: h.value }))

  return <Animated.View style={[{ width: barW, borderRadius: barW / 2, backgroundColor: color }, animStyle]} />
}

// Animated mini equalizer used in mini-player / track rows. Bars animate via
// reanimated worklets, so the JS thread stays idle.
function EqualizerInner({ isPlaying, color, size = 'sm', barCount = 5, style }: EqualizerProps) {
  const maxH = size === 'sm' ? 18 : 26
  const barW = size === 'sm' ? 3 : 4

  return (
    <View style={[styles.row, { height: maxH, gap: barW }, style]}>
      {Array.from({ length: barCount }, (_, i) => (
        <Bar key={i} index={i} isPlaying={isPlaying} color={color} maxH={maxH} barW={barW} />
      ))}
    </View>
  )
}

export const Equalizer = React.memo(EqualizerInner)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
