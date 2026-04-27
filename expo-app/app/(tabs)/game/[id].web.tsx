import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Link, useRouter } from 'expo-router';
import { Games, GamesDefinitions, GameMode, GameModeDetails } from '@/src/models/AppModels';
import { getGameInstructions } from '@/src/constants/GameLocalization';

export default function WebGameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const gameKey = Object.keys(Games).find(key => Games[key].id === id);
  const game = gameKey ? Games[gameKey] : null;
  const gameDef = GamesDefinitions.find(def => def.id.id === id);

  if (!game || !gameDef) {
    return (
      <View style={styles.webContainer}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
          <Text style={{ color: 'white', fontSize: 22 }}>Game not found</Text>
          <Link href="/" style={{ marginTop: 16, padding: 12, backgroundColor: 'white', borderRadius: 8 }}>
            <Text style={{ color: 'black', fontWeight: '600' }}>Go Back</Text>
          </Link>
        </View>
      </View>
    );
  }

  const instructions = getGameInstructions(game.id);

  const getModeEmoji = (mode: GameMode) => {
    switch (mode) {
      case GameMode.singleDevice: return '📱';
      case GameMode.multiDevice: return '🌐';
      case GameMode.teamMode: return '👥';
      default: return '🎮';
    }
  };

  const getModeLink = (mode: GameMode) => {
    if (mode === GameMode.multiDevice || mode === GameMode.teamMode) {
      return `/game/${id}/lobby/create`;
    }
    return `/game/${id}/setup?mode=singleDevice`;
  };

  return (
    <View style={styles.webContainer}>
      {/* Dark background */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <Link href="/" style={styles.navBackButton}>
          <Text style={styles.navBackText}>← Back to Library</Text>
        </Link>
      </View>

      <ScrollView style={{ flex: 1, zIndex: 2 }} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <View style={styles.iconBox}>
            <Text style={{ fontSize: 48 }}>🎮</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.title}>{game.name}</Text>
            <Text style={styles.description}>{game.shortDescription}</Text>
          </View>
        </View>

        <View style={styles.splitLayout}>
          {/* Left Column: Instructions */}
          <View style={styles.leftCol}>
            <Text style={styles.sectionTitle}>How to Play</Text>
            {instructions.map((inst, idx) => (
              <View key={idx} style={styles.instructionRow}>
                <View style={styles.bulletPoint} />
                <Text style={styles.instructionText}>{inst}</Text>
              </View>
            ))}
          </View>

          {/* Right Column: Modes */}
          <View style={styles.rightCol}>
            <Text style={styles.sectionTitle}>Select a Mode</Text>
            
            {game.supportedModes.map((mode) => {
              const modeDetail = GameModeDetails[mode];
              return (
                <Link 
                  key={mode} 
                  href={getModeLink(mode) as any}
                  style={styles.modeCard}
                >
                  <View style={styles.modeIconBox}>
                    <Text style={{ fontSize: 22 }}>{getModeEmoji(mode)}</Text>
                  </View>
                  <View style={styles.modeTextCol}>
                    <Text style={styles.modeTitle}>{modeDetail.title}</Text>
                    <Text style={styles.modeDesc}>{modeDetail.subtitle}</Text>
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>→</Text>
                </Link>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    height: '100vh',
    width: '100vw',
    position: 'relative',
  },
  topNav: {
    padding: 24,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    zIndex: 2,
  },
  navBackButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    alignSelf: 'flex-start',
    cursor: 'pointer',
    textDecorationLine: 'none',
  },
  navBackText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 64,
    gap: 32,
  },
  iconBox: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroText: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 56,
    fontWeight: '800',
    marginBottom: 16,
  },
  description: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 20,
    lineHeight: 30,
    maxWidth: 600,
  },
  splitLayout: {
    flexDirection: 'row',
    gap: 64,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    flex: 1,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 16,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5AC8FA',
    marginTop: 8,
  },
  instructionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  modeCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    cursor: 'pointer',
    textDecorationLine: 'none',
  },
  modeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  modeTextCol: {
    flex: 1,
  },
  modeTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  modeDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
});
