import { Colors } from '@/src/theme/Colors';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSettingsStore } from '@/src/store/useSettingsStore';

export default function WebOnboardingScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useSettingsStore();

  const handleFinish = () => {
    setHasCompletedOnboarding(true);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Colors.appBackground }} />
      
      <View style={styles.content}>
        <Text style={{ fontSize: 64, marginBottom: 24 }}>🎮</Text>
        <Text style={styles.title}>Welcome to 8PartyPlay</Text>
        <Text style={styles.subtitle}>The ultimate party game suite for groups of any size</Text>

        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Text style={{ fontSize: 34 }}>🧩</Text>
            <Text style={styles.featureTitle}>11+ Games</Text>
            <Text style={styles.featureSub}>Memory Grid, Imposter, Truth or Dare and more</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={{ fontSize: 34 }}>🌐</Text>
            <Text style={styles.featureTitle}>Multiplayer</Text>
            <Text style={styles.featureSub}>Play across phones, tablets, and computers</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={{ fontSize: 34 }}>🛠</Text>
            <Text style={styles.featureTitle}>Party Tools</Text>
            <Text style={styles.featureSub}>Dice, Bottle Spin, Timer, Coin Flip</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={{ fontSize: 34 }}>✨</Text>
            <Text style={styles.featureTitle}>AI Factory</Text>
            <Text style={styles.featureSub}>Generate custom game ideas with AI</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={handleFinish}>
          <Text style={styles.startBtnText}>Get Started →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'relative' },
  content: { alignItems: 'center', zIndex: 2, maxWidth: 800, padding: 48 },
  title: { color: 'white', fontSize: 48, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 20, marginBottom: 48, textAlign: 'center' },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginBottom: 48 },
  featureCard: {
    width: 200, padding: 24, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', gap: 8,
  },
  featureTitle: { color: 'white', fontSize: 17, fontWeight: '700' },
  featureSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center' },
  startBtn: {
    backgroundColor: '#5AC8FA', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 64, cursor: 'pointer',
  },
  startBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
});
