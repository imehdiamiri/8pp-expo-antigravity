import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Games, GameMode } from '@/src/models/AppModels';
import { useGameStore } from '@/src/store/useGameStore';
import { useSettingsStore } from '@/src/store/useSettingsStore';

// ─── Game-specific option types ───
type MemoryGridSize = 'tiny3x4' | 'small4x4' | 'medium4x5' | 'large5x6' | 'huge6x6';
const GRID_SIZES = [
  { id: 'tiny3x4', title: '3×4', subtitle: '6 pairs', pairs: 6 },
  { id: 'small4x4', title: '4×4', subtitle: '8 pairs', pairs: 8 },
  { id: 'medium4x5', title: '4×5', subtitle: '10 pairs', pairs: 10 },
  { id: 'large5x6', title: '5×6', subtitle: '15 pairs', pairs: 15 },
  { id: 'huge6x6', title: '6×6', subtitle: '18 pairs', pairs: 18 },
];

const MP_DIFFICULTIES = [
  { id: 'easy', gridSize: 5, color: '#34C759' },
  { id: 'medium', gridSize: 6, color: '#FF9500' },
  { id: 'hard', gridSize: 7, color: '#FF3B30' },
  { id: 'expert', gridSize: 8, color: '#AF52DE' },
];

const TIO_GRID_SIZES = [4, 5, 6, 7];
const TIO_TILE_OPTIONS: Record<number, number[]> = {
  4: [4, 6, 8, 10], 5: [6, 8, 10, 14], 6: [8, 10, 14, 18], 7: [10, 14, 18, 24],
};

