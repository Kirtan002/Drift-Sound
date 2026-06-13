import React, { useCallback, useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { S } from '../../constants/spacing'
import { usePlayerStore } from '../../store/playerStore'
import { SCENE_BY_ID } from '../../constants/scenes'
import { Equalizer } from '../ui/Equalizer'
import { Icon } from '../ui/Icon'
import { PressableScale } from '../ui/PressableScale'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'

function MiniPlayerInner() {
  const { colors } = useTheme()
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const activeSounds = usePlayerStore(s => s.activeSounds)
  const activeScene = usePlayerStore(s => s.activeScene)
  const pause = usePlayerStore(s => s.pause)
  const resume = usePlayerStore(s => s.resume)
  const stop = usePlayerStore(s => s.stop)

  const hasAudio = activeSounds.length > 0

  const handlePlayPause = useCallback(() => {
    if (isPlaying) pause()
    else resume()
  }, [isPlaying, pause, resume])

  const handleStop = useCallback(() => {
    stop()
  }, [stop])

  const label = useMemo(() => {
    if (activeScene) return SCENE_BY_ID[activeScene]?.name ?? activeScene
    if (activeSounds.length === 1) return activeSounds[0].name
    return `${activeSounds.length} sounds`
  }, [activeScene, activeSounds])

  const sublabel = useMemo(() => {
    if (activeScene) return 'Scene'
    return isPlaying ? 'Playing' : 'Paused'
  }, [activeScene, isPlaying])

  if (!hasAudio) return null

  return (
    <Animated.View
      entering={FadeInDown.duration(280)}
      exiting={FadeOutDown.duration(200)}
      style={[styles.container, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
    >
      <View style={styles.info}>
        <View style={[styles.eqWrap, { backgroundColor: colors.accentDim }]}>
          <Equalizer isPlaying={isPlaying} color={colors.accent} size="sm" barCount={4} />
        </View>
        <View style={styles.labels}>
          <Text style={[styles.label, { color: colors.textPrimary }]} numberOfLines={1}>
            {label}
          </Text>
          <Text style={[styles.sublabel, { color: colors.textMuted }]} numberOfLines={1}>
            {sublabel}
          </Text>
        </View>
      </View>
      <View style={styles.controls}>
        <PressableScale
          onPress={handlePlayPause}
          scaleTo={0.9}
          style={[styles.playBtn, { backgroundColor: colors.accent }]}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size={18} color="#fff" />
        </PressableScale>
        <PressableScale onPress={handleStop} scaleTo={0.85} style={styles.stopBtn}>
          <Icon name="stop" size={18} color={colors.textMuted} />
        </PressableScale>
      </View>
    </Animated.View>
  )
}

export const MiniPlayer = React.memo(MiniPlayerInner)

const styles = StyleSheet.create({
  container: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: S.md,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
  },
  eqWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labels: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  sublabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  playBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
