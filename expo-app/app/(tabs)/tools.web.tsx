import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { PARTY_TOOLS } from '@/src/components/tools/PartyToolsSection';
import { CardCategoriesList } from '@/src/models/CardModels';

const TOOL_EMOJIS: Record<string, string> = {
  dice: '🎲', bottle: '🍾', hourglass: '⏳', coin: '🪙', teams: '👥',
};

export default function WebToolsScreen() {
  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Party Toolkit</Text>
        <Text style={styles.pageSubtitle}>Quick tools for your party games</Text>

        {/* Tools Grid */}
        <View style={styles.toolsGrid}>
          {PARTY_TOOLS.map((tool) => (
            <Link key={tool.id} href={`/(tools)/${tool.id}` as any} style={styles.toolCard}>
              <View style={[styles.toolIconBox, { backgroundColor: tool.tint + '25' }]}>
                <Text style={{ fontSize: 28 }}>{TOOL_EMOJIS[tool.id] || '🔧'}</Text>
              </View>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
            </Link>
          ))}
        </View>

        {/* Card Library */}
        <Text style={[styles.pageTitle, { fontSize: 28, marginTop: 48 }]}>Card Library</Text>
        <Text style={styles.pageSubtitle}>Ready-to-use card packs for party games</Text>

        <View style={styles.cardsGrid}>
          {/* AI Generator Card */}
          <View style={[styles.categoryCard, { borderColor: 'rgba(90,200,250,0.3)' }]}>
            <View style={styles.categoryRow}>
              <View style={[styles.catIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <Text style={{ fontSize: 20 }}>✨</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.catTitle}>AI Generator</Text>
                <Text style={styles.catSub}>Create custom prompts</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.3)' }}>→</Text>
            </View>
          </View>

          {CardCategoriesList.map((cat) => (
            <Link key={cat.id} href={`/cards/${cat.id}` as any} style={styles.categoryCard}>
              <View style={styles.categoryRow}>
                <View style={[styles.catIcon, { backgroundColor: cat.accentColor + '20' }]}>
                  <Text style={{ fontSize: 20 }}>📦</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.catTitle, { color: cat.accentColor }]}>{cat.title}</Text>
                  <Text style={styles.catSub}>{cat.subtitle}</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.3)' }}>→</Text>
              </View>
            </Link>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  scrollContent: { padding: 48, maxWidth: 1000, alignSelf: 'center', width: '100%' },
  pageTitle: { color: 'white', fontSize: 36, fontWeight: '800', marginBottom: 8 },
  pageSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 32 },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  toolCard: {
    width: 160, padding: 24, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', textDecorationLine: 'none', cursor: 'pointer',
  },
  toolIconBox: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  toolTitle: { color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  toolSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  cardsGrid: { gap: 12 },
  categoryCard: {
    display: 'flex', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)', textDecorationLine: 'none', cursor: 'pointer',
  },
  categoryRow: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 16 },
  catIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  catTitle: { color: 'white', fontSize: 17, fontWeight: '700', marginBottom: 2 },
  catSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
});
