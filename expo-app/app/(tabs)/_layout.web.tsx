import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function WebTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5AC8FA',
        tabBarInactiveTintColor: '#555',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d0d15',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.06)',
          height: 56,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 20 }}>🎮</span>,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 20 }}>🛠</span>,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 20 }}>👥</span>,
        }}
      />
      <Tabs.Screen
        name="factory"
        options={{
          title: 'Factory',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 20 }}>✨</span>,
        }}
      />
    </Tabs>
  );
}
