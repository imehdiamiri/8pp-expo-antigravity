import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/Colors';

// Platform-safe BlurView import
let BlurView: any = null;
if (Platform.OS === 'ios') {
  try { BlurView = require('expo-blur').BlurView; } catch {}
}

const { width, height } = Dimensions.get('window');

export const AppBackgroundView = () => {
  if (Platform.OS === 'web') {
    return (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0a0f', zIndex: -999 }} pointerEvents="none">
        <View style={[styles.blob, { backgroundColor: 'rgba(191, 90, 242, 0.1)', top: '20%', left: '10%', width: width * 0.4, height: width * 0.4 }]} />
        <View style={[styles.blob, { backgroundColor: 'rgba(10, 132, 255, 0.1)', top: '60%', left: '80%', width: width * 0.5, height: width * 0.5 }]} />
      </View>
    );
  }

  // ─── Android: Use LinearGradient layers for a premium ambient look ───
  if (Platform.OS === 'android') {
    return (
      <View style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]} pointerEvents="none">
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#050508' }]} />
        
        {/* Ambient gradient blobs via LinearGradient (no BlurView needed) */}
        <LinearGradient
          colors={['rgba(191, 90, 242, 0.08)', 'transparent']}
          start={{ x: 0.0, y: 0.6 }}
          end={{ x: 0.7, y: 0.2 }}
          style={[StyleSheet.absoluteFillObject]}
        />
        <LinearGradient
          colors={['rgba(10, 132, 255, 0.06)', 'transparent']}
          start={{ x: 0.8, y: 0.3 }}
          end={{ x: 0.2, y: 0.9 }}
          style={[StyleSheet.absoluteFillObject]}
        />
        <LinearGradient
          colors={['rgba(102, 212, 207, 0.04)', 'transparent']}
          start={{ x: 0.9, y: 0.7 }}
          end={{ x: 0.1, y: 0.1 }}
          style={[StyleSheet.absoluteFillObject]}
        />

        {/* Vignette overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }

  // ─── iOS: Full blur mesh gradient (original) ───
  return (
    <View style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]} pointerEvents="none">
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: Colors.black }]} />
      
      {/* Simulated Mesh Gradient Nodes (Subtle) */}
      <View style={[styles.blob, { backgroundColor: 'rgba(191, 90, 242, 0.12)', top: '50%', left: '0%', width: width * 0.7, height: width * 0.7 }]} />
      <View style={[styles.blob, { backgroundColor: 'rgba(10, 132, 255, 0.1)', top: '35%', left: '45%', width: width * 0.6, height: width * 0.6 }]} />
      <View style={[styles.blob, { backgroundColor: 'rgba(102, 212, 207, 0.08)', top: '50%', left: '100%', width: width * 0.5, height: width * 0.5 }]} />
      <View style={[styles.blob, { backgroundColor: 'rgba(100, 210, 255, 0.05)', top: '100%', left: '100%', width: width * 0.8, height: width * 0.8 }]} />

      <BlurView intensity={100} style={StyleSheet.absoluteFillObject} tint="dark" />

      {/* Overlay LinearGradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    transform: [{ translateX: -width * 0.4 }, { translateY: -width * 0.4 }],
  },
});
