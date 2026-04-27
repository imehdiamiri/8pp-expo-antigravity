import { Colors } from '@/src/theme/Colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function WebAuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { isBusy, errorMessage, signIn, signUp, signInWithGoogle, signInAnonymously } = useAuthStore();

  const handleSubmit = () => {
    const u = username.trim();
    const p = password.trim();
    if (!u || !p || isBusy) return;
    if (isLogin) signIn(u, p).catch(() => {});
    else signUp(u, p).catch(() => {});
  };

  const handleGuest = () => {
    signInAnonymously()
      .then(() => router.replace('/'))
      .catch(() => {});
  };

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Colors.appBackground }} />
      
      <View style={styles.card}>
        <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🎮</Text>
        <Text style={styles.title}>8PartyPlay</Text>
        <Text style={styles.subtitle}>Sign in to claim 100 ★, friends, and AI cards.</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="rgba(255,255,255,0.3)"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.3)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
        />

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View
          style={[styles.primaryBtn, (!username || !password || isBusy) && { opacity: 0.5 }]}
          onPress={(!username || !password || isBusy) ? undefined : handleSubmit}
        >
          <Text style={styles.primaryBtnText}>{isLogin ? 'Login' : 'Create Account'}</Text>
        </View>

        <TouchableOpacity style={styles.googleBtn} onPress={() => signInWithGoogle().catch(() => {})}>
          <Text style={styles.socialBtnText}>🌐 Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleRow} onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.toggleLeft}>{isLogin ? "Don't have an account?" : "Already have an account?"}</Text>
          <Text style={styles.toggleRight}>{isLogin ? 'Sign Up' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
        <Text style={styles.hintText}>You can log in anytime later from your profile.</Text>

        {isBusy && (
          <View style={styles.busyOverlay}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    height: '100vh', width: '100vw', position: 'relative',
  },
  card: {
    width: 420, backgroundColor: 'rgba(20,20,30,0.95)', borderRadius: 24,
    padding: 48, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', zIndex: 2,
  },
  title: { color: 'white', fontSize: 34, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 15, textAlign: 'center', marginBottom: 28 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14, color: 'white', fontSize: 16, padding: 14, marginBottom: 12, outlineStyle: 'none',
  },
  errorText: { color: Colors.red, fontSize: 13, textAlign: 'center', marginBottom: 8 },
  primaryBtn: {
    backgroundColor: '#007AFF', borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', marginBottom: 10, cursor: 'pointer',
  },
  primaryBtnText: { color: 'white', fontSize: 17, fontWeight: '600' },
  googleBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14, paddingVertical: 12, alignItems: 'center', marginBottom: 16, cursor: 'pointer',
  },
  socialBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', gap: 4, cursor: 'pointer', marginBottom: 20 },
  toggleLeft: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  toggleRight: { color: '#5AC8FA', fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 20 },
  guestBtn: { alignItems: 'center', cursor: 'pointer', marginBottom: 8 },
  guestText: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: '500' },
  hintText: { color: 'rgba(255,255,255,0.3)', fontSize: 11, textAlign: 'center' },
  busyOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
    borderRadius: 24, zIndex: 10,
  },
});
