import React, { useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { usePlayerStore } from '../../store/playerStore'
import { WaveformAnim } from './WaveformAnim'
import { BreathingGuide } from './BreathingGuide'
import { S, hPad } from '../../constants/spacing'
import * as Haptics from 'expo-haptics'

function HeroPlayerInner() {
  const { colors } = useTheme()
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const activeSounds = usePlayerStore(s => s.activeSounds)
  const activeScene = usePlayerStore(s => s.activeScene)
  const isBreathingGuide = usePlayerStore(s => s.isBreathingGuide)
  const pause = usePlayerStore(s => s.pause)
  const resume = usePlayerStore(s => s.resume)

  const hasAudio = activeSounds.length > 0

  const handleTap = useCallback(() => {
    Haptics.impactAsync(
      isPlaying ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    )
    if (isPlaying) {
      pause()
    } else {
      resume()
    }
  }, [isPlaying, pause, resume])

  const label = useCallback(() => {
    if (activeScene) return activeScene
    if (activeSounds.length === 1) return activeSounds[0].name
    if (activeSounds.length > 1) return `Custom Mix · ${activeSounds.length} sounds`
    return ''
  }, [activeScene, activeSounds])

  if (!hasAudio) return null

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Pressable onPress={handleTap} style={styles.tapZone}>
        <View style={styles.heroContent}>
          <WaveformAnim isPlaying={isPlaying} />
          <Text style={[styles.soundName, { color: colors.textPrimary }]}>
            {label()}
          </Text>
        </View>
      </Pressable>
      <View style={styles.guideContainer}>
        <BreathingGuide enabled={isBreathingGuide} />
      </View>
    </View>
  )
}

export const HeroPlayer = React.memo(HeroPlayerInner)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  tapZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    gap: S.xxl,
    paddingHorizontal: hPad,
  },
  soundName: {
    fontSize: 20,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
  },
  guideContainer: {
    position: 'absolute',
    top: S.xxxl,
    right: hPad,
  },
})
