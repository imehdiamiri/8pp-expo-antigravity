import { Colors } from '@/src/theme/Colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebPress } from '@/src/components/ui/WebPress';

const getPipPositions = (value: number) => {
  const tl = { x: 0.22, y: 0.22 }; const tr = { x: 0.78, y: 0.22 };
  const ml = { x: 0.22, y: 0.5 }; const mc = { x: 0.5, y: 0.5 }; const mr = { x: 0.78, y: 0.5 };
  const bl = { x: 0.22, y: 0.78 }; const br = { x: 0.78, y: 0.78 };
  switch (value) {
    case 1: return [mc]; case 2: return [tl, br]; case 3: return [tl, mc, br];
    case 4: return [tl, tr, bl, br]; case 5: return [tl, tr, mc, bl, br];
    case 6: return [tl, tr, ml, mr, bl, br]; default: return [mc];
  }
};

const Die = ({ value, size }: { value: number; size: number }) => {
  const pips = getPipPositions(value);
  const dotSize = size * 0.18;
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <LinearGradient colors={[Colors.white, '#e0e0e0']} style={[StyleSheet.absoluteFill, { borderRadius: size * 0.18, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }]} />
      {pips.map((p, i) => (
        <View key={i} style={{
          position: 'absolute', width: dotSize, height: dotSize, borderRadius: dotSize / 2,
          backgroundColor: '#111', left: p.x * size - dotSize / 2, top: p.y * size - dotSize / 2,
        }} />
      ))}
    </View>
  );
};

export default function WebDiceScreen() {
  const [diceCount, setDiceCount] = useState(2);
  const [values, setValues] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);

  const roll = () => {
    if (isRolling) return;
    setIsRolling(true);
    const newValues = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
    setTimeout(() => { setValues(newValues); setIsRolling(false); }, 400);
  };

  const total = values.reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      <View style={styles.countRow}>
        <Text style={styles.label}>DICE COUNT</Text>
        <View style={styles.countPicker}>
          {[1, 2, 3, 4].map(n => (
            <WebPress key={n} onPress={() => { setDiceCount(n); setValues(Array(n).fill(1)); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px 0', borderRadius: 12,
                backgroundColor: diceCount === n ? Colors.orange : 'rgba(255,255,255,0.08)',
              }}>
              <Text style={[styles.countText, diceCount === n && { color: '#000' }]}>{n}</Text>
            </WebPress>
          ))}
        </View>
      </View>

      <View style={styles.diceArea}>
        <View style={[styles.diceGrid, diceCount === 4 && { width: 300 }]}>
          {values.map((v, i) => <Die key={i} value={v} size={diceCount === 1 ? 260 : (diceCount === 2 ? 180 : 140)} />)}
        </View>
        <Text style={styles.totalText}>Total: {total}</Text>
      </View>

      <WebPress onPress={roll} disabled={isRolling}
        style={{
          backgroundColor: Colors.orange, borderRadius: 16, padding: '18px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <Text style={styles.rollBtnText}>{isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}</Text>
      </WebPress>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 48, maxWidth: 600, alignSelf: 'center', width: '100%' },
  countRow: { marginBottom: 32 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  countPicker: { flexDirection: 'row', gap: 10 },
  countText: { color: 'white', fontSize: 17, fontWeight: '800' },
  diceArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 },
  diceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  totalText: { color: 'white', fontSize: 28, fontWeight: '800' },
  rollBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
});
