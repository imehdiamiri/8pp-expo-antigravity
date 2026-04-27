import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';

/**
 * WebButton — A cross-platform pressable component that ACTUALLY works on web.
 * 
 * React Native's Pressable and TouchableOpacity both render as non-interactive
 * divs in some React Native Web versions. This component uses the `accessibilityRole`
 * and `onStartShouldSetResponder` pattern to ensure click events fire on web.
 */

interface WebButtonProps {
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  children: React.ReactNode;
}

export function WebButton({ onPress, style, disabled, children }: WebButtonProps) {
  if (Platform.OS === 'web') {
    return (
      <div
        onClick={disabled ? undefined : onPress}
        style={{
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          ...(style ? flattenStyle(style) : {}),
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e: any) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onPress();
          }
        }}
      >
        {children}
      </div>
    );
  }

  // Native fallback (not used since .web.tsx only runs on web, but for safety)
  return (
    <View
      style={style as any}
      onStartShouldSetResponder={() => true}
      onResponderRelease={disabled ? undefined : onPress}
    >
      {children}
    </View>
  );
}

// Flatten RN style arrays into a single object for DOM use
function flattenStyle(style: ViewStyle | ViewStyle[]): Record<string, any> {
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => {
      if (s) return { ...acc, ...flattenWebStyle(s) };
      return acc;
    }, {} as Record<string, any>);
  }
  return flattenWebStyle(style);
}

function flattenWebStyle(style: ViewStyle): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined || value === null) continue;
    
    // Convert RN style keys to CSS
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    
    // Handle numeric values that need px
    if (typeof value === 'number' && !['opacity', 'flex', 'zIndex', 'fontWeight'].includes(key)) {
      result[cssKey] = `${value}px`;
    } else {
      result[cssKey] = value;
    }
  }
  return result;
}
