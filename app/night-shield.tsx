import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function NightShieldScreen() {
  useKeepAwake();
  const router = useRouter();
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => router.back()}
      style={styles.container}
    >
      <Text style={styles.clock}>{time}</Text>
      <Text style={styles.hint}>Tap anywhere to exit</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  clock: {
    color: '#333',
    fontSize: 80,
    fontWeight: 'bold'
  },
  hint: {
    color: '#1A1A1A',
    position: 'absolute',
    bottom: 50
  }
});
