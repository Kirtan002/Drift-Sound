import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { S } from '../../constants/spacing'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const SHEET_MAX = SCREEN_HEIGHT * 0.9

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

function BottomSheetInner({ visible, onClose, title, children }: BottomSheetProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const translateY = useSharedValue(SHEET_MAX)
  const backdropOpacity = useSharedValue(0)
  // Mount state is React-driven (never read a shared value during render).
  const [mounted, setMounted] = useState(visible)

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const handleUnmount = useCallback(() => {
    setMounted(false)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (visible) {
      setMounted(true)
      translateY.value = withSpring(0, { damping: 22, stiffness: 220 })
      backdropOpacity.value = withTiming(1, { duration: 250 })
    } else if (mounted) {
      translateY.value = withTiming(SHEET_MAX, { duration: 240 })
      backdropOpacity.value = withTiming(0, { duration: 240 }, (finished) => {
        if (finished) runOnJS(setMounted)(false)
      })
    }
  }, [visible])

  const animateOut = useCallback(() => {
    translateY.value = withTiming(SHEET_MAX, { duration: 240 })
    backdropOpacity.value = withTiming(0, { duration: 240 }, (finished) => {
      if (finished) runOnJS(handleUnmount)()
    })
  }, [handleUnmount, translateY, backdropOpacity])

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((e) => {
          translateY.value = Math.max(0, e.translationY)
        })
        .onEnd((e) => {
          if (e.translationY > 120 || e.velocityY > 800) {
            runOnJS(animateOut)()
          } else {
            translateY.value = withSpring(0, { damping: 22, stiffness: 220 })
          }
        }),
    [translateY, animateOut]
  )

  const handleBackdropPress = useCallback(() => {
    animateOut()
  }, [animateOut])

  if (!mounted) return null

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, { backgroundColor: colors.overlay }, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.bgSurface,
              borderColor: colors.border,
              paddingBottom: insets.bottom + S.xl,
              maxHeight: SHEET_MAX,
            },
            sheetStyle,
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
          {title && <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

export const BottomSheet = React.memo(BottomSheetInner)

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: S.lg,
    paddingTop: S.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: S.lg,
  },
  title: {
    fontSize: 19,
    fontFamily: 'Nunito_700Bold',
    marginBottom: S.lg,
  },
  content: {},
})
