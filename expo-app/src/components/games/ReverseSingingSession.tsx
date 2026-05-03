import { Colors } from '@/src/theme/Colors';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert, AppState, AppStateStatus } from 'react-native';
import { GameSession } from '@/src/store/useGameStore';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Platform-safe imports
let Audio: any = null;
let FileSystem: any = null;
let Sharing: any = null;

if (Platform.OS !== 'web') {
  try { Audio = require('expo-av').Audio; } catch {}
  try { FileSystem = require('expo-file-system'); } catch {}
  try { Sharing = require('expo-sharing'); } catch {}
}

interface Props {
  session: GameSession;
}

const MAX_RECORD_SECONDS = 60;
const WAVEFORM_BARS = [0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.3, 0.6, 0.5];

// ─── WAV PCM Reversal ────────────────────────────────────
// Reads a WAV file (recorded as LINEAR_PCM / WAV), reverses
// the sample data at the byte level, writes a new file.

async function reverseWavFile(inputUri: string): Promise<string | null> {
  if (!FileSystem) return null;

  try {
    // Read the full file as base64
    const base64 = await FileSystem.readAsStringAsync(inputUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Decode base64 → byte array
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // Parse WAV header (standard 44-byte RIFF header)
    // Validate it's a WAV: "RIFF" at offset 0, "WAVE" at offset 8
    const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    const wave = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);

    if (riff !== 'RIFF' || wave !== 'WAVE') {
      console.warn('reverseWavFile: Not a valid WAV file, skipping reversal');
      return null;
    }

    // Find the "data" chunk — usually starts at byte 36, but search for it
    let dataOffset = 12;
    let dataSize = 0;
    while (dataOffset < bytes.length - 8) {
      const chunkId = String.fromCharCode(
        bytes[dataOffset], bytes[dataOffset + 1],
        bytes[dataOffset + 2], bytes[dataOffset + 3]
      );
      const chunkSize = bytes[dataOffset + 4] |
        (bytes[dataOffset + 5] << 8) |
        (bytes[dataOffset + 6] << 16) |
        (bytes[dataOffset + 7] << 24);

      if (chunkId === 'data') {
        dataOffset += 8; // skip "data" + size field
        dataSize = chunkSize;
        break;
      }
      dataOffset += 8 + chunkSize;
    }

    if (dataSize === 0) {
      console.warn('reverseWavFile: Could not find data chunk');
      return null;
    }

    // Get bits per sample (byte 34-35 in standard WAV header)
    const bitsPerSample = bytes[34] | (bytes[35] << 8);
    const bytesPerSample = bitsPerSample / 8;
    const numChannels = bytes[22] | (bytes[23] << 8);
    const blockAlign = bytesPerSample * numChannels;

    // Reverse the audio samples in the data section
    const reversed = new Uint8Array(bytes.length);
    reversed.set(bytes); // copy full file including header

    const numSamples = Math.floor(dataSize / blockAlign);
    for (let i = 0; i < numSamples; i++) {
      const srcOffset = dataOffset + i * blockAlign;
      const dstOffset = dataOffset + (numSamples - 1 - i) * blockAlign;
      for (let b = 0; b < blockAlign; b++) {
        reversed[dstOffset + b] = bytes[srcOffset + b];
      }
    }

    // Encode back to base64
    let reversedBinary = '';
    for (let i = 0; i < reversed.length; i++) {
      reversedBinary += String.fromCharCode(reversed[i]);
    }
    const reversedBase64 = btoa(reversedBinary);

    // Write to a new file
    const outputUri = inputUri.replace(/\.wav$/i, '_reversed.wav');
    await FileSystem.writeAsStringAsync(outputUri, reversedBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return outputUri;
  } catch (err) {
    console.error('reverseWavFile error:', err);
    return null;
  }
}

// ─── Component ───────────────────────────────────────────

export function ReverseSingingSession({ session }: Props) {
  const [activeStep, setActiveStep] = useState<'playerOne' | 'playerTwo'>('playerOne');

  // Player 1 State
  const [p1Recording, setP1Recording] = useState<any>(null);
  const [p1Uri, setP1Uri] = useState<string | null>(null);
  const [p1ReversedUri, setP1ReversedUri] = useState<string | null>(null);
  const [p1Duration, setP1Duration] = useState(0);
  const [p1Reversing, setP1Reversing] = useState(false);

  // Player 2 State
  const [p2Recording, setP2Recording] = useState<any>(null);
  const [p2Uri, setP2Uri] = useState<string | null>(null);
  const [p2ReversedUri, setP2ReversedUri] = useState<string | null>(null);
  const [p2Duration, setP2Duration] = useState(0);
  const [p2Reversing, setP2Reversing] = useState(false);

  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs for cleanup
  const p1RecRef = useRef<any>(null);
  const p2RecRef = useRef<any>(null);

  // ── Request mic permission on mount ──
  useEffect(() => {
    if (!Audio) return;
    (async () => {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert(
          'Microphone Access Needed',
          'This game needs microphone access to record audio. Please enable it in Settings.'
        );
      }
    })();
  }, []);

  // ── Recording timer with 60s auto-stop ──
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (p1Recording) {
      interval = setInterval(() => {
        setP1Duration(prev => {
          if (prev + 1 >= MAX_RECORD_SECONDS) {
            stopRecording(1);
            return MAX_RECORD_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (p2Recording) {
      interval = setInterval(() => {
        setP2Duration(prev => {
          if (prev + 1 >= MAX_RECORD_SECONDS) {
            stopRecording(2);
            return MAX_RECORD_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [p1Recording, p2Recording]);

  // ── Sound cleanup on change ──
  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  // ── Stop recording on app background ──
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state !== 'active') {
        if (p1RecRef.current) stopRecording(1);
        if (p2RecRef.current) stopRecording(2);
      }
    });
    return () => sub.remove();
  }, []);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (p1RecRef.current) {
        try { p1RecRef.current.stopAndUnloadAsync(); } catch {}
      }
      if (p2RecRef.current) {
        try { p2RecRef.current.stopAndUnloadAsync(); } catch {}
      }
      if (sound) {
        try { sound.unloadAsync(); } catch {}
      }
    };
  }, []);

  // ── Recording ──
  async function startRecording(player: 1 | 2) {
    if (!Audio) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Record as WAV (LINEAR PCM) so we can reverse the samples
      const recordingOptions = {
        isMeteringEnabled: false,
        android: {
          extension: '.wav',
          outputFormat: 6, // DEFAULT
          audioEncoder: 0, // DEFAULT (PCM)
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 705600,
        },
        ios: {
          extension: '.wav',
          outputFormat: 'lpcm' as any,
          audioQuality: 127, // max
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 705600,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {},
      };

      const { recording } = await Audio.Recording.createAsync(recordingOptions);

      if (player === 1) {
        setP1Recording(recording);
        p1RecRef.current = recording;
        setP1Uri(null);
        setP1ReversedUri(null);
        setP1Duration(0);
        // Reset Player 2 when Player 1 records again
        setP2Uri(null);
        setP2ReversedUri(null);
        setP2Duration(0);
        setActiveStep('playerOne');
      } else {
        setP2Recording(recording);
        p2RecRef.current = recording;
        setP2Uri(null);
        setP2ReversedUri(null);
        setP2Duration(0);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Audio Error', 'Could not start recording. Please try again.');
    }
  }

  async function stopRecording(player: 1 | 2) {
    try {
      if (player === 1 && p1RecRef.current) {
        const rec = p1RecRef.current;
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        setP1Uri(uri);
        setP1Recording(null);
        p1RecRef.current = null;

        // Generate reversed audio in background
        if (uri) {
          setP1Reversing(true);
          const reversedUri = await reverseWavFile(uri);
          setP1ReversedUri(reversedUri);
          setP1Reversing(false);
        }

        setActiveStep('playerTwo');
      } else if (player === 2 && p2RecRef.current) {
        const rec = p2RecRef.current;
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        setP2Uri(uri);
        setP2Recording(null);
        p2RecRef.current = null;

        // Generate reversed audio (the "result")
        if (uri) {
          setP2Reversing(true);
          const reversedUri = await reverseWavFile(uri);
          setP2ReversedUri(reversedUri);
          setP2Reversing(false);
        }
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  // ── Playback ──
  async function playSound(uri: string | null, rate: number = 1.0) {
    if (!uri || !Audio) return;
    try {
      if (sound) await sound.unloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { rate, shouldCorrectPitch: rate !== 1.0 }
      );
      setSound(newSound);
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) setIsPlaying(false);
      });
      await newSound.playAsync();
    } catch (err) {
      console.error('Playback error:', err);
      setIsPlaying(false);
    }
  }

  // ── Sharing ──
  async function handleShare(uri: string | null) {
    if (!uri || !Sharing) {
      Alert.alert('Share', 'No audio to share yet.');
      return;
    }
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Sharing not available on this device');
      return;
    }
    await Sharing.shareAsync(uri, { mimeType: 'audio/wav', dialogTitle: 'Share Recording' });
  }

  function showShareOptions() {
    const options: { label: string; uri: string | null }[] = [];
    if (p2Uri) options.push({ label: 'Share Player 2 Raw Mimic', uri: p2Uri });
    if (p2ReversedUri) options.push({ label: 'Share Result (Reversed Mimic)', uri: p2ReversedUri });
    else if (p1ReversedUri) options.push({ label: 'Share Reversed Player 1', uri: p1ReversedUri });

    if (options.length === 0) {
      Alert.alert('Nothing to share yet');
      return;
    }

    if (options.length === 1) {
      handleShare(options[0].uri);
      return;
    }

    Alert.alert('Share', 'Choose what to share', [
      ...options.map(opt => ({
        text: opt.label,
        onPress: () => handleShare(opt.uri),
      })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
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
              <Text style={styles.btnText}>{p1Recording ? `${p1Duration}s / ${MAX_RECORD_SECONDS}s` : "Record"}</Text>
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
              style={[styles.squareBtn, { backgroundColor: '#007AFF' }, (!p1ReversedUri && !p1Reversing) && styles.disabled]}
              onPress={() => playSound(p1ReversedUri)}
              disabled={!p1ReversedUri}
            >
              <IconSymbol name="backward.fill" size={28} color="white" />
              <Text style={styles.btnText}>{p1Reversing ? 'Reversing…' : 'Play Reverse'}</Text>
            </Pressable>

            <Pressable 
              style={[styles.circleBtn, !p1ReversedUri && styles.disabled]}
              onPress={() => playSound(p1ReversedUri, 0.5)}
              disabled={!p1ReversedUri}
            >
              <IconSymbol name="tortoise.fill" size={24} color="white" />
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
              <Text style={styles.btnText}>{p2Recording ? `${p2Duration}s / ${MAX_RECORD_SECONDS}s` : "Record Mimic"}</Text>
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
              style={[styles.squareBtn, { backgroundColor: Colors.green }, (!p2ReversedUri && !p2Reversing) && styles.disabled]}
              onPress={() => playSound(p2ReversedUri || p1ReversedUri)}
              disabled={!p2ReversedUri && !p1ReversedUri}
            >
              <IconSymbol name="sparkles" size={28} color="white" />
              <Text style={styles.btnText}>{p2Reversing ? 'Reversing…' : 'Result'}</Text>
            </Pressable>

            <Pressable 
              style={[styles.circleBtn, (!p2Uri && !p2ReversedUri) && styles.disabled]}
              onPress={showShareOptions}
              disabled={!p2Uri && !p2ReversedUri}
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
              <Pressable style={[styles.historyCircleBtn, { backgroundColor: '#007AFF' }]} onPress={() => playSound(p2ReversedUri || p2Uri)}>
                <IconSymbol name="sparkles" size={16} color="white" />
              </Pressable>
              <Pressable style={styles.historyCircleBtn} onPress={showShareOptions}>
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
