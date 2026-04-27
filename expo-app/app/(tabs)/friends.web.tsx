import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function WebFriendsScreen() {
  const [draftFriendName, setDraftFriendName] = useState('');
  const [offlineFriends, setOfflineFriends] = useState([
    { id: '1', name: 'Player 1', isMe: true },
    { id: '2', name: 'Player 2', isMe: false }
  ]);
  const [searchText, setSearchText] = useState('');

  const handleAddFriend = () => {
    if (!draftFriendName.trim()) return;
    setOfflineFriends(prev => [
      ...prev,
      { id: Date.now().toString(), name: draftFriendName.trim(), isMe: false }
    ]);
    setDraftFriendName('');
  };

  const handleRemove = (id: string) => {
    setOfflineFriends(prev => prev.filter(f => f.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a12' }} />
      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Friends</Text>
        <Text style={styles.pageSubtitle}>Manage your player list for local and online games</Text>

        <View style={styles.twoCol}>
          {/* Offline Friends */}
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>📋 Offline Players</Text>
            <Text style={styles.sectionSub}>Quick names for local sessions</Text>

            <View style={styles.addRow}>
              <TextInput
                style={styles.input}
                placeholder="Add a friend..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={draftFriendName}
                onChangeText={setDraftFriendName}
                onSubmitEditing={handleAddFriend}
              />
              <TouchableOpacity style={styles.addBtn} onPress={handleAddFriend}>
                <Text style={styles.addBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {offlineFriends.map(f => (
              <View key={f.id} style={styles.friendRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{f.name[0]?.toUpperCase()}</Text>
                </View>
                <Text style={styles.friendName}>{f.name}</Text>
                {f.isMe && <Text style={styles.meBadge}>You</Text>}
                {!f.isMe && (
                  <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(f.id)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Online Friends */}
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>🌐 Online Friends</Text>
            <Text style={styles.sectionSub}>Coming soon — find and add friends online</Text>

            <TextInput
              style={styles.input}
              placeholder="Search by username..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={searchText}
              onChangeText={setSearchText}
            />

            <View style={styles.emptyState}>
              <Text style={{ fontSize: 48 }}>👥</Text>
              <Text style={styles.emptyTitle}>No online friends yet</Text>
              <Text style={styles.emptySub}>Sign in and search for friends to add them here.</Text>
            </View>

            <View style={styles.inviteCard}>
              <Text style={styles.inviteTitle}>📨 Invite Friends</Text>
              <Text style={styles.inviteSub}>Share the link to invite friends to play with you online.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  scrollContent: { padding: 48, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  pageTitle: { color: 'white', fontSize: 34, fontWeight: '800', marginBottom: 8 },
  pageSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 40 },
  twoCol: { flexDirection: 'row', gap: 48 },
  col: { flex: 1 },
  sectionTitle: { color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  sectionSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 },
  addRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  input: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: 'white',
    fontSize: 16, padding: 14, outlineStyle: 'none',
  },
  addBtn: {
    backgroundColor: '#5AC8FA', borderRadius: 12, paddingHorizontal: 20,
    justifyContent: 'center', cursor: 'pointer',
  },
  addBtnText: { color: '#000', fontSize: 15, fontWeight: '700' },
  friendRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(90,200,250,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#5AC8FA', fontWeight: '800', fontSize: 13 },
  friendName: { color: 'white', fontSize: 16, fontWeight: '600', flex: 1 },
  meBadge: {
    backgroundColor: 'rgba(90,200,250,0.15)', color: '#5AC8FA',
    fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  removeBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,59,48,0.15)',
    justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
  },
  removeBtnText: { color: '#FF3B30', fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', padding: 40, gap: 12 },
  emptyTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 17, fontWeight: '600' },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center' },
  inviteCard: {
    padding: 24, borderRadius: 16, backgroundColor: 'rgba(90,200,250,0.08)',
    borderWidth: 1, borderColor: 'rgba(90,200,250,0.2)', gap: 8, marginTop: 20,
  },
  inviteTitle: { color: 'white', fontSize: 17, fontWeight: '700' },
  inviteSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
});
