import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackgroundView } from '@/src/components/AppBackgroundView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';

export default function FriendsScreen() {
  const insets = useSafeAreaInsets();
  
  // Local state for Offline Friends
  const [draftFriendName, setDraftFriendName] = useState('');
  const [offlineFriends, setOfflineFriends] = useState([
    { id: '1', name: 'Player 1', isMe: true },
    { id: '2', name: 'Player 2', isMe: false }
  ]);
  const [editingOfflineFriendID, setEditingOfflineFriendID] = useState<string | null>(null);
  const [editingOfflineFriendName, setEditingOfflineFriendName] = useState('');

  // Online Friends / Search
  const [searchText, setSearchText] = useState('');
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const handleAddOfflineFriend = () => {
    if (!draftFriendName.trim()) return;
    setOfflineFriends(prev => [
      ...prev,
      { id: Date.now().toString(), name: draftFriendName.trim(), isMe: false }
    ]);
    setDraftFriendName('');
  };

  const handleRemoveOfflineFriend = (id: string) => {
    setOfflineFriends(prev => prev.filter(f => f.id !== id));
  };

  const handleSaveEditOfflineFriend = () => {
    if (!editingOfflineFriendName.trim() || !editingOfflineFriendID) return;
    setOfflineFriends(prev => prev.map(f => 
      f.id === editingOfflineFriendID ? { ...f, name: editingOfflineFriendName.trim() } : f
    ));
    setEditingOfflineFriendID(null);
    setEditingOfflineFriendName('');
  };

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: "Let's play 8PartyPlay together! Download: https://www.8partyplay.com",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const compactAvatar = (title: string, isOnline: boolean = false, size: number = 34) => (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.42 }]}>
        {title.charAt(0).toUpperCase()}
      </Text>
      {isOnline && (
        <View style={[styles.onlineDot, { 
          width: Math.max(7, size * 0.28), 
          height: Math.max(7, size * 0.28) 
        }]} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppBackgroundView />
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 6, paddingBottom: 96 }]}
        keyboardDismissMode="interactive"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
          <View style={{ flex: 1 }} />
          {requests.length > 0 && (
            <View style={styles.notificationBadge}>
              <IconSymbol name="bell.badge.fill" size={12} color="orange" />
              <Text style={styles.notificationText}>{requests.length}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.profileButton}>
            <IconSymbol name="person.crop.circle" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Quick Join Card */}
        <BlurView intensity={30} tint="dark" style={styles.quickJoinCard}>
          <View style={styles.quickJoinIconContainer}>
            <IconSymbol name="number.square.fill" size={22} color="#0A84FF" />
          </View>
          <View style={styles.quickJoinTextContainer}>
            <Text style={styles.quickJoinTitle}>Join with Code</Text>
            <Text style={styles.quickJoinSubtitle}>Enter a room code to join instantly</Text>
          </View>
          <TouchableOpacity style={styles.quickJoinButton}>
            <Text style={styles.quickJoinButtonText}>Enter Code</Text>
          </TouchableOpacity>
        </BlurView>

        {/* Offline Friends Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Offline Friends</Text>
          <Text style={styles.sectionSubtitle}>Local names for Single Device games.</Text>
          
          <BlurView intensity={25} tint="dark" style={styles.surfaceCard}>
            <View style={styles.addFriendRow}>
              <TextInput 
                style={styles.inputField}
                placeholder="Add name"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoCapitalize="words"
                value={draftFriendName}
                onChangeText={setDraftFriendName}
              />
              <TouchableOpacity style={styles.secondaryActionButton} onPress={handleAddOfflineFriend}>
                <Text style={styles.secondaryActionButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            {offlineFriends.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <IconSymbol name="person.crop.circle.badge.plus" size={32} color="rgba(255,255,255,0.4)" />
                <Text style={styles.emptyStateText}>No Offline Friends</Text>
                <Text style={styles.emptyStateSubText}>Add names for local games.</Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {offlineFriends.map((friend, index) => (
                  <View key={friend.id}>
                    {editingOfflineFriendID === friend.id ? (
                      <View style={[styles.addFriendRow, { marginVertical: 8, marginBottom: 8 }]}>
                        <TextInput 
                          style={styles.inputField}
                          placeholder="Friend name"
                          placeholderTextColor="rgba(255,255,255,0.4)"
                          autoCapitalize="words"
                          value={editingOfflineFriendName}
                          onChangeText={setEditingOfflineFriendName}
                        />
                        <TouchableOpacity style={[styles.secondaryActionButton, { width: 68 }]} onPress={handleSaveEditOfflineFriend}>
                          <Text style={styles.secondaryActionButtonText}>Save</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.friendRow}>
                        {compactAvatar(friend.name, false, 26)}
                        <Text style={styles.friendName} numberOfLines={1}>{friend.name}</Text>
                        
                        {friend.isMe && (
                          <View style={styles.meBadge}>
                            <Text style={styles.meBadgeText}>me</Text>
                          </View>
                        )}
                        
                        <View style={{ flex: 1 }} />
                        
                        {!friend.isMe && (
                          <View style={styles.friendActions}>
                            <TouchableOpacity onPress={() => {
                              setEditingOfflineFriendID(friend.id);
                              setEditingOfflineFriendName(friend.name);
                            }}>
                              <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.deleteButton}
                              onPress={() => handleRemoveOfflineFriend(friend.id)}
                            >
                              <IconSymbol name="trash" size={14} color="rgba(255, 69, 58, 0.8)" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                    {index < offlineFriends.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            )}
          </BlurView>
        </View>

        {/* Online Friends Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Online Friends</Text>
          <Text style={styles.sectionSubtitle}>For Multi Device games and invites.</Text>
          
          <BlurView intensity={25} tint="dark" style={styles.surfaceCard}>
            <TextInput 
              style={[styles.inputField, { marginBottom: 8 }]}
              placeholder="Search username, email, or ID"
              placeholderTextColor="rgba(255,255,255,0.4)"
              autoCapitalize="none"
              keyboardType="email-address"
              value={searchText}
              onChangeText={setSearchText}
            />
            
            {searchText.trim().length > 0 && (
              <View style={styles.searchResultsSection}>
                <Text style={styles.subHeadingText}>Results</Text>
                <Text style={styles.noMatchesText}>Log in to search</Text>
              </View>
            )}

            {onlineFriends.length === 0 ? (
              <View style={styles.onlineEmptyContainer}>
                <View style={styles.onlineEmptyHeader}>
                  <IconSymbol name="person.2.fill" size={22} color="rgba(255,255,255,0.5)" />
                  <View style={{ gap: 2 }}>
                    <Text style={styles.emptyStateTitleText}>No Online Friends</Text>
                    <Text style={styles.emptyStateSubText}>Accepted friendships appear here.</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.inviteButtonFull} onPress={handleShareInvite}>
                  <IconSymbol name="square.and.arrow.up" size={14} color="white" />
                  <Text style={styles.inviteButtonFullText}>Invite friends to play</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {onlineFriends.map((friend: any, index) => (
                  <View key={friend.id}>
                    <View style={styles.friendRow}>
                      {compactAvatar(friend.name, friend.isOnline, 26)}
                      <Text style={styles.friendName} numberOfLines={1}>{friend.name}</Text>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity style={styles.invitePillButton}>
                        <Text style={styles.invitePillButtonText}>Invite</Text>
                      </TouchableOpacity>
                    </View>
                    {index < onlineFriends.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            )}
          </BlurView>
        </View>

        {/* Public Rooms Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.publicRoomsHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.publicRoomsTitle}>Public Rooms</Text>
              <Text style={styles.publicRoomsSubtitle}>Open multiplayer rooms you can join.</Text>
            </View>
            <TouchableOpacity style={styles.loginButton}>
              <IconSymbol name="person.crop.circle" size={12} color="#0A84FF" />
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <BlurView intensity={25} tint="dark" style={styles.surfaceCard}>
            <View style={[styles.emptyStateContainer, { paddingVertical: 16 }]}>
              <IconSymbol name="person.3.sequence.fill" size={28} color="rgba(10, 132, 255, 0.6)" />
              <Text style={[styles.emptyStateText, { color: 'rgba(255,255,255,0.6)' }]}>No public rooms yet</Text>
              <Text style={styles.emptyStateSubText}>Create a room from any multiplayer game.</Text>
            </View>
          </BlurView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontFamily: 'Viral-Black',
    fontSize: 20,
    color: 'white',
  },
  notificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 149, 0, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  notificationText: {
    color: 'orange',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickJoinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  quickJoinIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 132, 255, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickJoinTextContainer: {
    flex: 1,
    gap: 2,
  },
  quickJoinTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  quickJoinSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  quickJoinButton: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickJoinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 6,
  },
  surfaceCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  addFriendRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
    fontSize: 15,
  },
  secondaryActionButton: {
    width: 64,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryActionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  listContainer: {
    flexDirection: 'column',
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  friendName: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  meBadge: {
    backgroundColor: 'rgba(10, 132, 255, 0.18)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 12,
  },
  meBadgeText: {
    color: '#0A84FF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  friendActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
  },
  deleteButton: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 4,
  },
  avatarContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#34C759',
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.7)',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  emptyStateTitleText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyStateText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyStateSubText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
  },
  onlineEmptyContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  onlineEmptyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inviteButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0A84FF',
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 4,
  },
  inviteButtonFullText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  invitePillButton: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  invitePillButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchResultsSection: {
    marginBottom: 6,
  },
  subHeadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  noMatchesText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    paddingVertical: 4,
  },
  publicRoomsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  publicRoomsTitle: {
    fontFamily: 'Viral-Black',
    color: 'white',
    fontSize: 20,
    marginBottom: 2,
  },
  publicRoomsSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(10, 132, 255, 0.25)',
  },
  loginButtonText: {
    color: '#0A84FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
