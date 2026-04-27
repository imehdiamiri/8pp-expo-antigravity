import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Games } from '@/src/models/AppModels';
import { useMultiplayerStore } from '@/src/store/useMultiplayerStore';

export default function WebLobbyScreen() {
  const { roomCode } = useLocalSearchParams<{ roomCode: string }>();
  const router = useRouter();
  
  const { currentRoom, isHost, localPlayerId, leaveRoom, startGame, error } = useMultiplayerStore();

  const gameKey = currentRoom ? Object.keys(Games).find(key => Games[key].id === currentRoom.gameId) : null;
  const game = gameKey ? Games[gameKey] : null;
  const players = currentRoom ? Object.values(currentRoom.players) : [];

  useEffect(() => {
    if (currentRoom?.status === 'playing') {
      router.replace(`/game/${currentRoom.gameId}/session` as any);
    }
  }, [currentRoom?.status]);

  const handleCopy = () => {
    if (roomCode) navigator.clipboard?.writeText(roomCode);
  };

  const handleStart = async () => {
    if (isHost) await startGame();
  };

  const handleLeave = async () => {
    await leaveRoom();
    router.replace('/');
  };

  if (!currentRoom) {
    return (
      <View style={styles.container}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 12 }}>Connecting to lobby...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      
      <View style={styles.topNav}>
        <Link href="/" style={styles.backBtn}>
          <Text style={styles.backText}>← Back to Home</Text>
        </Link>
        <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
          <Text style={styles.leaveText}>{isHost ? '✕ Close Room' : '✕ Leave'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={styles.scrollContent}>
        <View style={styles.centerLayout}>
          {/* Room Code Card */}
          <View style={styles.roomCard}>
            <Text style={styles.gameTitle}>{game?.name ?? 'Party Game'}</Text>
            <Text style={styles.codeLabel}>ROOM CODE</Text>
            <Text style={styles.codeText}>{currentRoom.roomCode}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
                <Text style={styles.actionBtnText}>📋 Copy Code</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.twoCol}>
            {/* Left — Host Actions or Waiting */}
            <View style={styles.col}>
              {isHost ? (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>🎯 Host Controls</Text>
                  <Text style={styles.hintText}>Wait for everyone to join, then start the game.</Text>
                  <View
                    style={[styles.startBtn, players.length < (game?.minPlayers ?? 2) && { opacity: 0.4 }]}
                    onPress={players.length >= (game?.minPlayers ?? 2) ? handleStart : undefined}
                  >
                    <Text style={styles.startBtnText}>▶ Start Game</Text>
                  </View>
                  {players.length < (game?.minPlayers ?? 2) && (
                    <Text style={styles.errorText}>Need at least {game?.minPlayers ?? 2} players</Text>
                  )}
                </View>
              ) : (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>⏳ Waiting</Text>
                  <Text style={styles.waitingText}>The host will start the game soon...</Text>
                </View>
              )}
            </View>

            {/* Right — Players List */}
            <View style={styles.col}>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>👥 Players · {players.length}</Text>
                <Text style={styles.hintText}>{game?.minPlayers ?? 2}–{game?.maxPlayers ?? 10} players needed</Text>
                {players.map(player => (
                  <View key={player.id} style={styles.playerRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{player.name?.[0]?.toUpperCase() || '?'}</Text>
                    </View>
                    <Text style={styles.playerName}>
                      {player.name} {player.id === localPlayerId ? '(You)' : ''}
                    </Text>
                    {player.isHost && (
                      <View style={styles.hostBadge}>
                        <Text style={styles.hostBadgeText}>⭐ HOST</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative', height: '100vh', width: '100vw' },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, zIndex: 2 },
  backBtn: { padding: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, cursor: 'pointer', textDecorationLine: 'none' },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  leaveBtn: { padding: 12, backgroundColor: 'rgba(255,59,48,0.1)', borderRadius: 8, cursor: 'pointer' },
  leaveText: { color: '#FF3B30', fontSize: 13, fontWeight: '600' },
  scrollContent: { padding: 48 },
  centerLayout: { maxWidth: 900, alignSelf: 'center', width: '100%' },
  roomCard: {
    alignItems: 'center', padding: 40, borderRadius: 24,
    backgroundColor: 'rgba(52,199,89,0.08)', borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.25)', marginBottom: 32, gap: 8,
  },
  gameTitle: { color: '#34C759', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  codeLabel: { color: 'rgba(52,199,89,0.8)', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  codeText: { color: 'white', fontSize: 56, fontWeight: '900', letterSpacing: 12, fontFamily: 'monospace' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  actionBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, cursor: 'pointer' },
  actionBtnText: { color: 'white', fontSize: 13, fontWeight: '600' },
  twoCol: { flexDirection: 'row', gap: 32 },
  col: { flex: 1 },
  card: {
    padding: 24, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionTitle: { color: 'white', fontSize: 17, fontWeight: '700', marginBottom: 8 },
  hintText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 16 },
  startBtn: {
    backgroundColor: '#34C759', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', cursor: 'pointer',
  },
  startBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
  waitingText: { color: 'rgba(255,255,255,0.6)', fontSize: 16, textAlign: 'center', paddingVertical: 24 },
  errorText: { color: '#FF3B30', fontSize: 13, textAlign: 'center', marginTop: 12 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(90,200,250,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#5AC8FA', fontWeight: '800', fontSize: 13 },
  playerName: { color: 'white', fontSize: 16, fontWeight: '600', flex: 1 },
  hostBadge: {
    backgroundColor: 'rgba(255,214,10,0.15)', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 10,
  },
  hostBadgeText: { color: '#FFD60A', fontSize: 11, fontWeight: '800' },
});
