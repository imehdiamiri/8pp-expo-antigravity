import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '../theme/Colors';

const { width, height } = Dimensions.get('window');

export const AppBackgroundView = () => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
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
