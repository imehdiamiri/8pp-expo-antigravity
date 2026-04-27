import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

export default function WebBottleScreen() {
  const [names, setNames] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const addName = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setNames(prev => [...prev, trimmed]);
    setDraft('');
  };

  const removeName = (index: number) => {
    setNames(prev => prev.filter((_, i) => i !== index));
    setSelectedIndex(prev => prev === index ? null : prev);
  };

  const spin = () => {
    if (isSpinning || names.length < 2) return;
    setIsSpinning(true);
    setSelectedIndex(null);

    const target = Math.floor(Math.random() * names.length);
    const spins = 5 + Math.random() * 5;
    const targetAngle = spins * 360 + (target / names.length) * 360;
    setRotation(targetAngle);

    setTimeout(() => {
      setSelectedIndex(target);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} placeholder="Add a player..." placeholderTextColor="rgba(255,255,255,0.3)"
            value={draft} onChangeText={setDraft} onSubmitEditing={addName} />
          <TouchableOpacity style={styles.addBtn} onPress={addName}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {names.map((name, i) => (
            <View key={i} style={[styles.chip, selectedIndex === i && styles.chipSelected]}>
              <Text style={styles.chipText}>{name}</Text>
              <TouchableOpacity onPress={() => removeName(i)} style={styles.chipRemove}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.bottleArea}>
        <View style={styles.circle}>
          {names.map((name, i) => {
            const angle = (i / names.length) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 140;
            return (
              <View key={i} style={{
                position: 'absolute', left: 180 + Math.cos(rad) * radius - 30,
                top: 180 + Math.sin(rad) * radius - 15,
              }}>
                <Text style={[styles.circleName, selectedIndex === i && { color: '#FF2D55', fontWeight: '900', fontSize: 16 }]}>
                  {name}
                </Text>
              </View>
            );
          })}

          <View style={[styles.bottleWrapper, { transform: [{ rotate: `${rotation}deg` }] }]}>
            <Text style={styles.bottleEmoji}>🍾</Text>
          </View>
        </View>

        {selectedIndex !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Selected</Text>
            <Text style={styles.resultName}>{names[selectedIndex]}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={[styles.spinBtn, (isSpinning || names.length < 2) && { opacity: 0.5 }]} onPress={spin}>
        <Text style={styles.spinBtnText}>{isSpinning ? '🍾 Spinning...' : '🍾 Spin the Bottle'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, maxWidth: 600, alignSelf: 'center', width: '100%' },
  topSection: { marginBottom: 24 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 16, padding: 14, outlineStyle: 'none' },
  addBtn: { backgroundColor: '#FF2D55', borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center', cursor: 'pointer' },
  addBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  chipRow: { gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipSelected: { backgroundColor: 'rgba(255,45,85,0.3)', borderWidth: 1, borderColor: '#FF2D55' },
  chipText: { color: 'white', fontSize: 13, fontWeight: '600' },
  chipRemove: { cursor: 'pointer' },
  bottleArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 },
  circle: { width: 360, height: 360, borderRadius: 180, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  circleName: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', width: 60, textAlign: 'center' },
  bottleWrapper: { transition: 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' },
  bottleEmoji: { fontSize: 48 },
  resultCard: { alignItems: 'center', padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,45,85,0.15)', borderWidth: 1, borderColor: 'rgba(255,45,85,0.3)', gap: 4 },
  resultLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' },
  resultName: { color: '#FF2D55', fontSize: 28, fontWeight: '800' },
  spinBtn: { backgroundColor: '#FF2D55', borderRadius: 16, paddingVertical: 18, alignItems: 'center', cursor: 'pointer' },
  spinBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
