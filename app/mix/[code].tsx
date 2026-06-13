import { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { SOUND_BY_ID } from '../../src/constants/sounds'
import { usePlayerStore } from '../../src/store/playerStore'
import { useTheme } from '../../src/constants/ThemeContext'
import type { ActiveSound } from '../../src/types/sound'

export default function MixCodeRoute() {
  const { code } = useLocalSearchParams<{ code: string }>()
  const { colors } = useTheme()
  const play = usePlayerStore(s => s.play)

  useEffect(() => {
    if (!code) {
      router.replace('/(tabs)/home')
      return
    }

    const parts = code.split('-')
    const sounds = parts
      .map((p): ActiveSound | null => {
        const [id, vol] = p.split('_')
        const volNum = vol ? parseInt(vol, 10) / 100 : 0.5
        const def = SOUND_BY_ID[id]
        if (!def) return null
        return {
          id: def.id,
          name: def.name,
          volume: Math.max(0, Math.min(1, volNum)),
          file: def.file,
          url: def.url,
          emoji: def.emoji,
        }
      })
      .filter((s): s is ActiveSound => s !== null)

    if (sounds.length > 0) {
      play(sounds)
    }

    router.replace('/(tabs)/home')
  }, [code, play])

  return (
    <View style={[styles.loading, { backgroundColor: colors.bg }]}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
