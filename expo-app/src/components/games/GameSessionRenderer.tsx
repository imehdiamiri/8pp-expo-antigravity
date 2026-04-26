import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameType } from '@/src/models/AppModels';
import { GameSession } from '@/src/store/useGameStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ReverseSingingSession } from './ReverseSingingSession';
import { GuessTheSecondsSession } from './GuessTheSecondsSession';

interface Props {
  session: GameSession;
  game: GameType;
}

export function GameSessionRenderer({ session, game }: Props) {
  // Switch case to render different specific games based on game.id
  switch (game.id) {
    case 'casual-reverse-singing':
      return <ReverseSingingSession session={session} />;
    case 'casual-guess-the-seconds':
      return <GuessTheSecondsSession session={session} />;
    default:
      return <GenericPlaceholder session={session} game={game} />;
  }
}

function GenericPlaceholder({ session, game }: Props) {
  return (
    <View style={styles.content}>
      <IconSymbol name="gamecontroller.fill" size={64} color="rgba(255,255,255,0.2)" />
      <Text style={styles.gameTitle}>{game.name}</Text>
      <Text style={styles.gameSubtitle}>
        Playing with {session.players.length} players
      </Text>
      
      <View style={styles.playersList}>
        {session.players.map(player => (
          <View key={player.id} style={styles.playerBadge}>
            <Text style={styles.playerName}>{player.username}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.roundText}>
        Round {session.currentRoundIndex + 1} of {session.maxRounds}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  gameTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  playersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  playerBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playerName: {
    color: 'white',
    fontWeight: '600',
  },
  roundText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginTop: 20,
  }
});
