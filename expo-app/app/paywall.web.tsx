import { Colors } from '@/src/theme/Colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

const FEATURES = [
  { emoji: '♾️', title: 'Unlimited Games', desc: 'No limits on any game mode' },
  { emoji: '🃏', title: 'All Card Packs', desc: 'Access every card category' },
  { emoji: '✨', title: 'AI Game Factory', desc: 'Generate custom game ideas' },
  { emoji: '🎨', title: 'Custom Themes', desc: 'Personalize your experience' },
  { emoji: '👑', title: 'Premium Badge', desc: 'Show your premium status' },
  { emoji: '🚫', title: 'No Ads', desc: 'Ad-free experience forever' },
];

const STAR_PACKS = [
  { stars: 50, price: '$0.99', popular: false },
  { stars: 200, price: '$2.99', popular: true },
  { stars: 500, price: '$4.99', popular: false },
  { stars: 1500, price: '$9.99', popular: false },
];

export default function WebPaywallScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'premium' | 'stars'>('premium');

  return (
    <View style={s.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Colors.appBackground }} />
      
      <View style={s.topNav}>
        <Link href="/profile" style={s.backLink}><Text style={s.backText}>← Back to Profile</Text></Link>
      </View>

      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={s.scroll}>
        <Text style={{ fontSize: 48, textAlign: 'center' }}>👑</Text>
        <Text style={s.title}>8PartyPlay Premium</Text>
        <Text style={s.subtitle}>Unlock the full party experience</Text>

        <View style={s.tabRow}>
          <TouchableOpacity onPress={() => setTab('premium')} style={[s.tab, tab === 'premium' && s.tabActive]}>
            <Text style={[s.tabText, tab === 'premium' && { color: Colors.yellow }]}>⭐ Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('stars')} style={[s.tab, tab === 'stars' && s.tabActive]}>
            <Text style={[s.tabText, tab === 'stars' && { color: Colors.yellow }]}>💎 Star Packs</Text>
          </TouchableOpacity>
        </View>

        {tab === 'premium' ? (
          <>
            <View style={s.featuresGrid}>
              {FEATURES.map((f, i) => (
                <View key={i} style={s.featureCard}>
                  <Text style={{ fontSize: 28 }}>{f.emoji}</Text>
                  <Text style={s.featureTitle}>{f.title}</Text>
                  <Text style={s.featureSub}>{f.desc}</Text>
                </View>
              ))}
            </View>
            <View style={s.planCard}>
              <Text style={s.planTitle}>Monthly Premium</Text>
              <Text style={s.planPrice}>$2.99/mo</Text>
              <Text style={s.planSub}>Cancel anytime • 7-day free trial</Text>
            </View>
            <View style={[s.planCard, { borderColor: 'rgba(255,204,0,0.4)', backgroundColor: 'rgba(255,204,0,0.08)' }]}>
              <View style={s.bestBadge}><Text style={s.bestBadgeText}>BEST VALUE</Text></View>
              <Text style={s.planTitle}>Lifetime Premium</Text>
              <Text style={[s.planPrice, { color: Colors.yellow }]}>$19.99</Text>
              <Text style={s.planSub}>One-time purchase • Forever access</Text>
            </View>
          </>
        ) : (
          <View style={s.starsGrid}>
            {STAR_PACKS.map((p, i) => (
              <View key={i} style={[s.starCard, p.popular && { borderColor: '#5AC8FA', backgroundColor: 'rgba(90,200,250,0.08)' }]}>
                {p.popular && <View style={s.popularBadge}><Text style={s.popularText}>POPULAR</Text></View>}
                <Text style={{ fontSize: 34 }}>⭐</Text>
                <Text style={s.starCount}>{p.stars} Stars</Text>
                <Text style={s.starPrice}>{p.price}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={s.legal}>Purchases are processed through the App Store. Web purchases coming soon.</Text>
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
  title: { color: 'white', fontSize: 34, fontWeight: '800', marginTop: 16, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 32, textAlign: 'center' },
  tabRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  tab: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', cursor: 'pointer' },
  tabActive: { backgroundColor: 'rgba(255,204,0,0.15)', borderWidth: 1, borderColor: Colors.yellow },
  tabText: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '600' },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 32, width: '100%' },
  featureCard: { width: 220, padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', gap: 8 },
  featureTitle: { color: 'white', fontSize: 15, fontWeight: '700' },
  featureSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center' },
  planCard: { width: '100%', padding: 24, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', marginBottom: 16, gap: 8, cursor: 'pointer' },
  planTitle: { color: 'white', fontSize: 20, fontWeight: '700' },
  planPrice: { color: 'white', fontSize: 34, fontWeight: '800' },
  planSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  bestBadge: { backgroundColor: Colors.yellow, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 4 },
  bestBadgeText: { color: '#000', fontSize: 11, fontWeight: '800' },
  starsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', width: '100%' },
  starCard: { width: 180, padding: 24, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', gap: 8, cursor: 'pointer' },
  popularBadge: { backgroundColor: '#5AC8FA', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  popularText: { color: '#000', fontSize: 11, fontWeight: '800' },
  starCount: { color: 'white', fontSize: 20, fontWeight: '700' },
  starPrice: { color: '#5AC8FA', fontSize: 17, fontWeight: '800' },
  legal: { color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 32 },
});
