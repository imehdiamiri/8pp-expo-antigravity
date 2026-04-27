import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/theme/Colors';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.tabBarContainer, { bottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20 }]}>
      <View style={[StyleSheet.absoluteFill, { borderRadius: 36, overflow: 'hidden' }]}>
        <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFill} />
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
      </View>
      
      <View style={styles.tabBarContent}>
        {state.routes.map((route: any, index: number) => {
          if (!['index', 'tools', 'friends', 'factory'].includes(route.name)) {
            return null;
          }
          
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          
          const onPress = () => {
            if (process.env.EXPO_OS === 'ios' || Platform.OS === 'ios') {
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

          const color = isFocused ? '#0A84FF' : 'rgba(255, 255, 255, 0.5)';

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
                <IconSymbol size={32} name={iconName} color={color} />
                <Text style={[styles.label, isFocused && styles.activeLabel]}>{options.title}</Text>
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
    height: 70,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
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
    height: 54,
    width: 76,
    borderRadius: 27,
    gap: 3,
  },
  activePill: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#0A84FF',
    fontWeight: 'bold',
  },
});
