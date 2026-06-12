import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { Theme } from '../src/theme';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { useSoundStore } from '../src/store/useSoundStore';

const MOCK_SOUNDS = [
  { id: '1', title: 'Gentle Rain', category: 'Rain', localAsset: require('../assets/sounds/gentle-rainfall.mp3') },
  { id: '2', title: 'Forest Frogs', category: 'Nature', localAsset: require('../assets/sounds/forest-with-frogs-and-crickets.mp3') },
  { id: '3', title: 'Thunderstorm', category: 'Rain', localAsset: require('../assets/sounds/rain-and-thunder.mp3') },
  { id: '4', title: 'Soft Wind', category: 'Nature', localAsset: require('../assets/sounds/soft-wind-with-birds.mp3') },
  { id: '5', title: 'Calm Water', category: 'Nature', localAsset: require('../assets/sounds/water-calm.mp3') },
  { id: '6', title: 'Deep White Noise', category: 'White Noise', url: 'https://example.com/white-noise.mp3' },
  { id: '7', title: 'Pink Noise', category: 'White Noise', url: 'https://example.com/pink-noise.mp3' },
  { id: '8', title: 'Brown Noise', category: 'White Noise', url: 'https://example.com/brown-noise.mp3' },
  { id: '9', title: 'Ocean Waves', category: 'Nature', url: 'https://example.com/ocean.mp3' },
  { id: '10', title: 'Coffee Shop', category: 'Ambient', url: 'https://example.com/cafe.mp3' },
  { id: '11', title: 'Campfire', category: 'Nature', url: 'https://example.com/fire.mp3' },
];

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const setAllSounds = useSoundStore(state => state.setAllSounds);

  useEffect(() => {
    setAllSounds(MOCK_SOUNDS);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? Theme.dark : Theme.light}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal', title: 'Settings' }} />
      </Stack>
    </ThemeProvider>
  );
}
