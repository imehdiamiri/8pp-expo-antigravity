import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';

const TIERS = [
  { id: 'weekly', name: 'Weekly', emoji: '🔥', color: '#FF6B6B', price: '$4.99/wk', stars: 15 },
  { id: 'monthly', name: 'Monthly', emoji: '⭐', color: '#FFD60A', price: '$9.99/mo', stars: 100 },
  { id: 'yearly', name: 'Yearly', emoji: '💎', color: '#5AC8FA', price: '$49.99/yr', stars: 1500 },
  { id: 'lifetime', name: 'Lifetime', emoji: '👑', color: '#AF52DE', price: '$19.99', stars: 0 },
];

export default function WebPurchaseDetailScreen() {
  return (
    <View style={s.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      <View style={s.topNav}>
        <Link href="/paywall" style={s.backLink}><Text style={s.backText}>← Back to Premium</Text></Link>
      </View>
      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={s.scroll}>
        <Text style={s.title}>Choose Your Plan</Text>
        <Text style={s.subtitle}>Select a subscription that fits your party style</Text>

        <View style={s.grid}>
          {TIERS.map(t => (
            <View key={t.id} style={[s.card, { borderColor: t.color + '40' }]}>
              <Text style={{ fontSize: 34 }}>{t.emoji}</Text>
              <Text style={[s.cardTitle, { color: t.color }]}>{t.name}</Text>
              <Text style={s.cardPrice}>{t.price}</Text>
              {t.stars > 0 && <Text style={s.cardStars}>{t.stars} ⭐ included</Text>}
              {t.id === 'lifetime' && <Text style={s.cardStars}>One-time purchase</Text>}
              <View style={[s.selectBtn, { backgroundColor: t.color }]}>
                <Text style={s.selectBtnText}>Select</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={s.legal}>Subscription is auto-renewing. Cancel anytime from your account settings.</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, position: 'relative', height: '100vh', width: '100vw' },
  topNav: { padding: 24, zIndex: 2 },
  backLink: { padding: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, alignSelf: 'flex-start', textDecorationLine: 'none' },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  scroll: { padding: 48, maxWidth: 800, alignSelf: 'center', width: '100%', alignItems: 'center' },
  title: { color: 'white', fontSize: 34, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center', width: '100%' },
  card: {
    width: 200, padding: 28, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, alignItems: 'center', gap: 8,
  },
  cardTitle: { fontSize: 20, fontWeight: '800' },
  cardPrice: { color: 'white', fontSize: 22, fontWeight: '800' },
  cardStars: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  selectBtn: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 32, marginTop: 12, cursor: 'pointer' },
  selectBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  legal: { color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 32 },
});
