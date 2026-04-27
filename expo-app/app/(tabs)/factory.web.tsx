import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GAME_VIBES = [
  { id: 'couple', title: 'Couple', emoji: '💕', color: '#FF2D55' },
  { id: 'funny', title: 'Funny', emoji: '😂', color: '#FFCC00' },
  { id: 'memory', title: 'Memory', emoji: '🧠', color: '#5AC8FA' },
  { id: 'action', title: 'Action', emoji: '🏃', color: '#FF9500' },
  { id: 'cards', title: 'Cards', emoji: '🃏', color: '#007AFF' },
  { id: 'trivia', title: 'Trivia', emoji: '❓', color: '#00C7BE' },
  { id: 'roleplay', title: 'Roleplay', emoji: '🎭', color: '#AF52DE' },
  { id: 'challenge', title: 'Challenge', emoji: '🔥', color: '#FF3B30' },
];

const MOCK_IDEAS = [
  {
    id: '1', title: 'Laugh Out Loud',
    description: 'A hilarious game of quick wits.',
    steps: ['Gather friends', 'Pick a card', 'Act it out', 'Laugh!'],
    tags: ['Fast', 'Groups'],
  },
  {
    id: '2', title: 'Silent Charades',
    description: 'Communicate without making a sound.',
    steps: ['Choose a category', 'Take turns acting', 'Guess the answer before the timer runs out'],
    tags: ['Silent', 'Acting'],
  }
];

export default function WebFactoryScreen() {
  const [selectedVibe, setSelectedVibe] = useState(GAME_VIBES[1]);
  const [playerCount, setPlayerCount] = useState(4);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIdeas(MOCK_IDEAS);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>AI Game Factory</Text>
        <Text style={styles.pageSubtitle}>Generate custom game ideas with AI</Text>

        <View style={styles.twoCol}>
          {/* Left — Configuration */}
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Choose a Vibe</Text>
            <View style={styles.vibeGrid}>
              {GAME_VIBES.map(v => (
                <View
                  key={v.id}
                  onPress={() => setSelectedVibe(v)}
                  style={[
                    styles.vibeChip,
                    selectedVibe.id === v.id && { backgroundColor: v.color + '30', borderColor: v.color },
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>{v.emoji}</Text>
                  <Text style={[styles.vibeText, selectedVibe.id === v.id && { color: v.color }]}>{v.title}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Players</Text>
            <View style={styles.playerRow}>
              <TouchableOpacity style={styles.playerBtn} onPress={() => setPlayerCount(Math.max(2, playerCount - 1))}>
                <Text style={styles.playerBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.playerCount}>{playerCount}</Text>
              <TouchableOpacity style={styles.playerBtn} onPress={() => setPlayerCount(Math.min(20, playerCount + 1))}>
                <Text style={styles.playerBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Custom Prompt (Optional)</Text>
            <TextInput
              style={styles.promptInput}
              placeholder="e.g. A game about movies..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={prompt}
              onChangeText={setPrompt}
              multiline
            />

            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
              <Text style={styles.generateBtnText}>
                {isGenerating ? '⏳ Generating...' : '✨ Generate Ideas'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right — Results */}
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Generated Ideas</Text>
            {ideas.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 48 }}>🎯</Text>
                <Text style={styles.emptyTitle}>No ideas yet</Text>
                <Text style={styles.emptySub}>Configure your preferences and click Generate to create custom game ideas.</Text>
              </View>
            ) : (
              ideas.map(idea => (
                <View key={idea.id} style={styles.ideaCard}>
                  <Text style={styles.ideaTitle}>{idea.title}</Text>
                  <Text style={styles.ideaDesc}>{idea.description}</Text>
                  <View style={styles.tagRow}>
                    {idea.tags.map((tag: string) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={[styles.sectionTitle, { fontSize: 14, marginTop: 16 }]}>Steps</Text>
                  {idea.steps.map((step: string, i: number) => (
                    <Text key={i} style={styles.stepText}>{i + 1}. {step}</Text>
                  ))}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  scrollContent: { padding: 48, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  pageTitle: { color: 'white', fontSize: 36, fontWeight: '800', marginBottom: 8 },
  pageSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 40 },
  twoCol: { flexDirection: 'row', gap: 48 },
  col: { flex: 1 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  vibeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  vibeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', cursor: 'pointer',
  },
  vibeText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  playerBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
  },
  playerBtnText: { color: 'white', fontSize: 24, fontWeight: '600' },
  playerCount: { color: 'white', fontSize: 36, fontWeight: '800', minWidth: 50, textAlign: 'center' },
  promptInput: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14,
    color: 'white', fontSize: 16, padding: 16, minHeight: 100,
    outlineStyle: 'none',
  },
  generateBtn: {
    backgroundColor: '#5AC8FA', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 24, cursor: 'pointer',
  },
  generateBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
  emptyState: { alignItems: 'center', padding: 48, gap: 12 },
  emptyTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 20, fontWeight: '600' },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', maxWidth: 300 },
  ideaCard: {
    padding: 24, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 20,
  },
  ideaTitle: { color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  ideaDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 12 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: {
    backgroundColor: 'rgba(90,200,250,0.15)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  tagText: { color: '#5AC8FA', fontSize: 12, fontWeight: '700' },
  stepText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 22, marginBottom: 4 },
});
