import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { GameSession } from '@/src/store/useGameStore';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Props {
  session: GameSession;
}

export function ReverseSingingSession({ session }: Props) {
  const [activeStep, setActiveStep] = useState<'playerOne' | 'playerTwo'>('playerOne');
  
  // Player 1 State
  const [p1Recording, setP1Recording] = useState<Audio.Recording | null>(null);
  const [p1Uri, setP1Uri] = useState<string | null>(null);
  const [isP1Playing, setIsP1Playing] = useState(false);

  // Player 2 State
  const [p2Recording, setP2Recording] = useState<Audio.Recording | null>(null);
  const [p2Uri, setP2Uri] = useState<string | null>(null);
  const [isP2Playing, setIsP2Playing] = useState(false);

  // General audio
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function startRecording(player: 1 | 2) {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY );
      if (player === 1) {
        setP1Recording(recording);
        setP1Uri(null);
      } else {
        setP2Recording(recording);
        setP2Uri(null);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording(player: 1 | 2) {
    try {
      if (player === 1 && p1Recording) {
        await p1Recording.stopAndUnloadAsync();
        const uri = p1Recording.getURI();
        setP1Uri(uri);
        setP1Recording(null);
        setActiveStep('playerTwo');
      } else if (player === 2 && p2Recording) {
        await p2Recording.stopAndUnloadAsync();
        const uri = p2Recording.getURI();
        setP2Uri(uri);
        setP2Recording(null);
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  async function playSound(uri: string | null) {
    if (!uri) return;
    
    // Stop current sound if playing
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    await newSound.playAsync();
  }

  // Placeholder for reversing audio - since RN can't do this easily natively without a custom module,
  // we'll just play it normally but tag the UI for it.
  async function playReversedSound(uri: string | null) {
    // In a real implementation, we'd send the audio to a server to reverse it or use a native module.
    // For now, just play it as normal to show the flow.
    alert("Audio reversing requires a native module. Playing original sound for now.");
    playSound(uri);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Player 1 Card */}
      <View style={[styles.card, activeStep === 'playerOne' && styles.cardActive]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Player 1</Text>
          <Text style={styles.cardSubtitle}>record anything you want</Text>
          {activeStep === 'playerOne' && <Text style={styles.statusActive}>Active</Text>}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.recordButton, p1Recording && styles.recordingButton]}
            onPress={() => p1Recording ? stopRecording(1) : startRecording(1)}
            disabled={activeStep !== 'playerOne' && !p1Uri}
          >
            <IconSymbol name={p1Recording ? "stop.fill" : "record.circle.fill"} size={24} color="white" />
            <Text style={styles.actionText}>{p1Recording ? "Stop" : "Record"}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, !p1Uri && styles.disabledButton]}
            onPress={() => playSound(p1Uri)}
            disabled={!p1Uri}
          >
            <IconSymbol name="play.fill" size={24} color="white" />
            <Text style={styles.actionText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, !p1Uri && styles.disabledButton, { backgroundColor: '#FF9500' }]}
            onPress={() => playReversedSound(p1Uri)}
            disabled={!p1Uri}
          >
            <IconSymbol name="backward.fill" size={24} color="white" />
            <Text style={styles.actionText}>Play Reverse</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Player 2 Card */}
      <View style={[styles.card, activeStep === 'playerTwo' && styles.cardActive, { opacity: activeStep === 'playerOne' ? 0.5 : 1 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Player 2</Text>
          <Text style={styles.cardSubtitle}>try to copy reversed</Text>
          {activeStep === 'playerTwo' ? (
            <Text style={styles.statusActive}>Active</Text>
          ) : (
            <Text style={styles.statusWaiting}>Waiting</Text>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.recordButton, p2Recording && styles.recordingButton, activeStep !== 'playerTwo' && styles.disabledButton]}
            onPress={() => p2Recording ? stopRecording(2) : startRecording(2)}
            disabled={activeStep !== 'playerTwo'}
          >
            <IconSymbol name={p2Recording ? "stop.fill" : "record.circle.fill"} size={24} color="white" />
            <Text style={styles.actionText}>{p2Recording ? "Stop" : "Record Mimic"}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, !p2Uri && styles.disabledButton]}
            onPress={() => playSound(p2Uri)}
            disabled={!p2Uri}
          >
            <IconSymbol name="play.fill" size={24} color="white" />
            <Text style={styles.actionText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, !p2Uri && styles.disabledButton, { backgroundColor: '#AF52DE' }]}
            onPress={() => playReversedSound(p2Uri)}
            disabled={!p2Uri}
          >
            <IconSymbol name="sparkles" size={24} color="white" />
            <Text style={styles.actionText}>Result</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardActive: {
    borderColor: 'rgba(52, 199, 89, 0.5)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    marginTop: 4,
  },
  statusActive: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#34C759',
    fontWeight: '600',
  },
  statusWaiting: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#FF9500',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recordButton: {
    flex: 1,
    minWidth: '100%',
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recordingButton: {
    backgroundColor: '#8E1C16',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
});
