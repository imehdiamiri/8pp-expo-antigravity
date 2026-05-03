import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface SurfaceCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const SurfaceCard = ({ children, style }: SurfaceCardProps) => (
  <BlurView tint="dark" intensity={40} style={[styles.surfaceCard, style]}>
    {children}
  </BlurView>
);

const styles = StyleSheet.create({
  surfaceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});
