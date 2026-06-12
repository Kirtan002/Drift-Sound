import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSoundStore } from '../../src/store/useSoundStore';
import { Colors } from '../../src/theme';
import { Trash2 } from 'lucide-react-native';

export default function MixerScreen() {
  const { colors } = useTheme();
  const { mixerLayers, allSounds, updateVolume, clearMix } = useSoundStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Mix</Text>
        <TouchableOpacity onPress={clearMix}>
          <Trash2 color={Colors.error} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mixerLayers.map(layer => {
          const sound = allSounds.find(s => s.id === layer.soundId);
          return (
            <View key={layer.soundId} style={[styles.layerCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.soundName, { color: colors.text }]}>{sound?.title}</Text>
              {/* Slider would go here, using View as placeholder */}
              <View style={styles.sliderPlaceholder}>
                 <View style={[styles.sliderFill, { width: `${layer.volume * 100}%`, backgroundColor: colors.primary }]} />
              </View>
            </View>
          );
        })}

        {mixerLayers.length === 0 && (
          <Text style={styles.emptyText}>Add some sounds from the library to start mixing</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  layerCard: { padding: 15, borderRadius: 12, marginBottom: 15 },
  soundName: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  sliderPlaceholder: { height: 6, backgroundColor: '#2A2A3A', borderRadius: 3, overflow: 'hidden' },
  sliderFill: { height: '100%' },
  emptyText: { color: Colors.textSecondary, textAlign: 'center', marginTop: 100 }
});
