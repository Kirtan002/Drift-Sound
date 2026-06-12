import React, { useCallback, useMemo } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { VolumeSlider } from './VolumeSlider'
import { usePlayerStore } from '../../store/playerStore'
import { S, hPad } from '../../constants/spacing'
import * as Haptics from 'expo-haptics'
import type { ActiveSound } from '../../types/sound'

interface MixTrackProps {
  sound: ActiveSound
}

function MixTrackInner({ sound }: MixTrackProps) {
  const { colors } = useTheme()
  const setVolume = usePlayerStore(s => s.setVolume)
  const removeSound = usePlayerStore(s => s.removeSound)

  const handleVolumeChange = useCallback((vol: number) => {
    setVolume(sound.id, vol)
  }, [setVolume, sound.id])

  const handleRemove = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    removeSound(sound.id)
  }, [removeSound, sound.id])

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard }]}>
      <View style={styles.topRow}>
        <View style={styles.soundInfo}>
          <Text style={styles.emoji}>
            {sound.name === 'Brown Noise' ? '🤎' : sound.name === 'White Noise' ? '📡' : sound.name === 'Pink Noise' ? '🩷' : sound.name === 'Rain Light' ? '🌦️' : sound.name === 'Ocean Waves' ? '🌊' : sound.name === 'Campfire' ? '🔥' : sound.name === 'Forest Morning' ? '🌲' : sound.name === 'Air Conditioner' ? '❄️' : sound.name === 'Coffee Shop' ? '☕' : sound.name === 'Fireplace' ? '🏠' : sound.name === 'Delta Waves' ? '🧠' : '🎵'}
          </Text>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{sound.name}</Text>
        </View>
        <Pressable onPress={handleRemove} style={styles.removeBtn} hitSlop={8}>
          <Text style={[styles.removeIcon, { color: colors.textMuted }]}>✕</Text>
        </Pressable>
      </View>
      <VolumeSlider
        value={sound.volume}
        onValueChange={handleVolumeChange}
      />
      <View style={styles.waveformMini}>
        {[3, 5, 4, 7, 3].map((h, i) => (
          <View
            key={i}
            style={[
              styles.waveBar,
              {
                height: h * 3,
                backgroundColor: colors.accent,
                opacity: 0.4 + h * 0.08,
              },
            ]}
          />
        ))}
      </View>
    </View>
  )
}

export const MixTrack = React.memo(MixTrackInner)

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: S.lg,
    marginBottom: 10,
    marginHorizontal: hPad,
    gap: S.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  emoji: {
    fontSize: 20,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
  waveformMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 24,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
  },
})
