import React, { useCallback, useState, useEffect } from 'react'
import { View, Text, LayoutChangeEvent, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useTheme } from '../../constants/ThemeContext'
import { S } from '../../constants/spacing'

interface VolumeSliderProps {
  value: number
  onValueChange: (value: number) => void
  label?: string
}

function VolumeSliderInner({ value, onValueChange, label }: VolumeSliderProps) {
  const { colors } = useTheme()
  const [trackWidth, setTrackWidth] = useState(0)
  const thumbPos = useSharedValue(0)
  const startX = useSharedValue(0)

  useEffect(() => {
    if (trackWidth > 0) {
      thumbPos.value = withSpring(value * trackWidth, { damping: 20 })
    }
  }, [value, trackWidth])

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width)
  }, [])

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = thumbPos.value
    })
    .onUpdate((e) => {
      thumbPos.value = Math.max(0, Math.min(trackWidth, startX.value + e.translationX))
    })
    .onEnd(() => {
      const newVal = Math.round((thumbPos.value / trackWidth) * 100) / 100
      runOnJS(onValueChange)(Math.max(0, Math.min(1, newVal)))
    })

  const fillStyle = useAnimatedStyle(() => ({
    width: thumbPos.value,
  }))

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbPos.value - 10 }],
  }))

  const pct = Math.round(value * 100)

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <View style={styles.sliderRow}>
        <View style={styles.iconWrap}>
          <Text style={[styles.icon, { color: colors.textMuted }]}>
            {value < 0.3 ? '🔇' : value < 0.7 ? '🔉' : '🔊'}
          </Text>
        </View>
        <View style={styles.trackContainer} onLayout={handleLayout}>
          <View style={[styles.track, { backgroundColor: colors.border }]} />
          <Animated.View
            style={[
              styles.fill,
              { backgroundColor: colors.accent },
              fillStyle,
            ]}
          />
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.thumb,
                { backgroundColor: '#FFFFFF', shadowColor: '#000' },
                thumbStyle,
              ]}
            />
          </GestureDetector>
        </View>
        <Text style={[styles.pct, { color: colors.textSecondary }]}>{pct}%</Text>
      </View>
    </View>
  )
}

export const VolumeSlider = React.memo(VolumeSliderInner)

const styles = StyleSheet.create({
  container: {
    gap: S.sm,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
  },
  icon: {
    fontSize: 14,
  },
  trackContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    left: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    top: 10,
  },
  pct: {
    width: 36,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
})
