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
};

export const Typography = {
  viralTitle: {
    fontFamily: 'System', // Will map to San Francisco on iOS
    fontWeight: '900' as const, // .black
  },
};
