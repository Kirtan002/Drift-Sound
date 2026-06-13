import React, { useCallback, useMemo } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { cardW } from '../../constants/spacing'
import { useCloudSound } from '../../hooks/useCloudSound'
import { isSoundAvailable } from '../../constants/sounds'
import type { Sound } from '../../types/sound'
import { usePlayerStore } from '../../store/playerStore'
import { PressableScale } from '../ui/PressableScale'
import { Icon } from '../ui/Icon'

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
  const available = isSoundAvailable(sound)
  const { status, download } = useCloudSound(sound.id, sound.url)
  const isLoading = status === 'downloading'
  const isNotDownloaded = isCloud && status === 'not_downloaded'
  const comingSoon = !available
  const isError = status === 'error'

  const handlePress = useCallback(() => {
    if (comingSoon) return
    if (isNotDownloaded) {
      download()
      return
    }
    onPress?.(sound)
  }, [comingSoon, isNotDownloaded, download, onPress, sound])

  const borderColor = isActive
    ? colors.accent
    : isError
      ? colors.red
      : 'transparent'

  return (
    <PressableScale
      onPress={handlePress}
      haptic={!comingSoon}
      scaleTo={comingSoon ? 1 : 0.93}
      style={[
        styles.card,
        {
          backgroundColor: isActive ? colors.accentDim : colors.bgCard,
          width: cardW,
          borderColor,
          borderWidth: isActive || isError ? 1.5 : StyleSheet.hairlineWidth,
          opacity: comingSoon ? 0.45 : 1,
        },
      ]}
    >
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.bgCard }]}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      )}

      <Text style={styles.emoji}>
        {isNotDownloaded ? '☁️' : isError ? '⚠️' : sound.emoji}
      </Text>
      <Text
        style={[styles.name, { color: isActive ? colors.accent : colors.textPrimary }]}
        numberOfLines={2}
      >
        {sound.name}
      </Text>

      {comingSoon && !isCloud && (
        <Text style={[styles.hint, { color: colors.textMuted }]}>soon</Text>
      )}
      {isNotDownloaded && (
        <Text style={[styles.hint, { color: colors.textMuted }]}>tap to get</Text>
      )}
      {isError && (
        <Text style={[styles.hint, { color: colors.red }]}>retry</Text>
      )}

      {isActive && (
        <View style={[styles.activeBadge, { backgroundColor: colors.accent }]}>
          <Icon name="check" size={11} color="#fff" strokeWidth={3} />
        </View>
      )}
    </PressableScale>
  )
}

export const SoundCard = React.memo(SoundCardInner)

const styles = StyleSheet.create({
  card: {
    height: 92,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    position: 'relative',
  },
  emoji: {
    fontSize: 26,
    marginBottom: 5,
  },
  name: {
    fontSize: 12.5,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  activeBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  hint: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
})
