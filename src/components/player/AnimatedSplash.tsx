import React, { useEffect, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

const AnimatedPath = Animated.createAnimatedComponent(Path)

interface AnimatedSplashProps {
  onFinish: () => void
}

const moonPath = 'M 100 30 A 60 60 0 1 0 100 150 A 45 45 0 1 1 100 30 Z'

function AnimatedSplashInner({ onFinish }: AnimatedSplashProps) {
  const strokeProgress = useSharedValue(0)
  const fillOpacity = useSharedValue(0)
  const textOpacity = useSharedValue(0)
  const textSlide = useSharedValue(20)
  const subtitleOpacity = useSharedValue(0)

  const finish = useCallback(() => {
    onFinish()
  }, [onFinish])

  useEffect(() => {
    strokeProgress.value = withTiming(1, { duration: 400, easing: Easing.inOut(Easing.sin) })

    fillOpacity.value = withDelay(400, withTiming(1, { duration: 150 }))

    textOpacity.value = withDelay(550, withTiming(1, { duration: 300 }))
    textSlide.value = withDelay(550, withTiming(0, { duration: 300, easing: Easing.out(Easing.back(1.5)) }))

    subtitleOpacity.value = withDelay(850, withTiming(1, { duration: 300 }))

    setTimeout(() => {
      runOnJS(finish)()
    }, 1600)
  }, [])

  const moonProps = useAnimatedProps(() => ({
    strokeDashoffset: 300 * (1 - strokeProgress.value),
    fillOpacity: fillOpacity.value,
  }))

  const titleStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textSlide.value }],
  }))

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }))

  return (
    <View style={styles.container}>
      <Svg width={200} height={180} viewBox="0 0 200 180">
        <AnimatedPath
          d={moonPath}
          stroke="#6C8EFF"
          strokeWidth={3}
          strokeDasharray={300}
          fill="#6C8EFF"
          animatedProps={moonProps}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Animated.Text style={[styles.title, titleStyle]}>
        Drift Sound
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        sleep sounds
      </Animated.Text>
    </View>
  )
}

export const AnimatedSplash = React.memo(AnimatedSplashInner)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0C0C12',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginTop: 16,
  },
  subtitle: {
    color: '#6C8EFF',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
})
