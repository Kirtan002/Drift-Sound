import React, { useCallback, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated'
import { useTheme } from '../../constants/ThemeContext'
import { usePlayerStore } from '../../store/playerStore'
import { WaveformAnim } from './WaveformAnim'
import { BreathingGuide } from './BreathingGuide'
import { Icon } from '../ui/Icon'
import { useMotion } from '../../hooks/useMotion'
import { S, hPad } from '../../constants/spacing'
import * as Haptics from 'expo-haptics'

const ORB = 260

function HeroPlayerInner() {
  const { colors } = useTheme()
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const activeSounds = usePlayerStore(s => s.activeSounds)
  const activeScene = usePlayerStore(s => s.activeScene)
  const isBreathingGuide = usePlayerStore(s => s.isBreathingGuide)
  const pause = usePlayerStore(s => s.pause)
  const resume = usePlayerStore(s => s.resume)
  const setBreathingGuide = usePlayerStore(s => s.setBreathingGuide)
  const { animationsEnabled } = useMotion()

  const hasAudio = activeSounds.length > 0

  const pulse = useSharedValue(1)
  const glow = useSharedValue(0.6)
  const iconOpacity = useSharedValue(0)

  // Slow breathing pulse on the orb whenever audio is playing.
  useEffect(() => {
    cancelAnimation(pulse)
    cancelAnimation(glow)
    if (isPlaying && animationsEnabled) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.97, { duration: 2600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
      glow.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.5, { duration: 2600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    } else {
      pulse.value = withTiming(1, { duration: 600 })
      glow.value = withTiming(0.4, { duration: 600 })
    }
  }, [isPlaying, animationsEnabled])

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }))
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 0.9 + glow.value * 0.3 }],
  }))
  const iconStyle = useAnimatedStyle(() => ({ opacity: iconOpacity.value }))

  const handleTap = useCallback(() => {
    Haptics.impactAsync(
      isPlaying ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    )
    // Flash the play/pause glyph on the orb.
    iconOpacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 600 })
    )
    if (isPlaying) pause()
    else resume()
  }, [isPlaying, pause, resume])

  const handleBreathing = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setBreathingGuide(!isBreathingGuide)
  }, [isBreathingGuide, setBreathingGuide])

  const label = activeScene
    ? activeScene
    : activeSounds.length === 1
      ? activeSounds[0].name
      : `Custom Mix · ${activeSounds.length} sounds`

  if (!hasAudio) return null

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBreathing}
        style={[styles.guideToggle, { backgroundColor: isBreathingGuide ? colors.accentDim : 'transparent' }]}
        hitSlop={8}
      >
        <Icon name="sparkles" size={20} color={isBreathingGuide ? colors.accent : colors.textMuted} />
      </Pressable>

      <Pressable onPress={handleTap} style={styles.orbZone}>
        <View style={styles.orbWrap}>
          {/* Outer glow halo */}
          <Animated.View style={[styles.glowLayer, glowStyle]}>
            <Svg width={ORB} height={ORB}>
              <Defs>
                <RadialGradient id="halo" cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor={colors.accent} stopOpacity={0.55} />
                  <Stop offset="0.7" stopColor={colors.accent} stopOpacity={0.12} />
                  <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={ORB / 2} cy={ORB / 2} r={ORB / 2} fill="url(#halo)" />
            </Svg>
          </Animated.View>

          {/* Core orb */}
          <Animated.View style={[styles.orbCore, orbStyle]}>
            <Svg width={ORB * 0.62} height={ORB * 0.62}>
              <Defs>
                <RadialGradient id="orb" cx="38%" cy="32%" r="75%">
                  <Stop offset="0" stopColor={colors.accent} stopOpacity={0.95} />
                  <Stop offset="0.6" stopColor={colors.accent} stopOpacity={0.55} />
                  <Stop offset="1" stopColor={colors.accentDim} stopOpacity={0.9} />
                </RadialGradient>
              </Defs>
              <Circle cx={ORB * 0.31} cy={ORB * 0.31} r={ORB * 0.3} fill="url(#orb)" />
            </Svg>
            <Animated.View style={[styles.centerIcon, iconStyle]}>
              <Icon name={isPlaying ? 'pause' : 'play'} size={40} color="#fff" />
            </Animated.View>
          </Animated.View>

          {/* Breathing guide ring overlays the orb */}
          <View style={styles.guideOverlay} pointerEvents="none">
            <BreathingGuide enabled={isBreathingGuide} />
          </View>
        </View>
      </Pressable>

      <View style={styles.meta}>
        <Text style={[styles.soundName, { color: colors.textPrimary }]} numberOfLines={1}>
          {label}
        </Text>
        <WaveformAnim isPlaying={isPlaying} />
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {isPlaying ? 'Tap orb to pause' : 'Tap orb to play'}
        </Text>
      </View>
    </View>
  )
}

export const HeroPlayer = React.memo(HeroPlayerInner)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideToggle: {
    position: 'absolute',
    top: S.lg,
    right: hPad,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbZone: {
    width: ORB,
    height: ORB,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbWrap: {
    width: ORB,
    height: ORB,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbCore: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    alignItems: 'center',
    gap: S.lg,
    marginTop: S.section,
    paddingHorizontal: hPad,
  },
  soundName: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
})
