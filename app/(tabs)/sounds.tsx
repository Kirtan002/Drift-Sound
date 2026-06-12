import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSoundStore } from '../../src/store/useSoundStore';
import { Colors } from '../../src/theme';

export default function SoundsScreen() {
  const { colors } = useTheme();
  const {
    categories,
    activeCategory,
    visibleSounds,
    setActiveCategory,
    loadMoreSounds,
    allSounds,
    toggleSound,
    mixerLayers
  } = useSoundStore();

  const filteredCount = activeCategory === 'All'
    ? allSounds.length
    : allSounds.filter(s => s.category === activeCategory).length;

  const hasMore = visibleSounds.length < filteredCount;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.categoryChip,
                activeCategory === cat && { backgroundColor: colors.primary }
              ]}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === cat && { color: '#FFF' }
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={visibleSounds}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isActive = mixerLayers.some(l => l.soundId === item.id);
          return (
            <TouchableOpacity
              onPress={() => toggleSound(item)}
              style={[styles.soundCard, { backgroundColor: colors.card, borderColor: isActive ? colors.primary : '#2A2A3A' }]}
            >
              <Text style={[styles.soundTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={styles.soundCategory}>{item.category}</Text>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={() => hasMore ? (
          <TouchableOpacity
            onPress={loadMoreSounds}
            style={[styles.loadMoreButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  categoriesContainer: { paddingVertical: 15 },
  categoriesScroll: { paddingHorizontal: 15 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, backgroundColor: '#1A1A24' },
  categoryText: { color: Colors.textSecondary, fontWeight: '600' },
  listContent: { padding: 15, paddingBottom: 100 },
  soundCard: { padding: 20, borderRadius: 15, marginBottom: 15, borderWidth: 1 },
  soundTitle: { fontSize: 18, fontWeight: '600' },
  soundCategory: { color: Colors.textSecondary, marginTop: 4 },
  loadMoreButton: { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  loadMoreText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
