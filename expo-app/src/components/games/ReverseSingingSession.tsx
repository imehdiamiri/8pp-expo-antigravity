import { Colors } from '@/src/theme/Colors';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { GameSession } from '@/src/store/useGameStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as FileSystem from 'expo-file-system';
import { httpsCallable } from 'firebase/functions';
import { functionsApi } from '@/src/lib/firebase';
import { ActivityIndicator } from 'react-native';

// Platform-safe audio import
let Audio: any = null;
if (Platform.OS !== 'web') {
  try { Audio = require('expo-av').Audio; } catch {}
}

interface Props {
  session: GameSession;
}

const WAVEFORM_BARS = [0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.3, 0.6, 0.5];

export function ReverseSingingSession({ session }: Props) {
  const [activeStep, setActiveStep] = useState<'playerOne' | 'playerTwo'>('playerOne');
  
  // Player 1 State
  const [p1Recording, setP1Recording] = useState<Audio.Recording | null>(null);
  const [p1Uri, setP1Uri] = useState<string | null>(null);
  const [p1Duration, setP1Duration] = useState(0);
  const [p1ReversedUri, setP1ReversedUri] = useState<string | null>(null);

  // Player 2 State
  const [p2Recording, setP2Recording] = useState<Audio.Recording | null>(null);
  const [p2Uri, setP2Uri] = useState<string | null>(null);
  const [p2Duration, setP2Duration] = useState(0);
  const [p2ReversedUri, setP2ReversedUri] = useState<string | null>(null);

  const [isReversingPlayer, setIsReversingPlayer] = useState<1 | 2 | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (p1Recording) {
      interval = setInterval(() => setP1Duration(prev => prev + 1), 1000);
    } else if (p2Recording) {
      interval = setInterval(() => setP2Duration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [p1Recording, p2Recording]);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  async function startRecording(player: 1 | 2) {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      
      if (player === 1) {
        setP1Recording(recording);
        setP1Uri(null);
        setP1Duration(0);
        // Reset Player 2 when Player 1 records again
        setP2Uri(null);
        setP2Duration(0);
      } else {
        setP2Recording(recording);
        setP2Uri(null);
        setP2Duration(0);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording(player: 1 | 2) {
    try {
      if (player === 1 && p1Recording) {
        await p1Recording.stopAndUnloadAsync();
        setP1Uri(p1Recording.getURI());
        setP1Recording(null);
        setActiveStep('playerTwo');
      } else if (player === 2 && p2Recording) {
        await p2Recording.stopAndUnloadAsync();
        setP2Uri(p2Recording.getURI());
        setP2Recording(null);
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  async function playSound(uri: string | null, rate: number = 1.0) {
    if (!uri) return;
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync({ uri }, { rate, shouldCorrectPitch: false });
    setSound(newSound);
    await newSound.playAsync();
  }

  async function reverseAudioBackend(uri: string, player: 1 | 2) {
    if (!uri) return;
    try {
      setIsReversingPlayer(player);
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const reverseFn = httpsCallable(functionsApi, 'reverseAudio');
      const result = await reverseFn({ audioBase64: base64Audio });
      const { audioBase64: reversedBase64 } = result.data as any;

      const outputPath = FileSystem.documentDirectory + `reversed_${player}_${Date.now()}.m4a`;
      await FileSystem.writeAsStringAsync(outputPath, reversedBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (player === 1) {
        setP1ReversedUri(outputPath);
      } else {
        setP2ReversedUri(outputPath);
      }
    } catch (e) {
      console.error("Reversing failed", e);
      alert("Failed to reverse audio.");
    } finally {
      setIsReversingPlayer(null);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Player 1 Card */}
      <View style={[styles.card, activeStep === 'playerOne' && styles.cardActive, activeStep !== 'playerOne' && { opacity: 0.76 }]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Player 1</Text>
            <Text style={styles.cardSubtitle}>record anything you want</Text>
          </View>
          <View style={[styles.statusPill, activeStep === 'playerOne' ? styles.statusActive : styles.statusInactive]}>
            <Text style={styles.statusText}>{activeStep === 'playerOne' ? 'Active' : 'Done'}</Text>
          </View>
        </View>

        {p1Uri && (
          <View style={styles.waveformContainer}>
            <View style={styles.waveformBars}>
              {WAVEFORM_BARS.map((val, i) => (
                <View key={i} style={[styles.waveformBar, { height: Math.max(5, val * 24) }]} />
              ))}
            </View>
            <Text style={styles.durationText}>{p1Duration}.0s</Text>
          </View>
        )}

        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <Pressable 
              style={[styles.squareBtn, { backgroundColor: p1Recording ? '#8E1C16' : Colors.red }]}
              onPress={() => p1Recording ? stopRecording(1) : startRecording(1)}
            >
              <IconSymbol name={p1Recording ? "stop.fill" : "record.circle.fill"} size={28} color="white" />
              <Text style={styles.btnText}>{p1Recording ? `${p1Duration}s / 60s` : "Record"}</Text>
            </Pressable>

            <Pressable 
              style={[styles.circleBtn, !p1Uri && styles.disabled]}
              onPress={() => playSound(p1Uri)}
              disabled={!p1Uri}
            >
              <IconSymbol name="play.fill" size={24} color="white" />
            </Pressable>
          </View>

          <View style={styles.gridRow}>
            <Pressable 
              style={[styles.squareBtn, { backgroundColor: '#007AFF' }, (!p1Uri || isReversingPlayer === 1) && styles.disabled]}
              onPress={() => {
                if (p1ReversedUri) {
                  playSound(p1ReversedUri);
                } else {
                  reverseAudioBackend(p1Uri!, 1);
                }
              }}
              disabled={!p1Uri || isReversingPlayer === 1}
            >
              {isReversingPlayer === 1 ? (
                <ActivityIndicator color="white" />
              ) : (
                <IconSymbol name="backward.fill" size={28} color="white" />
              )}
              <Text style={styles.btnText}>{p1ReversedUri ? "Play Reversed" : "Generate Reverse"}</Text>
            </Pressable>

            <Pressable 
              style={[styles.circleBtn, !p1Uri && styles.disabled]}
              onPress={() => playSound(p1Uri, 2.0)}
              disabled={!p1Uri}
            >
              <IconSymbol name="hare.fill" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Player 2 Card */}
      <View style={[styles.card, activeStep === 'playerTwo' && styles.cardActive, activeStep !== 'playerTwo' && { opacity: 0.76 }]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Player 2</Text>
            <Text style={styles.cardSubtitle}>try to copy reversed</Text>
            {activeStep === 'playerTwo' && !p2Uri && !p2Recording && (
              <Text style={styles.helperText}>Listen and record the mimic.</Text>
            )}
          </View>
          <View style={[styles.statusPill, activeStep === 'playerTwo' ? styles.statusActive : styles.statusWaiting]}>
            <Text style={styles.statusText}>{activeStep === 'playerTwo' ? 'Active' : 'Waiting'}</Text>
          </View>
        </View>

        {p2Uri && (
          <View style={styles.waveformContainer}>
            <View style={styles.waveformBars}>
              {WAVEFORM_BARS.slice().reverse().map((val, i) => (
                <View key={i} style={[styles.waveformBar, { height: Math.max(5, val * 24), backgroundColor: '#AF52DE' }]} />
              ))}
            </View>
            <Text style={styles.durationText}>{p2Duration}.0s</Text>
          </View>
        )}

        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <Pressable 
              style={[styles.squareBtn, { backgroundColor: p2Recording ? '#8E1C16' : Colors.red }, activeStep !== 'playerTwo' && styles.disabled]}
              onPress={() => p2Recording ? stopRecording(2) : startRecording(2)}
              disabled={activeStep !== 'playerTwo'}
            >
              <IconSymbol name={p2Recording ? "stop.fill" : "record.circle.fill"} size={28} color="white" />
              <Text style={styles.btnText}>{p2Recording ? `${p2Duration}s / 60s` : "Record Mimic"}</Text>
            </Pressable>

            <Pressable 
              style={[styles.circleBtn, !p2Uri && styles.disabled]}
              onPress={() => playSound(p2Uri)}
              disabled={!p2Uri}
            >
              <IconSymbol name="play.fill" size={24} color="white" />
            </Pressable>
          </View>

          <View style={styles.gridRow}>
            <Pressable 
              style={[styles.squareBtn, { backgroundColor: Colors.green }, (!p2Uri || isReversingPlayer === 2) && styles.disabled]}
              onPress={() => {
                if (p2ReversedUri) {
                  playSound(p2ReversedUri);
                } else {
                  reverseAudioBackend(p2Uri!, 2);
                }
              }}
              disabled={!p2Uri || isReversingPlayer === 2}
            >
              {isReversingPlayer === 2 ? (
                <ActivityIndicator color="white" />
              ) : (
                <IconSymbol name="sparkles" size={28} color="white" />
              )}
              <Text style={styles.btnText}>{p2ReversedUri ? "Play Result" : "Generate Result"}</Text>
            </Pressable>

            <Pressable 
              style={[styles.circleBtn, !p2Uri && styles.disabled]}
              onPress={() => alert('Share sheet would open here')}
              disabled={!p2Uri}
            >
              <IconSymbol name="square.and.arrow.up" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* History Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>History</Text>
            <Text style={styles.cardSubtitle}>Last 20 only</Text>
          </View>
          <Pressable style={styles.openBtn}>
            <Text style={styles.openBtnText}>Open</Text>
          </Pressable>
        </View>

        {p2Uri ? (
          <View style={styles.historyRow}>
            <View style={styles.historyDate}>
              <Text style={styles.historyDateText}>Just now</Text>
            </View>
            <View style={styles.historyActions}>
              <Pressable style={[styles.historyCircleBtn, { backgroundColor: '#FF2D55' }]} onPress={() => playSound(p2Uri)}>
                <IconSymbol name="mic.fill" size={16} color="white" />
              </Pressable>
              <Pressable style={[styles.historyCircleBtn, { backgroundColor: '#007AFF' }]} onPress={() => playSound(p2Uri)}>
                <IconSymbol name="sparkles" size={16} color="white" />
              </Pressable>
              <Pressable style={styles.historyCircleBtn} onPress={() => alert('Share')}>
                <IconSymbol name="ellipsis" size={16} color="white" />
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyHistory}>No history yet.</Text>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardActive: {
    borderColor: 'rgba(52, 199, 89, 0.4)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 2,
  },
  helperText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  statusInactive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statusWaiting: {
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  waveformBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waveformBar: {
    width: 3,
    backgroundColor: Colors.green,
    borderRadius: 2,
  },
  durationText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  squareBtn: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 100,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  circleBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
  openBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  openBtnText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyHistory: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    paddingVertical: 20,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    borderRadius: 16,
  },
  historyDate: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  historyDateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  historyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  historyCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
