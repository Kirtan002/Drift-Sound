import React, { useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { S } from '../../constants/spacing'
import { usePlayerStore } from '../../store/playerStore'
import * as Haptics from 'expo-haptics'

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (isPlaying) {
      pause()
    } else {
      resume()
    }
  }, [isPlaying, pause, resume])

  const handleStop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    stop()
  }, [stop])

  if (!hasAudio) return null

  const label = activeScene ?? `${activeSounds.length} sound${activeSounds.length > 1 ? 's' : ''}`

  return (
    <View style={[styles.container, { backgroundColor: colors.bgCard, borderTopColor: colors.border }]}>
      <View style={styles.info}>
        <View style={styles.waveformMini}>
          {[2, 4, 3, 5, 2].map((h, i) => (
            <View
              key={i}
              style={[
                styles.waveBar,
                {
                  height: h * 4,
                  backgroundColor: colors.accent,
                  opacity: isPlaying ? 0.8 : 0.4,
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.label, { color: colors.textPrimary }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={styles.controls}>
        <Pressable
          onPress={handlePlayPause}
          style={[styles.playBtn, { backgroundColor: colors.accent }]}
          hitSlop={8}
        >
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
        </Pressable>
        <Pressable onPress={handleStop} style={styles.stopBtn} hitSlop={8}>
          <Text style={[styles.stopIcon, { color: colors.textMuted }]}>⏹</Text>
        </Pressable>
      </View>
    </View>
  )
}

export const MiniPlayer = React.memo(MiniPlayerInner)

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: S.lg,
    borderTopWidth: 1,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
  },
  waveformMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 20,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 16,
  },
  stopBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    fontSize: 20,
  },
})
