import { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { SOUNDS } from '../../src/constants/sounds'
import { usePlayerStore } from '../../src/store/playerStore'

export default function MixCodeRoute() {
  const { code } = useLocalSearchParams<{ code: string }>()
  const play = usePlayerStore(s => s.play)

  useEffect(() => {
    if (!code) {
      router.replace('/(tabs)/home')
      return
    }

    const parts = code.split('-')
    const sounds = parts.map(p => {
      const [id, vol] = p.split('_')
      const volNum = vol ? parseInt(vol, 10) / 100 : 0.5
      const soundDef = SOUNDS.find(s => s.id === id)
      if (!soundDef) return null
      return { id: soundDef.id, name: soundDef.name, volume: volNum, file: soundDef.file }
    }).filter(Boolean) as { id: string; name: string; volume: number; file: string }[]

    if (sounds.length > 0) {
      play(sounds)
    }

    router.replace('/(tabs)/home')
  }, [code, play])

  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" />
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
