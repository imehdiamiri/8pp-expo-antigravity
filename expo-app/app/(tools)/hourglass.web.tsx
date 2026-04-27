import { Colors } from '@/src/theme/Colors';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PRESETS = [
  { label: '30s', seconds: 30 }, { label: '1min', seconds: 60 },
  { label: '2min', seconds: 120 }, { label: '5min', seconds: 300 }, { label: '10min', seconds: 600 },
];

export default function WebHourglassScreen() {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;

  const start = () => { setIsDone(false); setIsRunning(true); };
  const pause = () => { setIsRunning(false); clearInterval(intervalRef.current); };
  const reset = () => { setIsRunning(false); setIsDone(false); setRemaining(totalSeconds); clearInterval(intervalRef.current); };
  const selectPreset = (s: number) => { if (isRunning) return; setTotalSeconds(s); setRemaining(s); setIsDone(false); };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>PRESETS</Text>
      <View style={styles.presetsRow}>
        {PRESETS.map(p => (
          <TouchableOpacity key={p.label} onPress={() => selectPreset(p.seconds)}
            style={[styles.preset, totalSeconds === p.seconds && styles.presetActive]}>
            <Text style={[styles.presetText, totalSeconds === p.seconds && { color: '#000' }]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.timerArea}>
        <View style={styles.timerCircle}>
          <svg width="280" height="280" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="130" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="140" cy="140" r="130" fill="none" stroke={isDone ? Colors.red : Colors.cyan} strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 130}`}
              strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress)}`}
              strokeLinecap="round"
              transform="rotate(-90 140 140)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <View style={styles.timerTextContainer}>
            <Text style={[styles.timerText, isDone && { color: Colors.red }]}>
              {isDone ? "TIME'S UP!" : formatTime(remaining)}
            </Text>
            {isDone && <Text style={{ fontSize: 48 }}>⏰</Text>}
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity style={[styles.controlBtn, { backgroundColor: Colors.cyan }]} onPress={remaining > 0 ? start : reset}>
            <Text style={styles.controlBtnText}>{remaining > 0 && !isDone ? '▶ Start' : '🔄 Reset'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.controlBtn, { backgroundColor: Colors.orange }]} onPress={pause}>
            <Text style={styles.controlBtnText}>⏸ Pause</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.controlBtn, { backgroundColor: 'rgba(255,255,255,0.08)' }]} onPress={reset}>
          <Text style={[styles.controlBtnText, { color: 'white' }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 48, maxWidth: 500, alignSelf: 'center', width: '100%' },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  presetsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  preset: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', cursor: 'pointer' },
  presetActive: { backgroundColor: Colors.cyan },
  presetText: { color: 'white', fontSize: 15, fontWeight: '700' },
  timerArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  timerCircle: { position: 'relative', width: 280, height: 280, justifyContent: 'center', alignItems: 'center' },
  timerTextContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  timerText: { color: 'white', fontSize: 48, fontWeight: '800', fontFamily: 'monospace' },
  controls: { flexDirection: 'row', gap: 12 },
  controlBtn: { flex: 1, paddingVertical: 18, borderRadius: 16, alignItems: 'center', cursor: 'pointer' },
  controlBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
});
