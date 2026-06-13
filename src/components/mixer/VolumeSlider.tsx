import React, { useCallback, useState } from 'react'
import { View, Text, LayoutChangeEvent, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useTheme } from '../../constants/ThemeContext'
import { S } from '../../constants/spacing'
import { Icon, type IconName } from '../ui/Icon'

interface VolumeSliderProps {
  value: number
  onValueChange: (value: number) => void
  label?: string
}

const THUMB = 22

function VolumeSliderInner({ value, onValueChange, label }: VolumeSliderProps) {
  const { colors } = useTheme()
  const [trackWidth, setTrackWidth] = useState(0)
  const [pct, setPct] = useState(Math.round(value * 100))
  const thumbPos = useSharedValue(0)
  const startX = useSharedValue(0)
  const dragging = useSharedValue(0)

  // Keep the thumb synced to the prop unless the user is actively dragging.
  useDerivedValue(() => {
    if (dragging.value === 0 && trackWidth > 0) {
      thumbPos.value = withSpring(value * trackWidth, { damping: 22, stiffness: 240 })
    }
  }, [value, trackWidth])

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width)
  }, [])

  const emit = useCallback((p: number) => {
    setPct(Math.round(p * 100))
    onValueChange(p)
  }, [onValueChange])

  const updatePct = useCallback((p: number) => {
    setPct(Math.round(p * 100))
  }, [])

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      dragging.value = 1
      startX.value = thumbPos.value
    })
    .onUpdate((e) => {
      const next = Math.max(0, Math.min(trackWidth, startX.value + e.translationX))
      thumbPos.value = next
      if (trackWidth > 0) runOnJS(updatePct)(next / trackWidth)
    })
    .onEnd(() => {
      const val = trackWidth > 0 ? thumbPos.value / trackWidth : 0
      dragging.value = 0
      runOnJS(emit)(Math.max(0, Math.min(1, val)))
    })

  const tapGesture = Gesture.Tap().onEnd((e) => {
    const next = Math.max(0, Math.min(trackWidth, e.x))
    thumbPos.value = withSpring(next, { damping: 20 })
    const val = trackWidth > 0 ? next / trackWidth : 0
    runOnJS(emit)(Math.max(0, Math.min(1, val)))
  })

  const composed = Gesture.Race(panGesture, tapGesture)

  const fillStyle = useAnimatedStyle(() => ({ width: thumbPos.value }))
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbPos.value - THUMB / 2 }],
  }))

  const iconName: IconName = pct < 1 ? 'volumeMute' : pct < 50 ? 'volumeLow' : 'volume'

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
          <Text style={[styles.pct, { color: colors.accent }]}>{pct}%</Text>
        </View>
      )}
      <View style={styles.sliderRow}>
        <Icon name={iconName} size={18} color={colors.textMuted} />
        <View style={styles.trackContainer} onLayout={handleLayout}>
          <GestureDetector gesture={composed}>
            <View style={styles.hitArea}>
              <View style={[styles.track, { backgroundColor: colors.border }]} />
              <Animated.View style={[styles.fill, { backgroundColor: colors.accent }, fillStyle]} />
              <Animated.View
                style={[
                  styles.thumb,
                  { backgroundColor: '#FFFFFF', borderColor: colors.accent, shadowColor: colors.accent },
                  thumbStyle,
                ]}
              />
            </View>
          </GestureDetector>
        </View>
        {!label && <Text style={[styles.pctInline, { color: colors.textSecondary }]}>{pct}%</Text>}
      </View>
    </View>
  )
}

export const VolumeSlider = React.memo(VolumeSliderInner)

const styles = StyleSheet.create({
  container: {
    gap: S.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
  },
  trackContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  hitArea: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 5,
    borderRadius: 3,
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 5,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    left: 0,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  pct: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  pctInline: {
    width: 38,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'right',
  },
})
