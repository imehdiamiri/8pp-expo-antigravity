import { Colors } from '@/src/theme/Colors';
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';

interface TeamPlayer { id: string; displayName: string; isConnected: boolean; teamId: string | null; }

const TEAM_COLORS = {
  a: { primary: Colors.orange, bg: 'rgba(255,149,0,0.12)', label: 'Team A', emoji: '🔥' },
  b: { primary: '#5AC8FA', bg: 'rgba(90,200,250,0.12)', label: 'Team B', emoji: '⚡' },
};

export default function WebTeamSetupScreen() {
  const router = useRouter();
  const [players, setPlayers] = useState<TeamPlayer[]>([
    { id: '1', displayName: 'Player 1', isConnected: true, teamId: null },
    { id: '2', displayName: 'Player 2', isConnected: true, teamId: null },
    { id: '3', displayName: 'Player 3', isConnected: true, teamId: null },
    { id: '4', displayName: 'Player 4', isConnected: true, teamId: null },
  ]);

  const teamState = useMemo(() => ({
    teamA: players.filter(p => p.teamId === 'team_a'),
    teamB: players.filter(p => p.teamId === 'team_b'),
    unassigned: players.filter(p => p.teamId === null),
  }), [players]);

  const canStart = teamState.unassigned.length === 0 && teamState.teamA.length >= 1 && teamState.teamB.length >= 1;

  const assign = (pid: string, tid: string) => setPlayers(p => p.map(x => x.id === pid ? { ...x, teamId: tid } : x));
  const unassign = (pid: string) => setPlayers(p => p.map(x => x.id === pid ? { ...x, teamId: null } : x));
  const randomize = () => setPlayers(p => [...p].sort(() => Math.random() - 0.5).map((x, i) => ({ ...x, teamId: i % 2 === 0 ? 'team_a' : 'team_b' })));

  const renderTeam = (key: 'a' | 'b', members: TeamPlayer[]) => {
    const c = TEAM_COLORS[key];
    const otherKey = key === 'a' ? 'team_b' : 'team_a';
    return (
      <View style={[s.teamCard, { borderColor: c.primary + '30' }]}>
        <Text style={[s.teamName, { color: c.primary }]}>{c.emoji} {c.label} ({members.length})</Text>
        {members.length === 0 ? (
          <Text style={s.emptyText}>No players assigned yet</Text>
        ) : members.map(p => (
          <View key={p.id} style={s.playerRow}>
            <View style={[s.avatar, { backgroundColor: c.bg }]}>
              <Text style={[s.avatarText, { color: c.primary }]}>{p.displayName[0]}</Text>
            </View>
            <Text style={s.playerName}>{p.displayName}</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={s.moveBtn} onPress={() => assign(p.id, otherKey)}>
              <Text style={s.moveBtnText}>→ {key === 'a' ? 'B' : 'A'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.removeBtn} onPress={() => unassign(p.id)}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={s.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Colors.appBackground }} />
      <View style={s.topNav}>
        <Link href="/" style={s.backLink}><Text style={s.backText}>← Back</Text></Link>
      </View>
      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={s.scroll}>
        <Text style={s.title}>Team Setup</Text>
        <View style={s.toolbar}>
          <TouchableOpacity style={s.toolBtn} onPress={randomize}><Text style={s.toolBtnText}>🔀 Randomize</Text></TouchableOpacity>
        </View>

        <View style={s.twoCol}>
          <View style={s.col}>{renderTeam('a', teamState.teamA)}</View>
          <View style={s.col}>{renderTeam('b', teamState.teamB)}</View>
        </View>

        {teamState.unassigned.length > 0 && (
          <View style={s.unassignedCard}>
            <Text style={s.sectionTitle}>Unassigned · {teamState.unassigned.length}</Text>
            {teamState.unassigned.map(p => (
              <View key={p.id} style={s.playerRow}>
                <View style={s.avatar}><Text style={s.avatarText}>{p.displayName[0]}</Text></View>
                <Text style={s.playerName}>{p.displayName}</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={[s.assignBtn, { backgroundColor: 'rgba(255,149,0,0.12)' }]} onPress={() => assign(p.id, 'team_a')}>
                  <Text style={{ color: Colors.orange, fontSize: 12, fontWeight: '700' }}>→ A</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.assignBtn, { backgroundColor: 'rgba(90,200,250,0.12)' }]} onPress={() => assign(p.id, 'team_b')}>
                  <Text style={{ color: '#5AC8FA', fontSize: 12, fontWeight: '700' }}>→ B</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={[s.startBtn, !canStart && { opacity: 0.4 }]} onPress={canStart ? () => {} : undefined}>
          <Text style={s.startBtnText}>▶ Start Team Match</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, position: 'relative', height: '100vh', width: '100vw' },
  topNav: { padding: 24, zIndex: 2 },
  backLink: { padding: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, alignSelf: 'flex-start', textDecorationLine: 'none' },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  scroll: { padding: 48, maxWidth: 900, alignSelf: 'center', width: '100%' },
  title: { color: 'white', fontSize: 34, fontWeight: '800', marginBottom: 20 },
  toolbar: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  toolBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(168,85,247,0.15)', cursor: 'pointer' },
  toolBtnText: { color: '#A855F7', fontSize: 13, fontWeight: '600' },
  twoCol: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  col: { flex: 1 },
  teamCard: { padding: 20, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, gap: 8 },
  teamName: { fontSize: 17, fontWeight: '800', marginBottom: 8 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 13 },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: 6 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 13, fontWeight: '700', color: 'white' },
  playerName: { color: 'white', fontSize: 15, fontWeight: '600' },
  moveBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', cursor: 'pointer' },
  moveBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },
  removeBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  unassignedCard: { padding: 20, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 24 },
  sectionTitle: { color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  assignBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, cursor: 'pointer', marginLeft: 4 },
  startBtn: { backgroundColor: '#A855F7', borderRadius: 16, paddingVertical: 18, alignItems: 'center', cursor: 'pointer' },
  startBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
