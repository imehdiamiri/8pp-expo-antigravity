import { Colors } from '@/src/theme/Colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const TEAM_COLORS = [Colors.orange, Colors.cyan, '#FF2D55', Colors.green, '#AF52DE', Colors.yellow];

export default function WebTeamsScreen() {
  const [names, setNames] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  const addName = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (names.some(n => n.toLowerCase() === trimmed.toLowerCase())) return;
    setNames(prev => [...prev, trimmed]);
    setDraft('');
  };

  const removeName = (index: number) => {
    setNames(prev => prev.filter((_, i) => i !== index));
  };

  const split = () => {
    if (names.length < teamCount) return;
    setIsShuffling(true);
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const buckets: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, i) => buckets[i % teamCount].push(name));
    setTimeout(() => { setTeams(buckets); setIsShuffling(false); }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Add a player name..." placeholderTextColor="rgba(255,255,255,0.3)"
          value={draft} onChangeText={setDraft} onSubmitEditing={addName} />
        <TouchableOpacity style={[styles.addBtn, !draft.trim() && { opacity: 0.5 }]} onPress={addName}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {names.length > 0 && (
        <View style={styles.chipsRow}>
          {names.map((name, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{name}</Text>
              <TouchableOpacity onPress={() => removeName(i)} style={{ cursor: 'pointer' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '800' }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.teamCountSection}>
        <Text style={styles.label}>TEAMS</Text>
        <View style={styles.countRow}>
          {[2, 3, 4, 5, 6].map(n => (
            <TouchableOpacity key={n} onPress={() => setTeamCount(n)}
              style={[styles.countBtn, teamCount === n && styles.countBtnActive]}>
              <Text style={[styles.countText, teamCount === n && { color: '#000' }]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.teamsArea}>
        {teams.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>👥</Text>
            <Text style={styles.emptyTitle}>Add names then tap Split</Text>
            <Text style={styles.emptySub}>Players will be randomly distributed into teams.</Text>
          </View>
        ) : (
          <View style={styles.teamsGrid}>
            {teams.map((members, idx) => {
              const color = TEAM_COLORS[idx % TEAM_COLORS.length];
              return (
                <View key={idx} style={[styles.teamCard, { backgroundColor: color + '15', borderColor: color + '40' }]}>
                  <Text style={[styles.teamName, { color }]}>Team {idx + 1}</Text>
                  <Text style={styles.teamSize}>{members.length} members</Text>
                  {members.map((name, i) => (
                    <View key={i} style={styles.memberRow}>
                      <View style={[styles.dot, { backgroundColor: color }]} />
                      <Text style={styles.memberName}>{name}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={[styles.splitBtn, (names.length < teamCount || isShuffling) && { opacity: 0.5 }]} onPress={split}>
        <Text style={styles.splitBtnText}>{teams.length === 0 ? '🔀 Split into Teams' : '🔀 Shuffle Again'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, maxWidth: 700, alignSelf: 'center', width: '100%' },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 16, padding: 14, outlineStyle: 'none' },
  addBtn: { backgroundColor: Colors.green, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center', cursor: 'pointer' },
  addBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipText: { color: 'white', fontSize: 13, fontWeight: '600' },
  teamCountSection: { marginBottom: 20 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10 },
  countRow: { flexDirection: 'row', gap: 8 },
  countBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', cursor: 'pointer' },
  countBtnActive: { backgroundColor: 'white' },
  countText: { color: 'white', fontSize: 16, fontWeight: '800' },
  teamsArea: { flexGrow: 1 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 17, fontWeight: '600' },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  teamsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  teamCard: { width: '48%', padding: 20, borderRadius: 18, borderWidth: 1, gap: 8 },
  teamName: { fontSize: 17, fontWeight: '800' },
  teamSize: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  memberName: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },
  splitBtn: { backgroundColor: Colors.green, borderRadius: 16, paddingVertical: 18, alignItems: 'center', cursor: 'pointer', marginTop: 16 },
  splitBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
