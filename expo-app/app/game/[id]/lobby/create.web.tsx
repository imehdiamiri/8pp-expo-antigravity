import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Games } from '@/src/models/AppModels';
import { useMultiplayerStore } from '@/src/store/useMultiplayerStore';

export default function WebCreateLobbyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const gameKey = Object.keys(Games).find(key => Games[key].id === id);
  const game = gameKey ? Games[gameKey] : null;
  const { createRoom, isBusy } = useMultiplayerStore();
  const [displayName, setDisplayName] = useState('');
  
  const isDisabled = displayName.trim().length < 2 || isBusy;

  const handleCreate = async () => {
    if (isDisabled || !game) return;
    try {
      const roomCode = await createRoom(game.id, displayName.trim());
      router.push({ pathname: '/lobby/[roomCode]', params: { roomCode } });
    } catch (err) {}
  };

  if (!game) return (
    <View style={s.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>Game not found</Text>
        <Link href="/" style={{ color: '#5AC8FA', marginTop: 16, textDecorationLine: 'none' }}>← Back to Home</Link>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      
      <View style={s.topNav}>
        <Link href={`/game/${id}` as any} style={s.backLink}><Text style={s.backText}>← Back</Text></Link>
      </View>

      <View style={s.content}>
        <View style={s.card}>
          <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🎉</Text>
          <Text style={s.title}>Create a Party Room</Text>
          <Text style={s.subtitle}>for {game.name}</Text>
          <Text style={s.hint}>No login needed. Share the code with friends.</Text>

          <Text style={s.label}>Your Display Name</Text>
          <TextInput style={s.input} placeholder="Enter your name..." placeholderTextColor="rgba(255,255,255,0.3)"
            value={displayName} onChangeText={setDisplayName} onSubmitEditing={handleCreate} />

          <TouchableOpacity style={[s.createBtn, isDisabled && { opacity: 0.4 }]} onPress={isDisabled ? undefined : handleCreate}>
            <Text style={s.createBtnText}>{isBusy ? '⏳ Creating...' : '🚀 Create Room'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, position: 'relative', height: '100vh', width: '100vw' },
  topNav: { padding: 24, zIndex: 2 },
  backLink: { padding: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, alignSelf: 'flex-start', textDecorationLine: 'none' },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  card: {
    width: 440, padding: 48, borderRadius: 24, backgroundColor: 'rgba(20,20,30,0.95)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  title: { color: 'white', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  subtitle: { color: '#34C759', fontSize: 17, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  hint: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', marginBottom: 32 },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, color: 'white', fontSize: 17, padding: 16, textAlign: 'center', marginBottom: 20, outlineStyle: 'none' },
  createBtn: { backgroundColor: '#34C759', borderRadius: 14, paddingVertical: 16, alignItems: 'center', cursor: 'pointer' },
  createBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
