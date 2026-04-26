import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  isSoundEnabled: boolean;
  isVibrationEnabled: boolean;
  hasCompletedOnboarding: boolean;
  playerName: string;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setPlayerName: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isSoundEnabled: true,
      isVibrationEnabled: true,
      hasCompletedOnboarding: false,
      playerName: '',
      setSoundEnabled: (enabled) => set({ isSoundEnabled: enabled }),
      setVibrationEnabled: (enabled) => set({ isVibrationEnabled: enabled }),
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
      setPlayerName: (name) => set({ playerName: name }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
