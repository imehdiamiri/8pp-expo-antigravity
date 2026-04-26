import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGameStore } from '@/src/store/useGameStore';
import { GameSessionRenderer } from '@/src/components/games/GameSessionRenderer';
import { AppBackgroundView } from '@/src/components/AppBackgroundView';

export default function GameSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { activeSession, exitActiveSession } = useGameStore();

  useEffect(() => {
    if (!activeSession) {
      router.replace('/(tabs)');
    }
  }, [activeSession]);

  if (!activeSession) {
    return null;
  }

  const handleExit = () => {
    Alert.alert(
      'Leave Game?',
      'Your current progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave Game', 
          style: 'destructive',
          onPress: () => {
            exitActiveSession();
            router.back();
            router.back(); // Go back to game detail or library
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppBackgroundView />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleExit} style={styles.headerButton}>
          <IconSymbol name="xmark" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeSession.game.name}</Text>
        <View style={styles.headerButton} />
      </View>

      <GameSessionRenderer session={activeSession} game={activeSession.game} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

