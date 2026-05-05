import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, platformShadow } from '@/src/theme/Colors';

// Platform-safe BlurView
let BlurView: any = null;
if (Platform.OS === 'ios') {
  try { BlurView = require('expo-blur').BlurView; } catch {}
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.tabBarContainer, { bottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20 }]}>
      {/* Background: BlurView on iOS, solid gradient on Android */}
      <View style={[StyleSheet.absoluteFill, { borderRadius: 36, overflow: 'hidden' }]}>
        {Platform.OS === 'ios' && BlurView ? (
          <>
            <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFill} />
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
          </>
        ) : (
          <LinearGradient
            colors={['rgba(22, 22, 32, 0.97)', 'rgba(13, 13, 20, 0.98)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>
      
      <View style={styles.tabBarContent}>
        {state.routes.map((route: any, index: number) => {
          if (!['index', 'tools', 'friends', 'factory'].includes(route.name)) {
            return null;
          }
          
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          
          const onPress = () => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: any = 'gamecontroller.fill';
          if (route.name === 'tools') iconName = 'wrench.and.screwdriver.fill';
          if (route.name === 'friends') iconName = 'person.2.fill';
          if (route.name === 'factory') iconName = 'wand.and.stars';

          const color = isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isFocused && styles.activePill]}>
                <IconSymbol size={22} name={iconName} color={color} />
                <Text style={[styles.label, isFocused && styles.activeLabel]}>
                  {options.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Games' }} />
      <Tabs.Screen name="tools" options={{ title: 'Tools' }} />
      <Tabs.Screen name="friends" options={{ title: 'Friends' }} />
      <Tabs.Screen name="factory" options={{ title: 'Factory' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.10)' : 'rgba(255, 255, 255, 0.12)',
    ...platformShadow(12, '#000', 0.4, 20),
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 23,
    gap: 2,
  },
  activePill: {
    backgroundColor: 'rgba(10, 132, 255, 0.25)',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
