import React, { useMemo, useCallback, useEffect } from 'react'
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
import { S } from '../../constants/spacing'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const SHEET_HEIGHT = 400

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

function BottomSheetInner({ visible, onClose, title, children }: BottomSheetProps) {
  const { colors } = useTheme()
  const translateY = useSharedValue(SHEET_HEIGHT)
  const backdropOpacity = useSharedValue(0)

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const animateOut = useCallback(() => {
    translateY.value = withTiming(SHEET_HEIGHT, { duration: 250 })
    backdropOpacity.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(onClose)()
    })
  }, [onClose, translateY, backdropOpacity])

  const animateIn = useCallback(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 200 })
    backdropOpacity.value = withTiming(1, { duration: 300 })
  }, [translateY, backdropOpacity])

  useEffect(() => {
    if (visible) {
      animateIn()
    } else {
      translateY.value = withTiming(SHEET_HEIGHT, { duration: 250 })
      backdropOpacity.value = withTiming(0, { duration: 250 })
    }
  }, [visible])

  const gest = useMemo(() => Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY
      }
    })
    .onEnd((e) => {
      if (e.translationY > 100) {
        runOnJS(animateOut)()
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 })
      }
    }), [translateY, animateOut])

  const handleBackdropPress = useCallback(() => {
    animateOut()
  }, [animateOut])

  if (!visible && translateY.value === SHEET_HEIGHT) return null

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, { backgroundColor: colors.overlay }, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
      </Animated.View>
      <GestureDetector gesture={gest}>
        <Animated.View style={[styles.sheet, { backgroundColor: colors.bgSurface }, sheetStyle]}>
          <View style={[styles.handle, { backgroundColor: colors.textMuted }]} />
          {title && (
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          )}
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
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: S.lg,
    paddingTop: S.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: S.lg,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: S.lg,
  },
  content: {
    flex: 1,
  },
})
