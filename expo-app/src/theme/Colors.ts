import { Platform } from 'react-native';

export const Colors = {
  black: '#000000',
  white: '#FFFFFF',
  blue: '#0A84FF',
  indigo: '#5E5CE6',
  purple: '#BF5AF2',
  mint: '#66D4CF',
  teal: '#64D2FF',
  pink: '#FF375F',
  red: '#FF453A',
  orange: '#FF9F0A',
  yellow: '#FFD60A',
  cyan: '#32ADE6',
  green: '#30D158',
  
  // Semantic UI Colors mirroring SwiftUI
  secondary: 'rgba(235, 235, 245, 0.6)',
  tertiary: 'rgba(235, 235, 245, 0.3)',
  
  // Backgrounds and overlays
  appBackground: '#000000',
  whiteOverlay5: 'rgba(255, 255, 255, 0.05)',
  whiteOverlay6: 'rgba(255, 255, 255, 0.06)',
  whiteOverlay8: 'rgba(255, 255, 255, 0.08)',
  whiteOverlay9: 'rgba(255, 255, 255, 0.09)',
  
  // Custom Blues
  primaryAction: 'rgba(10, 132, 255, 0.88)',
  blueOverlay14: 'rgba(10, 132, 255, 0.14)',

  // ─── Android-specific solid surface colors ───
  // Since Android can't render blur effects well,
  // use semi-transparent dark surfaces that look great on OLED.
  surface1: Platform.OS === 'android' ? '#0D0D12' : 'rgba(255, 255, 255, 0.05)',
  surface2: Platform.OS === 'android' ? '#111118' : 'rgba(255, 255, 255, 0.06)',
  surface3: Platform.OS === 'android' ? '#16161F' : 'rgba(255, 255, 255, 0.08)',
  surfaceBorder: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.06)',
};

export const Typography = {
  viralTitle: {
    fontFamily: 'Viral-Black',
    fontSize: 20,
  },
};

/**
 * Cross-platform shadow helper.
 * On iOS: uses `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`.
 * On Android: uses `elevation` + solid background.
 */
export function platformShadow(
  elevation: number = 6,
  color: string = '#000',
  opacity: number = 0.3,
  radius: number = 10
) {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: Math.max(2, elevation * 0.6) },
      shadowOpacity: opacity,
      shadowRadius: radius,
    };
  }
  return {
    elevation,
  };
}
