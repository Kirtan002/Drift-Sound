import { Tabs } from 'expo-router';
import { Home, Library, Music2, Timer as TimerIcon } from 'lucide-react-native';
import { Colors } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.primary,
      tabBarStyle: { backgroundColor: '#0C0C12', borderTopColor: '#1A1A24' },
      headerStyle: { backgroundColor: '#0C0C12' },
      headerTintColor: '#FFFFFF',
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="sounds"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="mixer"
        options={{
          title: 'Mixer',
          tabBarIcon: ({ color, size }) => <Music2 color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color, size }) => <TimerIcon color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
