import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function ToolsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1A1A1A' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        contentStyle: { backgroundColor: '#111' },
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => router.back()} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
          >
            <Text style={{ color: '#0A84FF', fontSize: 15, fontWeight: '600' }}>Done</Text>
          </TouchableOpacity>
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
