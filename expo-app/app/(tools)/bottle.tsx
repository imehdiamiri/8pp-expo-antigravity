import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BottleToolScreen() {
  const [names, setNames] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const bottleAngle = useSharedValue(0);

  const addName = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setNames(prev => [...prev, trimmed]);
    setDraft('');
    Haptics.selectionAsync();
    Keyboard.dismiss();
  };

  const removeName = (index: number) => {
    setNames(prev => prev.filter((_, i) => i !== index));
    if (selectedIndex === index) setSelectedIndex(null);
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedIndex(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const hasNames = names.length > 0;
    const target = hasNames ? Math.floor(Math.random() * names.length) : 0;
    const perSlice = hasNames ? 360 / names.length : 0;
    const baseRotations = (Math.floor(Math.random() * 5) + 10) * 360; // 10 to 14 rotations
    const targetAngle = perSlice * target;
    const jitter = hasNames ? (Math.random() * (perSlice * 0.5) - (perSlice * 0.25)) : (Math.random() * 360);
    
    const normalized = bottleAngle.value % 360;
    const nextAngle = bottleAngle.value - normalized + baseRotations + targetAngle + jitter;

    bottleAngle.value = withTiming(nextAngle, {
      duration: 8000,
      easing: Easing.bezier(0.15, 0.45, 0.2, 1.0)
    }, (finished) => {
      if (finished) {
        if (hasNames) {
          // Can't set state directly in worklet so we use runOnJS, or just setTimeout since we know duration is 8000
        }
      }
    });

    setTimeout(() => {
      if (hasNames) {
        setSelectedIndex(target);
      }
      setIsSpinning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 8050);
  };

  const size = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) - 32;
  const radius = size / 2 - 44;

  const bottleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${bottleAngle.value}deg` }]
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a name"
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={addName}
          returnKeyType="done"
        />
        <TouchableOpacity 
          style={[styles.addButton, !draft.trim() && { opacity: 0.5 }]} 
          onPress={addName}
          disabled={!draft.trim()}
        >
          <IconSymbol name="plus" size={20} color="white" weight="black" />
        </TouchableOpacity>
      </View>

      {names.length > 0 && (
        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {names.map((name, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{name}</Text>
                <TouchableOpacity onPress={() => removeName(i)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <IconSymbol name="xmark" size={10} color="white" weight="black" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ flex: 1 }} />

      <View style={[styles.wheelContainer, { width: size, height: size }]}>
        {/* Glow */}
        <View style={styles.glow} />

        {/* Names */}
        {names.length > 0 && names.map((name, index) => {
          const angle = (360 / names.length) * index - 90;
          const radians = (angle * Math.PI) / 180;
          const x = Math.cos(radians) * radius;
          const y = Math.sin(radians) * radius;
          const isSelected = selectedIndex === index;

          return (
            <Animated.View
              key={index}
              style={[
                styles.namePositioner,
                { transform: [{ translateX: x }, { translateY: y }] }
              ]}
            >
              {isSelected ? (
                <View style={styles.selectedPill}>
                  <Text style={styles.selectedPillText}>{name}</Text>
                </View>
              ) : (
                <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
              )}
            </Animated.View>
          );
        })}

        {/* Bottle */}
        <Animated.View style={[styles.bottleWrapper, bottleAnimatedStyle]}>
          <Image
            source={{ uri: "https://r2-pub.rork.com/generated-images/fd6d9d25-4377-42da-abad-0212755191ca.png" }}
            style={{ width: size * 0.3, height: size * 0.72 }}
            contentFit="contain"
          />
        </Animated.View>
      </View>

      <View style={{ flex: 1 }} />

      {names.length === 0 && (
        <Text style={styles.emptyText}>Add names to spin</Text>
      )}

      <View style={styles.bottomArea}>
        <TouchableOpacity onPress={spin} disabled={isSpinning} activeOpacity={0.8} style={styles.spinButtonWrapper}>
          <LinearGradient colors={['#FF2D55', '#AF52DE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.spinButton}>
            <IconSymbol name="arrow.triangle.2.circlepath" size={18} color="white" weight="heavy" />
            <Text style={styles.spinButtonText}>{isSpinning ? 'Spinning...' : 'Spin'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FF2D55',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsContainer: {
    marginTop: 14,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  wheelContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    backgroundColor: 'rgba(255, 45, 85, 0.2)',
    borderRadius: 999,
    shadowColor: '#AF52DE',
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  namePositioner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100, // max width roughly
  },
  nameText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedPill: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedPillText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottleWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  spinButtonWrapper: {
    width: '100%',
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
  },
  spinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 30,
  },
  spinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },
});
