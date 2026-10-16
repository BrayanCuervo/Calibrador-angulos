import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const tab = (title: string, on: IconName, off: IconName) => ({
  title,
  tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
    <Ionicons name={focused ? on : off} size={size} color={color} />
  ),
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: '#fff',
        headerTitleAlign: Platform.OS === 'ios' ? 'center' : 'left',
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: Platform.select({
          ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
          android: { elevation: 12, height: 64, paddingBottom: 8 },
        }),
      }}
    >
      <Tabs.Screen name="index" options={tab('Nivel', 'speedometer', 'speedometer-outline')} />
      <Tabs.Screen name="audio" options={tab('Audio', 'mic', 'mic-outline')} />
      <Tabs.Screen name="location" options={tab('Ubicación', 'location', 'location-outline')} />
    </Tabs>
  );
}
