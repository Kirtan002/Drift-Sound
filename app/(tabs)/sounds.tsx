import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useTheme } from '../../src/constants/ThemeContext'
import { SOUNDS } from '../../src/constants/sounds'
import { S, hPad } from '../../src/constants/spacing'
import { type } from '../../src/constants/typography'
import { CategoryTabs } from '../../src/components/sounds/CategoryTabs'
import { SoundCard } from '../../src/components/sounds/SoundCard'
import { IconButton } from '../../src/components/ui/IconButton'
import { usePlayerStore } from '../../src/store/playerStore'
import * as Haptics from 'expo-haptics'
import type { Sound } from '../../src/types/sound'

const PAGE_SIZE = 5

function SoundsScreenInner() {
  const { colors } = useTheme()
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const inputRef = useRef<TextInput>(null)
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
    if (activeCategory !== 'all') {
      result = result.filter(s => s.category === activeCategory)
    }
    return result as Sound[]
  }, [activeCategory, searchQuery])

  const displayed = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeCategory, searchQuery])

  const handleSearchToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (searchVisible) {
      setSearchQuery('')
      setSearchVisible(false)
    } else {
      setSearchVisible(true)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [searchVisible])

  const handleCategorySelect = useCallback((id: string) => {
    setActiveCategory(id)
  }, [])

  const handleLoadMore = useCallback(() => {
    setVisibleCount(p => Math.min(p + PAGE_SIZE, filtered.length))
  }, [filtered.length])

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
        url: sound.url,
      })
    }
  }, [activeSounds, addSound, removeSound])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const headerContent = useMemo(() => (
    <View>
      <View style={[styles.searchBar, { paddingHorizontal: hPad }]}>
        {searchVisible && (
          <View style={[styles.searchInputRow, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Text style={[styles.searchIcon, { color: colors.textMuted }]}>🔍</Text>
            <TextInput
              ref={inputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rain, ocean, focus..."
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={handleClearSearch} hitSlop={8}>
                <Text style={[styles.clearIcon, { color: colors.textMuted }]}>✕</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
      <View style={styles.categoryHeader}>
        <CategoryTabs active={activeCategory} onSelect={handleCategorySelect} />
      </View>
    </View>
  ), [searchVisible, searchQuery, colors, activeCategory, handleCategorySelect])

  const renderItem = useCallback(
    ({ item }: { item: Sound }) => (
      <SoundCard sound={item} onPress={handleSoundPress} />
    ),
    [handleSoundPress]
  )

  const keyExtractor = useCallback((item: Sound) => item.id, [])

  const numColumns = useMemo(() => {
    const W = Dimensions.get('window').width
    return W < 600 ? 3 : W < 840 ? 4 : 5
  }, [])

  if (filtered.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { paddingHorizontal: hPad }]}>
          <Text style={[type.headingL, { color: colors.textPrimary }]}>Sounds</Text>
          <IconButton icon="🔍" size={22} onPress={handleSearchToggle} color={searchVisible ? colors.accent : undefined} />
        </View>
        {headerContent}
        <View style={[styles.emptyState, { paddingHorizontal: hPad }]}>
          <Text style={[type.bodyM, { color: colors.textSecondary }]}>No sounds match that</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { paddingHorizontal: hPad }]}>
        <Text style={[type.headingL, { color: colors.textPrimary }]}>Sounds</Text>
        <IconButton icon="🔍" size={22} onPress={handleSearchToggle} color={searchVisible ? colors.accent : undefined} />
      </View>
      <FlatList
        data={displayed}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.grid, { paddingHorizontal: hPad }]}
        ListHeaderComponent={headerContent}
        ListFooterComponent={
          visibleCount < filtered.length
            ? () => (
                <Pressable
                  onPress={handleLoadMore}
                  style={({ pressed }) => [
                    styles.loadMore,
                    { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text style={[styles.loadMoreText]}>
                    Load More ({filtered.length - visibleCount} remaining)
                  </Text>
                </Pressable>
              )
            : undefined
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  )
}

export default React.memo(SoundsScreenInner)

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: S.lg,
  },
  searchBar: {
    paddingBottom: S.sm,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: S.md,
    height: 44,
    gap: S.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    height: 44,
  },
  categoryHeader: {
    paddingTop: 12,
  },
  clearIcon: {
    fontSize: 16,
    paddingLeft: S.xs,
  },
  grid: {
    gap: 12,
    paddingBottom: 120,
  },
  row: {
    gap: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMore: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 40,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
})
