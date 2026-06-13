import React, { useCallback, useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { VolumeSlider } from './VolumeSlider'
import { usePlayerStore } from '../../store/playerStore'
import { SOUND_BY_ID } from '../../constants/sounds'
import { S, hPad } from '../../constants/spacing'
import * as Haptics from 'expo-haptics'
import { Equalizer } from '../ui/Equalizer'
import { Icon } from '../ui/Icon'
import { PressableScale } from '../ui/PressableScale'
import type { ActiveSound } from '../../types/sound'

interface MixTrackProps {
  sound: ActiveSound
}

function MixTrackInner({ sound }: MixTrackProps) {
  const { colors } = useTheme()
  const setVolume = usePlayerStore(s => s.setVolume)
  const removeSound = usePlayerStore(s => s.removeSound)
  const isPlaying = usePlayerStore(s => s.isPlaying)

  // Emoji resolves from the catalog (or the sound's own emoji) instead of a
  // brittle name-matched chain.
  const emoji = useMemo(
    () => sound.emoji ?? SOUND_BY_ID[sound.id]?.emoji ?? '🎵',
    [sound.id, sound.emoji]
  )

  const handleVolumeChange = useCallback((vol: number) => {
    setVolume(sound.id, vol)
  }, [setVolume, sound.id])

  const handleRemove = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    removeSound(sound.id)
  }, [removeSound, sound.id])

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={styles.soundInfo}>
          <View style={[styles.emojiWrap, { backgroundColor: colors.bgSurface }]}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {sound.name}
          </Text>
          <Equalizer isPlaying={isPlaying} color={colors.accent} size="sm" barCount={4} style={styles.eq} />
        </View>
        <PressableScale onPress={handleRemove} scaleTo={0.85} style={styles.removeBtn}>
          <Icon name="close" size={16} color={colors.textMuted} />
        </PressableScale>
      </View>
      <VolumeSlider value={sound.volume} onValueChange={handleVolumeChange} />
    </View>
  )
}

export const MixTrack = React.memo(MixTrackInner)

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: S.lg,
    marginBottom: 12,
    marginHorizontal: hPad,
    gap: S.md,
    borderWidth: StyleSheet.hairlineWidth,
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
    flex: 1,
  },
  emojiWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    flexShrink: 1,
  },
  eq: {
    marginLeft: 'auto',
    marginRight: S.sm,
  },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
