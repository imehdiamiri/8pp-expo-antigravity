import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackgroundView } from '@/src/components/AppBackgroundView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Games, GameMode } from '@/src/models/AppModels';
import { useGameStore } from '@/src/store/useGameStore';

export default function GameSetupScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string, mode: GameMode }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { startSingleDeviceSession } = useGameStore();
  
  const gameKey = Object.keys(Games).find(key => Games[key].id === id);
  const game = gameKey ? Games[gameKey] : null;

  const [playerCount, setPlayerCount] = useState(game ? Math.max(game.minPlayers, Math.min(2, game.maxPlayers)) : 2);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(playerCount).fill(''));
  const [roundCount, setRoundCount] = useState(3);
  const [showDuplicateError, setShowDuplicateError] = useState(false);

  if (!game) {
    return (
      <View style={styles.container}>
        <AppBackgroundView />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Game not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const hasDuplicateNames = () => {
    const trimmed = playerNames
      .map(name => name.trim().toLowerCase())
      .filter(name => name.length > 0);
    return new Set(trimmed).size !== trimmed.length;
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
    if (showDuplicateError) setShowDuplicateError(false);
  };

  const increasePlayers = () => {
    if (playerCount < game.maxPlayers) {
      setPlayerCount(prev => prev + 1);
      setPlayerNames(prev => [...prev, '']);
    }
  };

  const decreasePlayers = () => {
    if (playerCount > game.minPlayers) {
      setPlayerCount(prev => prev - 1);
      setPlayerNames(prev => prev.slice(0, prev.length - 1));
    }
  };

  const handleStart = () => {
    if (hasDuplicateNames()) {
      setShowDuplicateError(true);
      return;
    }
    
    startSingleDeviceSession(game!, playerNames, roundCount);
    router.push(`/game/${id}/session` as any);
  };

  return (
    <View style={styles.container}>
      <AppBackgroundView />
      
      <Stack.Screen 
        options={{
          title: `${game.name} — Setup`,
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: 'dark',
          headerTintColor: 'white',
          headerLargeTitle: false,
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: Platform.OS === 'android' ? insets.top + 60 : 0 }]} 
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        
        {/* Setup Players Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Players</Text>
          <Text style={styles.sectionSubtitle}>Enter names for everyone playing.</Text>
          
          <View style={styles.card}>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={[styles.stepperButton, playerCount <= game.minPlayers && styles.stepperButtonDisabled]}
                onPress={decreasePlayers}
                disabled={playerCount <= game.minPlayers}
              >
                <IconSymbol name="minus" size={20} color="white" />
              </TouchableOpacity>
              
              <Text style={styles.stepperText}>{playerCount} Players</Text>
              
              <TouchableOpacity 
                style={[styles.stepperButton, playerCount >= game.maxPlayers && styles.stepperButtonDisabled]}
                onPress={increasePlayers}
                disabled={playerCount >= game.maxPlayers}
              >
                <IconSymbol name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.namesContainer}>
              {playerNames.map((name, index) => (
                <View key={index} style={styles.nameInputWrapper}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{index + 1}</Text>
                  </View>
                  <TextInput
                    style={styles.nameInput}
                    placeholder={`Player ${index + 1}`}
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={name}
                    onChangeText={(text) => updatePlayerName(index, text)}
                    returnKeyType="done"
                  />
                </View>
              ))}
            </View>
          </View>
          
          {showDuplicateError && (
            <Text style={styles.errorLabel}>Two or more players have the same name. Please use unique names.</Text>
          )}
        </View>

        {/* Setup Rounds Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rounds</Text>
          <Text style={styles.sectionSubtitle}>How long do you want to play?</Text>
          
          <View style={styles.card}>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={[styles.stepperButton, roundCount <= 1 && styles.stepperButtonDisabled]}
                onPress={() => setRoundCount(prev => Math.max(1, prev - 1))}
                disabled={roundCount <= 1}
              >
                <IconSymbol name="minus" size={20} color="white" />
              </TouchableOpacity>
              
              <Text style={styles.stepperText}>{roundCount} {roundCount === 1 ? 'Round' : 'Rounds'}</Text>
              
              <TouchableOpacity 
                style={[styles.stepperButton, roundCount >= 10 && styles.stepperButtonDisabled]}
                onPress={() => setRoundCount(prev => Math.min(10, prev + 1))}
                disabled={roundCount >= 10}
              >
                <IconSymbol name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Start Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Viral-Black',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 100, // Space for bottom bar
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginBottom: 4,
  },
  card: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 16,
    padding: 16,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.3,
  },
  stepperText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  namesContainer: {
    gap: 12,
  },
  nameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nameInput: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    paddingVertical: 6,
  },
  errorLabel: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
