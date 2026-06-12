import React, { useMemo, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { hPad, cols } from '../../constants/spacing'
import { SOUNDS } from '../../constants/sounds'
import { SoundCard } from './SoundCard'
import type { Sound, SoundCategory } from '../../types/sound'
import { usePlayerStore } from '../../store/playerStore'

interface SoundGridProps {
  category: string
  searchQuery: string
}

function SoundGridInner({ category, searchQuery }: SoundGridProps) {
  const { colors } = useTheme()
  const addSound = usePlayerStore(s => s.addSound)
  const removeSound = usePlayerStore(s => s.removeSound)
  const activeSounds = usePlayerStore(s => s.activeSounds)

  const filtered = useMemo(() => {
    let result = SOUNDS as readonly Sound[]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        s => s.name.toLowerCase().includes(q) || s.category.includes(q)
      )
    }
    if (category !== 'all') {
      result = result.filter(s => s.category === category)
    }
    return result as Sound[]
  }, [category, searchQuery])

  const handleSoundPress = useCallback((sound: Sound) => {
    const alreadyActive = activeSounds.some(s => s.id === sound.id)
    if (alreadyActive) {
      removeSound(sound.id)
    } else {
      addSound({
        id: sound.id,
        name: sound.name,
        volume: 0.6,
        file: sound.file,
      })
    }
  }, [activeSounds, addSound, removeSound])

  const renderItem = useCallback(
    ({ item }: { item: Sound }) => (
      <SoundCard sound={item} onPress={handleSoundPress} />
    ),
    [handleSoundPress]
  )

  const keyExtractor = useCallback((item: Sound) => item.id, [])

  if (filtered.length === 0) {
    return (
      <View style={[styles.empty, { paddingHorizontal: hPad }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No sounds match that
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={filtered}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={cols}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.grid, { paddingHorizontal: hPad }]}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  )
}

export const SoundGrid = React.memo(SoundGridInner)

const styles = StyleSheet.create({
  grid: {
    gap: 12,
    paddingBottom: 100,
  },
  row: {
    gap: 12,
  },
  empty: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
})
