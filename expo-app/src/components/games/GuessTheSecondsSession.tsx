import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { GameSession } from '@/src/store/useGameStore';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Props {
  session: GameSession;
}

interface TurnResult {
  playerName: string;
  round: number;
  targetTime: number;
  actualTime: number;
  difference: number;
}

export function GuessTheSecondsSession({ session }: Props) {
  const players = session.players;
  const rounds = session.rounds || [];
  const roundsPerPlayer = Math.max(Math.floor(rounds.length / (players.length || 1)), 1);
  const totalTurns = rounds.length;

  const [selectedTime, setSelectedTime] = useState(15.0);
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [results, setResults] = useState<TurnResult[]>([]);
  const [roundTargets, setRoundTargets] = useState<Record<number, number>>({});

  const isFinished = activeTurnIndex >= totalTurns;
  const currentRoundNumber = players.length && !isFinished ? Math.floor(activeTurnIndex / players.length) + 1 : roundsPerPlayer;
  const currentPlayer = !isFinished && rounds[activeTurnIndex] 
    ? players.find(p => p.username === rounds[activeTurnIndex].activePlayerName) 
    : null;
  const isFirstPlayerOfCurrentRound = !players.length || !isFinished ? false : activeTurnIndex % players.length === 0;
  const currentRoundTargetLocked = roundTargets[currentRoundNumber] !== undefined;
  const displayedTargetTime = roundTargets[currentRoundNumber] ?? selectedTime;
  
  const canEditTargetTime = !isRunning && !isFinished && isFirstPlayerOfCurrentRound && !currentRoundTargetLocked;
  const canStart = !isRunning && !isFinished;
  const canStop = isRunning && !isFinished;

  // Render timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && startedAt) {
      interval = setInterval(() => {
        setElapsedTime((Date.now() - startedAt) / 1000);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning, startedAt]);

  const adjustTargetTime = (delta: number) => {
    if (!canEditTargetTime) return;
    setSelectedTime(prev => Math.min(Math.max(Math.round((prev + delta) * 100) / 100, 1), 60));
  };

  const startTurn = () => {
    if (!canStart) return;
    
    if (roundTargets[currentRoundNumber] === undefined) {
      setRoundTargets(prev => ({
        ...prev,
        [currentRoundNumber]: Math.round(selectedTime * 100) / 100
      }));
    }

    setStartedAt(Date.now());
    setElapsedTime(0);
    setIsRunning(true);
  };

  const stopTurn = () => {
    if (!canStop || !startedAt || !currentPlayer) return;

    const actualTime = Math.round(((Date.now() - startedAt) / 1000) * 100) / 100;
    const targetTime = roundTargets[currentRoundNumber] ?? Math.round(selectedTime * 100) / 100;
    const difference = Math.round(Math.abs(targetTime - actualTime) * 100) / 100;

    const turn: TurnResult = {
      playerName: currentPlayer.username,
      round: currentRoundNumber,
      targetTime,
      actualTime,
      difference
    };

    setResults(prev => [...prev, turn]);
    setElapsedTime(actualTime);
    setIsRunning(false);
    setStartedAt(null);
    setActiveTurnIndex(prev => prev + 1);
  };

  const latestTurn = results[results.length - 1];

  const getAccuracyBand = (diff: number) => {
    if (diff === 0) return { title: 'Perfect!', color: '#34C759', icon: 'target' as const };
    if (diff < 1) return { title: 'Close', color: '#0A84FF', icon: 'scope' as const };
    if (diff <= 2) return { title: 'Okay', color: '#FFD60A', icon: 'scope' as const };
    return { title: 'Far', color: '#FF453A', icon: 'scope' as const };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.roundText}>
            {isFinished ? 'All rounds complete' : `Round ${currentRoundNumber} / ${roundsPerPlayer}`}
          </Text>
          {currentPlayer && !isFinished && (
            <View style={styles.nowPlayingBadge}>
              <Text style={styles.nowPlayingText}>Now: {currentPlayer.username}</Text>
            </View>
          )}
          <View style={{flex: 1}}/>
          <Text style={[styles.statusText, { color: isRunning ? '#0A84FF' : isFinished ? '#34C759' : 'rgba(255,255,255,0.5)' }]}>
            {isFinished ? 'Finished' : isRunning ? 'Running' : 'Ready'}
          </Text>
        </View>
      </View>

      {/* Last Result Banner */}
      {latestTurn && (
        <View style={styles.card}>
          <View style={styles.resultHeader}>
            <IconSymbol name="flag.checkered" size={16} color={getAccuracyBand(latestTurn.difference).color} />
            <Text style={styles.resultTitle}>{latestTurn.playerName} • Round {latestTurn.round}</Text>
            <View style={{flex: 1}}/>
            <View style={[styles.badge, { backgroundColor: getAccuracyBand(latestTurn.difference).color + '33' }]}>
              <Text style={[styles.badgeText, { color: getAccuracyBand(latestTurn.difference).color }]}>
                {getAccuracyBand(latestTurn.difference).title}
              </Text>
            </View>
          </View>
          <View style={styles.resultMetrics}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Target</Text>
              <Text style={[styles.metricValue, { color: 'rgba(255,255,255,0.7)' }]}>{latestTurn.targetTime.toFixed(2)}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Stopped</Text>
              <Text style={styles.metricValue}>{latestTurn.actualTime.toFixed(2)}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Diff</Text>
              <Text style={[styles.metricValue, { color: getAccuracyBand(latestTurn.difference).color }]}>
                {latestTurn.difference.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Control Card */}
      {!isFinished && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Target Time</Text>
          <Text style={styles.sectionSubtitle}>
            {currentRoundTargetLocked ? "This round target is locked for all players." : "Choose the target for this round."}
          </Text>

          <View style={styles.selectorArea}>
            <Pressable 
              style={[styles.stepperButton, !canEditTargetTime && styles.stepperDisabled]} 
              onPress={() => adjustTargetTime(-1)}
              disabled={!canEditTargetTime}
            >
              <IconSymbol name="minus" size={24} color={canEditTargetTime ? "white" : "rgba(255,255,255,0.3)"} />
            </Pressable>

            <View style={styles.timeDisplayBox}>
              <Text style={[styles.timeDisplay, isRunning && styles.timeDisplayRunning]}>
                {isRunning ? '•••••' : displayedTargetTime.toFixed(2)}
              </Text>
            </View>

            <Pressable 
              style={[styles.stepperButton, !canEditTargetTime && styles.stepperDisabled]} 
              onPress={() => adjustTargetTime(1)}
              disabled={!canEditTargetTime}
            >
              <IconSymbol name="plus" size={24} color={canEditTargetTime ? "white" : "rgba(255,255,255,0.3)"} />
            </Pressable>
          </View>

          <View style={styles.controlButtons}>
            {!isRunning && (
              <Pressable style={[styles.primaryButton, { backgroundColor: '#0A84FF' }]} onPress={startTurn}>
                <IconSymbol name="play.fill" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Start</Text>
              </Pressable>
            )}
            {isRunning && (
              <Pressable style={[styles.primaryButton, { backgroundColor: '#FF453A' }]} onPress={stopTurn}>
                <IconSymbol name="stop.fill" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Stop</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Ranking Card */}
      {isFinished && (
        <View style={styles.card}>
           <Text style={styles.sectionTitle}>Final Results</Text>
           <Text style={styles.sectionSubtitle}>Lowest total difference wins.</Text>

           <View style={styles.rankingList}>
             {players.map(p => {
               const pResults = results.filter(r => r.playerName === p.username);
               const total = pResults.reduce((sum, r) => sum + r.difference, 0);
               const avg = pResults.length > 0 ? total / pResults.length : 0;
               return { player: p.username, total, avg };
             })
             .sort((a, b) => a.total - b.total)
             .map((rank, idx) => (
               <View key={rank.player} style={[styles.rankRow, idx === 0 && styles.winnerRow]}>
                 <View style={[styles.rankBadge, idx === 0 && styles.winnerBadge]}>
                   <Text style={[styles.rankBadgeText, idx === 0 && styles.winnerBadgeText]}>#{idx + 1}</Text>
                 </View>
                 <View style={{flex: 1}}>
                   <Text style={styles.rankName}>{rank.player}</Text>
                   <Text style={styles.rankAvg}>Avg {rank.avg.toFixed(2)}</Text>
                 </View>
                 <Text style={[styles.rankTotal, idx === 0 && styles.winnerTotal]}>
                   {rank.total.toFixed(2)}
                 </Text>
               </View>
             ))}
           </View>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roundText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  nowPlayingBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nowPlayingText: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resultTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultMetrics: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  selectorArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  stepperButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(10, 132, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDisabled: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  timeDisplayBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  timeDisplay: {
    color: 'white',
    fontSize: 48,
    fontWeight: '900',
  },
  timeDisplayRunning: {
    color: 'rgba(255,255,255,0.5)',
  },
  controlButtons: {
    gap: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    borderRadius: 100,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rankingList: {
    gap: 10,
    marginTop: 10,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  winnerRow: {
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    borderColor: 'rgba(52, 199, 89, 0.2)',
  },
  rankBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerBadge: {
    backgroundColor: 'rgba(255, 214, 10, 0.22)',
  },
  rankBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  winnerBadgeText: {
    color: '#FFD60A',
  },
  rankName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rankAvg: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  rankTotal: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  winnerTotal: {
    color: '#34C759',
  }
});
