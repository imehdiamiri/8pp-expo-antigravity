import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useGameStore } from '@/src/store/useGameStore';
import { GameSessionRenderer } from '@/src/components/games/GameSessionRenderer';

export default function WebGameSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { activeSession, exitActiveSession } = useGameStore();

  useEffect(() => {
    if (!activeSession) {
      router.replace('/(tabs)');
    }
  }, [activeSession]);

  if (!activeSession) return null;

  const handleExit = () => {
    if (window.confirm('Leave Game? Your current progress will be lost.')) {
      exitActiveSession();
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={s.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      <View style={s.header}>
        <TouchableOpacity style={s.exitBtn} onPress={handleExit}>
          <Text style={s.exitText}>✕ Leave Game</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{activeSession.game.name}</Text>
        <View style={{ width: 100 }} />
      </View>
      <View style={{ flex: 1, zIndex: 1 }}>
        <GameSessionRenderer session={activeSession} game={activeSession.game} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, position: 'relative', height: '100vh', width: '100vw' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)', zIndex: 2,
  },
  exitBtn: { padding: 10, backgroundColor: 'rgba(255,59,48,0.15)', borderRadius: 10, cursor: 'pointer' },
  exitText: { color: '#FF3B30', fontSize: 14, fontWeight: '600' },
  headerTitle: { fontFamily: 'Viral-Black', color: 'white', fontSize: 20 },
});
