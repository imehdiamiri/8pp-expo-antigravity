import { Colors } from '@/src/theme/Colors';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useMultiplayerStore } from '@/src/store/useMultiplayerStore';

export default function WebJoinLobbyScreen() {
  const router = useRouter();
  
  const { joinRoom, isBusy } = useMultiplayerStore();
  const [roomCode, setRoomCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const isJoinDisabled = roomCode.trim().length < 6 || displayName.trim().length < 2 || isBusy;

  const handleJoin = async () => {
    if (isJoinDisabled) return;
    
    try {
      await joinRoom(roomCode.trim(), displayName.trim());
      router.push({
        pathname: `/lobby/[roomCode]`,
        params: { roomCode: roomCode.trim() }
      });
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <View style={styles.webContainer}>
      {/* Dark background */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Colors.appBackground }} />

      <Link href="/" style={styles.backButton}>
        <Text style={styles.backText}>← Back to Home</Text>
      </Link>
      
      <View style={styles.centerCard}>
        <Text style={styles.title}>Join Multiplayer Lobby</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code provided by the host.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Room Code</Text>
          <TextInput
            style={styles.codeInput}
            placeholder="123456"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={roomCode}
            onChangeText={(text) => setRoomCode(text.replace(/[^0-9]/g, '').substring(0, 6))}
            maxLength={6}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Display Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            onSubmitEditing={handleJoin}
          />
        </View>

        {/* Use a native <a>-like approach for the button */}
        <View 
          style={[styles.joinBtn, isJoinDisabled && styles.joinBtnDisabled]}
          onPress={isJoinDisabled ? undefined : handleJoin}
        >
          <Text style={styles.joinBtnText}>{isBusy ? 'Connecting...' : 'Join Game'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 40,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    zIndex: 2,
    cursor: 'pointer',
    textDecorationLine: 'none',
  },
  backText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  centerCard: {
    width: 480,
    backgroundColor: 'rgba(20,20,30,0.95)',
    borderRadius: 24,
    padding: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 2,
  },
  title: {
    color: 'white',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  codeInput: {
    backgroundColor: 'rgba(90, 200, 250, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(90, 200, 250, 0.4)',
    borderRadius: 16,
    color: '#5AC8FA',
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    paddingVertical: 24,
    letterSpacing: 16,
    fontFamily: 'monospace',
    outlineStyle: 'none',
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    color: 'white',
    fontSize: 17,
    padding: 16,
    outlineStyle: 'none',
  },
  joinBtn: {
    backgroundColor: '#5AC8FA',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
    cursor: 'pointer',
  },
  joinBtnDisabled: {
    backgroundColor: 'rgba(90, 200, 250, 0.3)',
    cursor: 'not-allowed',
  },
  joinBtnText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
  },
});
