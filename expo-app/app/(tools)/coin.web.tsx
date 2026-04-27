import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function WebCoinScreen() {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });

  const flip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);
    
    setTimeout(() => {
      const isHeads = Math.random() > 0.5;
      const r = isHeads ? 'heads' : 'tails';
      setResult(r);
      setStats(prev => ({ ...prev, [r]: prev[r] + 1 }));
      setIsFlipping(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.coinArea}>
        <TouchableOpacity style={[styles.coin, isFlipping && styles.coinFlipping]} onPress={flip}>
          {result ? (
            <>
              <Text style={styles.coinEmoji}>{result === 'heads' ? '👑' : '🦅'}</Text>
              <Text style={styles.coinText}>{result === 'heads' ? 'HEADS' : 'TAILS'}</Text>
            </>
          ) : (
            <>
              <Text style={styles.coinEmoji}>🪙</Text>
              <Text style={styles.coinText}>TAP TO FLIP</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.resultText}>
          {result ? (result === 'heads' ? '👑 Heads!' : '🦅 Tails!') : 'Tap the coin to flip'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>👑</Text>
          <Text style={styles.statValue}>{stats.heads}</Text>
          <Text style={styles.statLabel}>Heads</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🦅</Text>
          <Text style={styles.statValue}>{stats.tails}</Text>
          <Text style={styles.statLabel}>Tails</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.flipBtn} onPress={flip}>
        <Text style={styles.flipBtnText}>{isFlipping ? '🪙 Flipping...' : '🪙 Flip Coin'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 48, maxWidth: 500, alignSelf: 'center', width: '100%' },
  coinArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 32 },
  coin: {
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,204,0,0.2)', borderWidth: 3, borderColor: '#FFCC00',
    justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  coinFlipping: { opacity: 0.5 },
  coinEmoji: { fontSize: 64 },
  coinText: { color: '#FFCC00', fontSize: 13, fontWeight: '800', letterSpacing: 2, marginTop: 8 },
  resultText: { color: 'white', fontSize: 28, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 24 },
  statCard: {
    flex: 1, alignItems: 'center', padding: 20, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 4,
  },
  statEmoji: { fontSize: 22 },
  statValue: { color: 'white', fontSize: 34, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' },
  flipBtn: { backgroundColor: '#FFCC00', borderRadius: 16, paddingVertical: 18, alignItems: 'center', cursor: 'pointer' },
  flipBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
});
