import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function WebProfileScreen() {
  const router = useRouter();
  const { currentUser, signOut } = useAuthStore();

  const handleSignOut = () => {
    signOut().then(() => router.replace('/'));
  };

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      
      <View style={styles.topNav}>
        <Link href="/" style={styles.backBtn}>
          <Text style={styles.backText}>← Back to Home</Text>
        </Link>
      </View>

      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={{ fontSize: 40 }}>👤</Text>
          </View>
          <Text style={styles.username}>{currentUser?.displayName || currentUser?.email || 'Guest Player'}</Text>
          <Text style={styles.email}>{currentUser?.email || 'Not signed in'}</Text>
          {currentUser?.isAnonymous && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>Guest Account</Text>
            </View>
          )}
        </View>

        <View style={styles.twoCol}>
          {/* Left Column */}
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <Link href="/paywall" style={styles.menuItem}>
              <Text style={{ fontSize: 20 }}>⭐</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>Premium & Stars</Text>
                <Text style={styles.menuSub}>Manage subscriptions and purchases</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.3)' }}>→</Text>
            </Link>

            <View style={styles.menuItem}>
              <Text style={{ fontSize: 20 }}>🎨</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>Appearance</Text>
                <Text style={styles.menuSub}>Theme and display preferences</Text>
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.menuItem}>
              <Text style={{ fontSize: 20 }}>🔔</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>Notifications</Text>
                <Text style={styles.menuSub}>Push notification preferences</Text>
              </View>
            </View>

            <View style={styles.menuItem}>
              <Text style={{ fontSize: 20 }}>🔊</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>Sound & Haptics</Text>
                <Text style={styles.menuSub}>Audio and vibration settings</Text>
              </View>
            </View>

            <View style={styles.menuItem}>
              <Text style={{ fontSize: 20 }}>📜</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>Privacy Policy</Text>
                <Text style={styles.menuSub}>Review our privacy terms</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        {currentUser && (
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative', height: '100vh', width: '100vw' },
  topNav: { padding: 24, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)', zIndex: 2 },
  backBtn: { padding: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, alignSelf: 'flex-start', cursor: 'pointer', textDecorationLine: 'none' },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  scrollContent: { padding: 48, maxWidth: 900, alignSelf: 'center', width: '100%' },
  profileCard: {
    alignItems: 'center', padding: 40, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', marginBottom: 48, gap: 8,
  },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(90,200,250,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  username: { color: 'white', fontSize: 24, fontWeight: '800' },
  email: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  guestBadge: { backgroundColor: 'rgba(255,149,0,0.15)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 },
  guestBadgeText: { color: '#FF9500', fontSize: 12, fontWeight: '700' },
  twoCol: { flexDirection: 'row', gap: 48, marginBottom: 48 },
  col: { flex: 1 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  menuItem: {
    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16,
    padding: 18, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 10,
    textDecorationLine: 'none', cursor: 'pointer',
  },
  menuTitle: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  menuSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  signOutBtn: {
    alignSelf: 'center', backgroundColor: 'rgba(255,59,48,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,59,48,0.3)', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 48, cursor: 'pointer',
  },
  signOutText: { color: '#FF3B30', fontSize: 16, fontWeight: '600' },
});
