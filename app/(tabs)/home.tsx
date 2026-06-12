import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Colors } from '../../src/theme';
import { Moon } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Good Evening</Text>
            <Text style={styles.subtitle}>Ready for a deep sleep?</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/night-shield')}
            style={[styles.iconButton, { backgroundColor: colors.card }]}
          >
            <Moon color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.nowPlayingPlaceholder}>
        <Text style={{ color: Colors.textSecondary }}>No sound playing</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, marginTop: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: Colors.textSecondary, fontSize: 16 },
  iconButton: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#2A2A3A' },
  nowPlayingPlaceholder: {
    height: 300,
    margin: 20,
    borderRadius: 20,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3A'
  }
});
