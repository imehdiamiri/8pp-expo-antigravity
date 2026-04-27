import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { CardCategoryInfo } from '@/src/models/CardModels';
import { CardsDeckRenderer } from '@/src/components/tools/CardsDeckRenderer';

export default function WebCardsDeckScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const category = CardCategoryInfo[categoryId as keyof typeof CardCategoryInfo];

  if (!category) {
    return (
      <View style={s.container}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
          <Text style={{ color: 'white', fontSize: 20 }}>Category not found</Text>
          <Link href="/(tabs)/tools" style={{ color: '#5AC8FA', marginTop: 16, textDecorationLine: 'none' }}>← Back to Tools</Link>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      <View style={s.header}>
        <Link href="/(tabs)/tools" style={s.backLink}><Text style={s.backText}>← Back to Tools</Text></Link>
        <Text style={[s.title, { color: category.accentColor }]}>{category.title}</Text>
        <View style={{ width: 100 }} />
      </View>
      <View style={{ flex: 1, zIndex: 1 }}>
        <CardsDeckRenderer categoryId={categoryId as any} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, position: 'relative', height: '100vh', width: '100vw' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)', zIndex: 2,
  },
  backLink: { padding: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, textDecorationLine: 'none' },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '800' },
});
