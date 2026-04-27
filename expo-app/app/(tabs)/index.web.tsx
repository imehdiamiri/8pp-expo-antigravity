import React from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { GamesDefinitions, getPlayerCountText } from '@/src/models/AppModels';
import { LinearGradient } from 'expo-linear-gradient';

// Simple web-only game card using <a> tag via Link
function WebGameCard({ game }: { game: any }) {
  const getGradientColors = (accentName: string): [string, string, string] => {
    switch (accentName) {
      case 'pink': return ['rgba(255, 105, 180, 0.95)', 'rgba(255, 59, 48, 0.65)', 'rgba(175, 82, 222, 0.5)'];
      case 'cyan': return ['rgba(50, 173, 230, 0.95)', 'rgba(0, 199, 190, 0.7)', 'rgba(0, 122, 255, 0.5)'];
      case 'teal': return ['rgba(48, 176, 199, 0.95)', 'rgba(52, 199, 89, 0.7)', 'rgba(0, 199, 190, 0.45)'];
      case 'orange': return ['rgba(255, 149, 0, 0.96)', 'rgba(255, 59, 48, 0.72)', 'rgba(255, 204, 0, 0.4)'];
      case 'red': return ['rgba(255, 59, 48, 0.95)', 'rgba(255, 105, 180, 0.7)', 'rgba(255, 149, 0, 0.45)'];
      case 'yellow': return ['rgba(255, 204, 0, 0.96)', 'rgba(255, 149, 0, 0.72)', 'rgba(255, 59, 48, 0.4)'];
      case 'purple': return ['rgba(175, 82, 222, 0.95)', 'rgba(88, 86, 214, 0.8)', 'rgba(255, 105, 180, 0.45)'];
      default: return ['rgba(0, 122, 255, 0.95)', 'rgba(88, 86, 214, 0.75)', 'rgba(175, 82, 222, 0.45)'];
    }
  };

  const getEmoji = (sym: string) => {
    switch (sym) {
      case 'music.note.list': return '🎤';
      case 'timer': return '⏱';
      case 'person.fill.questionmark': return '🕵️';
      case 'square.grid.3x3.fill': return '🧩';
      case 'dice.fill': return '🎲';
      case 'point.topleft.down.to.point.bottomright.curvepath.fill': return '🧠';
      case 'hand.point.up.left.fill': return '👆';
      case 'pencil.and.outline': return '✏️';
      case 'arrow.triangle.2.circlepath': return '🔄';
      case 'eye.fill': return '👁';
      case 'paintbrush.fill': return '🎨';
      case 'bubble.left.and.bubble.right.fill': return '💬';
      default: return '🎮';
    }
  };

  return (
    <Link href={`/game/${game.id.id}` as any} style={cardStyles.link}>
      <View style={cardStyles.container}>
        <LinearGradient
          colors={getGradientColors(game.accentName)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={cardStyles.content}>
          <Text style={cardStyles.title}>{game.id.name}</Text>
          <View style={cardStyles.iconBox}>
            <Text style={{ fontSize: 28 }}>{getEmoji(game.id.symbolName)}</Text>
          </View>
          <Text style={cardStyles.playerCount}>
            {getPlayerCountText(game.id.minPlayers, game.id.maxPlayers)}
          </Text>
        </View>
      </View>
    </Link>
  );
}

const cardStyles = StyleSheet.create({
  link: {
    textDecorationLine: 'none',
    display: 'block',
    width: 260,
    cursor: 'pointer',
  },
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerCount: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
});

export default function WebGamesScreen() {
  const filteredGames = GamesDefinitions;

  return (
    <View style={styles.webContainer}>
      {/* Dark background */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />

      {/* Desktop Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.logoText}>8PartyPlay</Text>
        <Text style={styles.sidebarSubtitle}>Web Edition</Text>
        
        <View style={styles.navGroup}>
          <View style={styles.navItemActive}>
            <Text style={styles.navItemTextActive}>🎮  Games Library</Text>
          </View>

          <Link href="/lobby/join" style={styles.navItemLink}>
            <Text style={styles.navItemText}>🔗  Join Lobby</Text>
          </Link>

          <Link href="/profile" style={styles.navItemLink}>
            <Text style={styles.navItemText}>👤  Profile & Shop</Text>
          </Link>
        </View>
        
        <View style={{ flex: 1 }} />
        
        <Text style={styles.sidebarFooter}>🟢 Connected to Firebase</Text>
      </View>

      {/* Main Desktop Content Area */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.mainContent}>
        <Text style={styles.pageTitle}>Discover Games</Text>
        
        <View style={styles.webGrid}>
          {filteredGames.map((game) => (
            <WebGameCard key={game.id.id} game={game} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100vh',
    width: '100vw',
    position: 'relative',
  },
  sidebar: {
    width: 260,
    backgroundColor: 'rgba(15,15,25,0.95)',
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 32,
    zIndex: 2,
  },
  logoText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
  },
  sidebarSubtitle: {
    color: '#5AC8FA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 48,
  },
  navGroup: {
    gap: 12,
  },
  navItemActive: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(90,200,250,0.15)',
    borderLeftWidth: 3,
    borderColor: '#5AC8FA',
  },
  navItemLink: {
    display: 'flex',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    cursor: 'pointer',
    textDecorationLine: 'none',
  },
  navItemText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '600',
  },
  navItemTextActive: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  sidebarFooter: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
  },
  mainContent: {
    flexGrow: 1,
    padding: 48,
  },
  pageTitle: {
    color: 'white',
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 48,
  },
  webGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 28,
  },
});
