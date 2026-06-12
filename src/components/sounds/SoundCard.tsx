import React, { useCallback, useMemo } from 'react'
import { Pressable, View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { cardW } from '../../constants/spacing'
import { useCloudSound } from '../../hooks/useCloudSound'
import type { Sound } from '../../types/sound'
import { usePlayerStore } from '../../store/playerStore'
import * as Haptics from 'expo-haptics'

interface SoundCardProps {
  sound: Sound
  onPress?: (sound: Sound) => void
}

function SoundCardInner({ sound, onPress }: SoundCardProps) {
  const { colors } = useTheme()
  const activeSounds = usePlayerStore(s => s.activeSounds)
  const isActive = useMemo(
    () => activeSounds.some(s => s.id === sound.id),
    [activeSounds, sound.id]
  )

  const isCloud = !!sound.url
  const { status, download } = useCloudSound(sound.id, sound.url)
  const isLoading = status === 'downloading'
  const isNotDownloaded = isCloud && status === 'not_downloaded'

  const handlePress = useCallback(() => {
    if (isNotDownloaded) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      download()
      return
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress?.(sound)
  }, [isNotDownloaded, download, onPress, sound])

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.bgCard,
          width: cardW,
          borderColor: isActive ? colors.accent : status === 'error' ? colors.red : 'transparent',
          borderWidth: isActive || status === 'error' ? 2 : 0,
          opacity: pressed && !isLoading ? 0.85 : 1,
        },
      ]}
    >
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.bgCard }]}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      )}
      <Text style={styles.emoji}>
        {isNotDownloaded ? '☁️' : status === 'error' ? '⚠️' : sound.emoji}
      </Text>
      <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={2}>
        {sound.name}
      </Text>
      {isNotDownloaded && (
        <Text style={[styles.downloadHint, { color: colors.textMuted }]}>tap to download</Text>
      )}
      {status === 'error' && (
        <Text style={[styles.downloadHint, { color: colors.red }]}>couldn't load</Text>
      )}
      {isActive && <View style={[styles.activeDot, { backgroundColor: colors.green }]} />}
    </Pressable>
  )
}

export const SoundCard = React.memo(SoundCardInner)

const styles = StyleSheet.create({
  card: {
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    position: 'relative',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  downloadHint: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    marginTop: 1,
  },
})
