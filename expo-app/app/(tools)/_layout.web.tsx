import { Colors } from '@/src/theme/Colors';
import { Stack } from 'expo-router';
import { Link } from 'expo-router';
import { Text } from 'react-native';

export default function WebToolsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0d0d15' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: 'Viral-Black', fontSize: 20 },
        contentStyle: { backgroundColor: Colors.appBackground },
        headerRight: () => (
          <Link href="/(tabs)/tools" style={{ paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', textDecorationLine: 'none' }}>
            <Text style={{ color: '#5AC8FA', fontSize: 15, fontWeight: '600' }}>Done</Text>
          </Link>
        ),
      }}
    >
      <Stack.Screen name="dice" options={{ title: 'Dice' }} />
      <Stack.Screen name="bottle" options={{ title: 'Bottle' }} />
      <Stack.Screen name="hourglass" options={{ title: 'Hourglass' }} />
      <Stack.Screen name="coin" options={{ title: 'Coin Flip' }} />
      <Stack.Screen name="teams" options={{ title: 'Team Splitter' }} />
    </Stack>
  );
}
