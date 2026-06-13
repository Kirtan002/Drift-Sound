import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../src/constants/ThemeContext'
import { SOUNDS } from '../../src/constants/sounds'
import { S, hPad, cols, gridGap } from '../../src/constants/spacing'
import { type } from '../../src/constants/typography'
import { CategoryTabs } from '../../src/components/sounds/CategoryTabs'
import { SoundCard } from '../../src/components/sounds/SoundCard'
import { MiniPlayer } from '../../src/components/player/MiniPlayer'
import { ScreenBackground } from '../../src/components/ui/ScreenBackground'
import { IconButton } from '../../src/components/ui/IconButton'
import { Icon } from '../../src/components/ui/Icon'
import { PressableScale } from '../../src/components/ui/PressableScale'
import { usePlayerStore } from '../../src/store/playerStore'
import type { Sound } from '../../src/types/sound'

const PAGE_SIZE = 12

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
    if (searchVisible) {
      setSearchQuery('')
      setSearchVisible(false)
    } else {
      setSearchVisible(true)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [searchVisible])

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
        emoji: sound.emoji,
      })
    }
  }, [activeSounds, addSound, removeSound])

  const headerContent = useMemo(() => (
    <View>
      {searchVisible && (
        <View style={[styles.searchBar, { paddingHorizontal: hPad }]}>
          <View style={[styles.searchInputRow, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Icon name="search" size={18} color={colors.textMuted} />
            <TextInput
              ref={inputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rain, ocean, focus…"
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.textPrimary }]}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                <Icon name="close" size={16} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
        </View>
      )}
      <View style={styles.categoryHeader}>
        <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
      </View>
    </View>
  ), [searchVisible, searchQuery, colors, activeCategory])

  const renderItem = useCallback(
    ({ item }: { item: Sound }) => <SoundCard sound={item} onPress={handleSoundPress} />,
    [handleSoundPress]
  )

  const keyExtractor = useCallback((item: Sound) => item.id, [])

  const header = (
    <View style={[styles.header, { paddingHorizontal: hPad }]}>
      <View>
        <Text style={[type.headingL, { color: colors.textPrimary }]}>Sounds</Text>
        <Text style={[styles.count, { color: colors.textMuted }]}>{filtered.length} available</Text>
      </View>
      <IconButton
        icon="search"
        onPress={handleSearchToggle}
        color={searchVisible ? colors.accent : undefined}
      />
    </View>
  )

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        {filtered.length === 0 ? (
          <>
            {headerContent}
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[type.bodyM, { color: colors.textSecondary }]}>No sounds match that</Text>
            </View>
          </>
        ) : (
          <FlatList
            data={displayed}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={cols}
            columnWrapperStyle={cols > 1 ? styles.row : undefined}
            contentContainerStyle={[styles.grid, { paddingHorizontal: hPad }]}
            ListHeaderComponent={headerContent}
            ListFooterComponent={
              visibleCount < filtered.length ? (
                <PressableScale
                  onPress={() => setVisibleCount(p => Math.min(p + PAGE_SIZE, filtered.length))}
                  style={[styles.loadMore, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                >
                  <Text style={[styles.loadMoreText, { color: colors.accent }]}>
                    Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
                  </Text>
                </PressableScale>
              ) : null
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
        <MiniPlayer />
      </SafeAreaView>
    </ScreenBackground>
  )
}

export default React.memo(SoundsScreenInner)

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: S.sm,
  },
  count: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  searchBar: {
    paddingTop: S.sm,
    paddingBottom: S.xs,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: S.md,
    height: 46,
    gap: S.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    height: 46,
  },
  categoryHeader: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  grid: {
    gap: gridGap,
    paddingBottom: 24,
    paddingTop: 8,
  },
  row: {
    gap: gridGap,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: S.md,
  },
  emptyEmoji: { fontSize: 40 },
  loadMore: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 20,
    marginBottom: 12,
  },
  loadMoreText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
})
