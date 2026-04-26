import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { AppBackgroundView } from '@/src/components/AppBackgroundView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Games, GameMode } from '@/src/models/AppModels';
import { useGameStore } from '@/src/store/useGameStore';
import * as Clipboard from 'expo-clipboard';

export default function LobbyScreen() {
  const { roomCode, isHost, displayName, gameId } = useLocalSearchParams<{ 
    roomCode: string, 
    isHost: string, 
    displayName: string,
    gameId?: string 
  }>();
  
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Mock finding a game if gameId is passed, or default to some game if guest just joined
  const gameKey = Object.keys(Games).find(key => Games[key].id === (gameId ?? 'casual-reverse-singing'));
  const game = gameKey ? Games[gameKey] : Games['casualReverseSinging'];

  const { startSingleDeviceSession } = useGameStore();

  const isHostView = isHost === 'true';

  // Mock players list for demo
  const [players, setPlayers] = useState([
    { id: '1', name: displayName || 'You', isHost: isHostView, isMe: true },
    ...(isHostView ? [] : [{ id: '2', name: 'Host Player', isHost: true, isMe: false }])
  ]);

  useEffect(() => {
    // In a real app, listen to socket for new players
    if (isHostView) {
      const timer = setTimeout(() => {
        setPlayers(prev => [...prev, { id: '3', name: 'Guest Player', isHost: false, isMe: false }]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isHostView]);

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(roomCode);
    Alert.alert('Copied', 'Room code copied to clipboard!');
  };

  const handleStartGame = () => {
    // Navigate to session for this mock implementation
    // Ideally we would send a 'start game' signal to guests via websocket
    
    // In a real multi-device setup, we would initialize a MultiDevice session
    startSingleDeviceSession(game, players.map(p => p.name), 3);
    router.push(`/game/${game.id}/session` as any);
  };

  const handleCloseRoom = () => {
    Alert.alert(
      isHostView ? "Close Room?" : "Leave Room?",
      isHostView ? "This will close the room for everyone and expire the code." : "Are you sure you want to leave?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: isHostView ? "Close Room" : "Leave", 
          style: "destructive", 
          onPress: () => {
            router.dismissAll();
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
        <View style={styles.headerButton} />
        <Text style={styles.headerTitle}>{isHostView ? 'Host Lobby' : 'Game Lobby'}</Text>
        <TouchableOpacity onPress={handleCloseRoom} style={styles.headerButtonRight}>
          <Text style={styles.leaveText}>{isHostView ? 'Close Room' : 'Leave'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Room Header Card */}
        <View style={styles.roomCard}>
          <Text style={styles.gameTitle}>{game?.name ?? 'Party Game'}</Text>
          
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>ROOM CODE</Text>
            <Text style={styles.codeText}>{roomCode}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCopyCode}>
                <IconSymbol name="doc.on.doc.fill" size={14} color="white" />
                <Text style={styles.actionButtonText}>Copy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#007AFF' }]}>
                <IconSymbol name="square.and.arrow.up" size={14} color="white" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Host Actions or Guest Status */}
        {isHostView ? (
          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>Host Actions</Text>
            <Text style={styles.hintText}>Wait for everyone to join before starting.</Text>
            
            <TouchableOpacity 
              style={[styles.startButton, players.length < (game?.minPlayers ?? 2) && styles.startButtonDisabled]}
              onPress={handleStartGame}
              disabled={players.length < (game?.minPlayers ?? 2)}
            >
              <Text style={styles.startButtonText}>Start Game</Text>
              <IconSymbol name="play.circle.fill" size={20} color="white" />
            </TouchableOpacity>
            
            {players.length < (game?.minPlayers ?? 2) && (
              <Text style={styles.errorText}>Waiting for at least {game?.minPlayers ?? 2} players...</Text>
            )}
          </View>
        ) : (
          <View style={styles.actionsCard}>
            <View style={styles.waitingContainer}>
              <IconSymbol name="hourglass" size={24} color="#007AFF" />
              <Text style={styles.waitingTitle}>Waiting for Host</Text>
              <Text style={styles.waitingSubtitle}>The host will start the game soon.</Text>
            </View>
          </View>
        )}

        {/* Players List */}
        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Players · {players.length} connected</Text>
          <Text style={styles.hintText}>{game?.minPlayers ?? 2}–{game?.maxPlayers ?? 10} players needed</Text>
          
          <View style={styles.playersList}>
            {players.map(player => (
              <View key={player.id} style={styles.playerRow}>
                <View style={styles.playerInfo}>
                  <View style={styles.avatarPlaceholder}>
                    <IconSymbol name="person.fill" size={16} color="white" />
                  </View>
                  <Text style={styles.playerName}>
                    {player.name} {player.isMe ? '(You)' : ''}
                  </Text>
                </View>
                
                {player.isHost && (
                  <View style={styles.hostBadge}>
                    <IconSymbol name="star.fill" size={10} color="#FFD60A" />
                    <Text style={styles.hostBadgeText}>HOST</Text>
                  </View>
                )}
                
                {isHostView && !player.isMe && (
                  <TouchableOpacity style={styles.kickButton}>
                    <Text style={styles.kickText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerButton: { width: 80, height: 44, justifyContent: 'center' },
  headerButtonRight: { width: 80, height: 44, justifyContent: 'center', alignItems: 'flex-end' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: 'white' },
  leaveText: { color: '#FF3B30', fontSize: 15, fontWeight: '500' },
  scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
  
  roomCard: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.3)',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#34C759',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeContainer: {
    alignItems: 'center',
    gap: 8,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(52, 199, 89, 0.9)',
    letterSpacing: 2,
  },
  codeText: {
    fontSize: 44,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textShadowColor: 'rgba(52, 199, 89, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  
  actionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  waitingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  waitingTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  waitingSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
    gap: 8,
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(52, 199, 89, 0.3)',
  },
  startButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
  
  playersSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 12,
  },
  playersList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  hostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  hostBadgeText: {
    color: '#FFD60A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  kickButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  kickText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
  },
});
