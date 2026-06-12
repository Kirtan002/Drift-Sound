import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Colors } from '../../src/theme';
import { AudioEngine } from '../../src/audio/AudioEngine';
import { formatTime } from '../../src/utils/format';

export default function TimerScreen() {
  const { colors } = useTheme();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      AudioEngine.fadeOutAndStopAll(300000); // 5 minute exponential fade
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsActive(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.timerText, { color: colors.text }]}>
        {timeLeft > 0 ? formatTime(timeLeft) : 'No Timer Set'}
      </Text>

      <View style={styles.presets}>
        {[15, 30, 45, 60].map(mins => (
          <TouchableOpacity
            key={mins}
            onPress={() => startTimer(mins)}
            style={[styles.presetBtn, { backgroundColor: colors.card }]}
          >
            <Text style={{ color: colors.text }}>{mins}m</Text>
          </TouchableOpacity>
        ))}
      </View>

      {timeLeft > 0 && (
        <TouchableOpacity
          onPress={() => { setIsActive(false); setTimeLeft(0); }}
          style={[styles.cancelBtn, { backgroundColor: Colors.error }]}
        >
          <Text style={styles.cancelText}>Cancel Timer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  timerText: { fontSize: 48, fontWeight: 'bold', marginBottom: 40 },
  presets: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
  presetBtn: { paddingHorizontal: 20, paddingVertical: 15, borderRadius: 12, minWidth: 80, alignItems: 'center' },
  cancelBtn: { marginTop: 40, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  cancelText: { color: '#FFF', fontWeight: 'bold' }
});