export default function WebGameSetupScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode: GameMode }>();
  const router = useRouter();
  const { startSingleDeviceSession } = useGameStore();
  const { lastGameConfigs, lastPlayerNames, saveGameConfig } = useSettingsStore();

  const gameKey = Object.keys(Games).find(key => Games[key].id === id);
  const game = gameKey ? Games[gameKey] : null;

  const [playerCount, setPlayerCount] = useState(game ? Math.max(game.minPlayers, Math.min(2, game.maxPlayers)) : 2);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(playerCount).fill(''));
  const [roundCount, setRoundCount] = useState(3);

  // Game-specific state
  const [mgGridSize, setMgGridSize] = useState<MemoryGridSize>('tiny3x4');
  const [mpDifficulty, setMpDifficulty] = useState('easy');
  const [mpGameMode, setMpGameMode] = useState('timeRace');
  const [mpSteps, setMpSteps] = useState(6);
  const [tioGridSize, setTioGridSize] = useState(4);
  const [tioTileCount, setTioTileCount] = useState(6);
  const [sbDifficulty, setSbDifficulty] = useState<'mild'|'classic'|'bold'>('classic');
  const [ctDifficulty, setCtDifficulty] = useState<'easy'|'medium'|'hard'>('medium');
  const [drConceptMode, setDrConceptMode] = useState<'preset'|'freeDraw'>('preset');
  const [imposterStyle, setImposterStyle] = useState<'discussion'|'clue'>('discussion');

  const needsRounds = !['memory_grid', 'memory_path', 'tap_in_order', 'ten_tangle', 'color_trap', 'spin_bottle', 'draw_rush'].includes(id || '');

  // Restore saved configs
  useEffect(() => {
    if (!id) return;
    const saved = lastGameConfigs[id];
    const savedNames = lastPlayerNames[id];
    if (savedNames?.length) { setPlayerCount(savedNames.length); setPlayerNames(savedNames); }
    if (!saved) return;
    if (id === 'memory_grid' && saved.gridSize) setMgGridSize(saved.gridSize);
    if (id === 'memory_path') {
      if (saved.gameMode) setMpGameMode(saved.gameMode);
      if (saved.gridSize) setMpDifficulty(saved.gridSize);
      if (saved.pathLength) setMpSteps(saved.pathLength);
    }
    if (id === 'tap_in_order') { if (saved.gridSize) setTioGridSize(saved.gridSize); if (saved.tileCount) setTioTileCount(saved.tileCount); }
    if (id === 'spin_bottle' && saved.difficulty) setSbDifficulty(saved.difficulty);
    if (id === 'color_trap' && saved.difficulty) setCtDifficulty(saved.difficulty);
    if (id === 'draw_rush' && saved.conceptMode) setDrConceptMode(saved.conceptMode);
    if (id === 'imposter' && saved.gameStyle) setImposterStyle(saved.gameStyle);
  }, [id]);

  useEffect(() => {
    const opts = TIO_TILE_OPTIONS[tioGridSize] || [6];
    if (!opts.includes(tioTileCount)) setTioTileCount(opts[1] || opts[0]);
  }, [tioGridSize]);

  const updatePlayerCount = (n: number) => {
    setPlayerCount(n);
    setPlayerNames(prev => {
      const arr = [...prev];
      while (arr.length < n) arr.push('');
      return arr.slice(0, n);
    });
  };

  const updatePlayerName = (index: number, name: string) => {
    const n = [...playerNames]; n[index] = name; setPlayerNames(n);
  };

  const handleStart = () => {
    if (!game || !id) return;
    // Default empty names to "Player X"
    const names = playerNames.map((n, i) => n.trim() || `Player ${i + 1}`);
    let config: Record<string, any> = {};
    switch (id) {
      case 'memory_grid': config = { gridSize: mgGridSize }; break;
      case 'memory_path': config = { gameMode: mpGameMode, gridSize: mpDifficulty, pathLength: mpSteps }; break;
      case 'tap_in_order': config = { gridSize: tioGridSize, tileCount: tioTileCount }; break;
      case 'spin_bottle': config = { difficulty: sbDifficulty }; break;
      case 'color_trap': config = { difficulty: ctDifficulty }; break;
      case 'draw_rush': config = { conceptMode: drConceptMode }; break;
      case 'imposter': config = { gameStyle: imposterStyle }; break;
    }
    try {
      startSingleDeviceSession(game, names, needsRounds ? roundCount : 1, config);
      saveGameConfig(id, config, names);
      router.push(`/game/${id}/session` as any);
    } catch (e) {
      console.error('Failed to start game session:', e);
    }
  };

  if (!game) return (
    <View style={s.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>Game not found</Text>
        <Link href="/" style={{ color: '#5AC8FA', marginTop: 16 }}>← Back to Home</Link>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      <View style={s.topNav}>
        <Link href={`/game/${id}` as any} style={s.backLink}><Text style={s.backText}>← Back</Text></Link>
      </View>
      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={s.scroll}>
        <Text style={s.title}>Setup: {game.name}</Text>
        <Text style={s.subtitle}>{game.shortDescription}</Text>

        <View style={s.twoCol}>
          {/* Left — Players */}
          <View style={s.col}>
            <View style={s.card}>
              <Text style={s.sectionTitle}>👥 Players ({playerCount})</Text>
              <View style={s.counterRow}>
                <TouchableOpacity style={s.counterBtn} onPress={() => updatePlayerCount(Math.max(game.minPlayers, playerCount - 1))}>
                  <Text style={s.counterBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={s.counterValue}>{playerCount}</Text>
                <TouchableOpacity style={s.counterBtn} onPress={() => updatePlayerCount(Math.min(game.maxPlayers, playerCount + 1))}>
                  <Text style={s.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              {Array.from({ length: playerCount }).map((_, i) => (
                <TextInput key={i} style={s.input}
                  placeholder={`Player ${i + 1}`} placeholderTextColor="rgba(255,255,255,0.3)"
                  value={playerNames[i] || ''} onChangeText={v => updatePlayerName(i, v)} />
              ))}
            </View>

            {needsRounds && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>🔄 Rounds</Text>
                <View style={s.counterRow}>
                  <TouchableOpacity style={s.counterBtn} onPress={() => setRoundCount(Math.max(1, roundCount - 1))}><Text style={s.counterBtnText}>−</Text></TouchableOpacity>
                  <Text style={s.counterValue}>{roundCount}</Text>
                  <TouchableOpacity style={s.counterBtn} onPress={() => setRoundCount(Math.min(20, roundCount + 1))}><Text style={s.counterBtnText}>+</Text></TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Right — Game-specific Options */}
          <View style={s.col}>
            {id === 'memory_grid' && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>🧩 Grid Size</Text>
                {GRID_SIZES.map(gs => (
                  <TouchableOpacity key={gs.id} onPress={() => setMgGridSize(gs.id as MemoryGridSize)}
                    style={[s.optionRow, mgGridSize === gs.id && s.optionRowActive]}>
                    <Text style={s.optionTitle}>{gs.title}</Text>
                    <Text style={s.optionSub}>{gs.subtitle}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {id === 'memory_path' && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>🧠 Difficulty</Text>
                <View style={s.chipRow}>
                  {MP_DIFFICULTIES.map(d => (
                    <TouchableOpacity key={d.id} onPress={() => setMpDifficulty(d.id)}
                      style={[s.chip, mpDifficulty === d.id && { backgroundColor: d.color + '30', borderColor: d.color }]}>
                      <Text style={[s.chipText, mpDifficulty === d.id && { color: d.color }]}>{d.id}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[s.sectionTitle, { marginTop: 20 }]}>Mode</Text>
                <View style={s.chipRow}>
                  <TouchableOpacity onPress={() => setMpGameMode('timeRace')} style={[s.chip, mpGameMode === 'timeRace' && s.chipActive]}>
                    <Text style={[s.chipText, mpGameMode === 'timeRace' && { color: '#5AC8FA' }]}>⏱ Time Race</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setMpGameMode('turnBased')} style={[s.chip, mpGameMode === 'turnBased' && s.chipActive]}>
                    <Text style={[s.chipText, mpGameMode === 'turnBased' && { color: '#5AC8FA' }]}>🔄 Turn-Based</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {id === 'tap_in_order' && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>📐 Grid Size</Text>
                <View style={s.chipRow}>
                  {TIO_GRID_SIZES.map(g => (
                    <TouchableOpacity key={g} onPress={() => setTioGridSize(g)} style={[s.chip, tioGridSize === g && s.chipActive]}>
                      <Text style={[s.chipText, tioGridSize === g && { color: '#5AC8FA' }]}>{g}×{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[s.sectionTitle, { marginTop: 20 }]}>Tiles</Text>
                <View style={s.chipRow}>
                  {(TIO_TILE_OPTIONS[tioGridSize] || []).map(t => (
                    <TouchableOpacity key={t} onPress={() => setTioTileCount(t)} style={[s.chip, tioTileCount === t && s.chipActive]}>
                      <Text style={[s.chipText, tioTileCount === t && { color: '#5AC8FA' }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {id === 'spin_bottle' && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>🎯 Difficulty</Text>
                <View style={s.chipRow}>
                  {(['mild', 'classic', 'bold'] as const).map(d => (
                    <TouchableOpacity key={d} onPress={() => setSbDifficulty(d)} style={[s.chip, sbDifficulty === d && s.chipActive]}>
                      <Text style={[s.chipText, sbDifficulty === d && { color: '#5AC8FA' }]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {id === 'color_trap' && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>🎨 Difficulty</Text>
                <View style={s.chipRow}>
                  {(['easy', 'medium', 'hard'] as const).map(d => (
                    <TouchableOpacity key={d} onPress={() => setCtDifficulty(d)} style={[s.chip, ctDifficulty === d && s.chipActive]}>
                      <Text style={[s.chipText, ctDifficulty === d && { color: '#5AC8FA' }]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {id === 'draw_rush' && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>✏️ Concept Mode</Text>
                <View style={s.chipRow}>
                  <TouchableOpacity onPress={() => setDrConceptMode('preset')} style={[s.chip, drConceptMode === 'preset' && s.chipActive]}>
                    <Text style={[s.chipText, drConceptMode === 'preset' && { color: '#5AC8FA' }]}>🎯 Preset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDrConceptMode('freeDraw')} style={[s.chip, drConceptMode === 'freeDraw' && s.chipActive]}>
                    <Text style={[s.chipText, drConceptMode === 'freeDraw' && { color: '#5AC8FA' }]}>✨ Free Draw</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {id === 'imposter' && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>🕵️ Game Style</Text>
                <View style={s.chipRow}>
                  <TouchableOpacity onPress={() => setImposterStyle('discussion')} style={[s.chip, imposterStyle === 'discussion' && s.chipActive]}>
                    <Text style={[s.chipText, imposterStyle === 'discussion' && { color: '#5AC8FA' }]}>💬 Discussion</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setImposterStyle('clue')} style={[s.chip, imposterStyle === 'clue' && s.chipActive]}>
                    <Text style={[s.chipText, imposterStyle === 'clue' && { color: '#5AC8FA' }]}>🔍 Clue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {!['memory_grid', 'memory_path', 'tap_in_order', 'spin_bottle', 'color_trap', 'draw_rush', 'imposter'].includes(id || '') && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>⚙️ Options</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Default settings will be used.</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={s.startBtn} onPress={handleStart}>
          <Text style={s.startBtnText}>▶ Start Game</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, position: 'relative', height: '100vh', width: '100vw' },
  topNav: { padding: 24, zIndex: 2 },
  backLink: { padding: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, alignSelf: 'flex-start', textDecorationLine: 'none' },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  scroll: { padding: 48, maxWidth: 1000, alignSelf: 'center', width: '100%', paddingBottom: 80 },
  title: { color: 'white', fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 32 },
  twoCol: { flexDirection: 'row', gap: 32 },
  col: { flex: 1, gap: 20 },
  card: { padding: 24, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 16 },
  counterBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  counterBtnText: { color: 'white', fontSize: 24, fontWeight: '600' },
  counterValue: { color: 'white', fontSize: 36, fontWeight: '800', minWidth: 50, textAlign: 'center' },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 16, padding: 14, marginBottom: 10, outlineStyle: 'none' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', cursor: 'pointer' },
  chipActive: { backgroundColor: 'rgba(90,200,250,0.15)', borderColor: '#5AC8FA' },
  chipText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600', textTransform: 'capitalize' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', marginBottom: 8, cursor: 'pointer', borderWidth: 1, borderColor: 'transparent' },
  optionRowActive: { backgroundColor: 'rgba(90,200,250,0.1)', borderColor: '#5AC8FA' },
  optionTitle: { color: 'white', fontSize: 16, fontWeight: '700' },
  optionSub: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  startBtn: { backgroundColor: '#34C759', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 32, cursor: 'pointer' },
  startBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
});
