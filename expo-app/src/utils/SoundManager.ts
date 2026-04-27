import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

class SoundManager {
  private sounds: Record<string, Audio.Sound> = {};

  async loadSound(key: string, asset: any) {
    try {
      const { sound } = await Audio.Sound.createAsync(asset);
      this.sounds[key] = sound;
    } catch (e) {
      console.log('Failed to load sound', e);
    }
  }

  async playSound(key: string) {
    try {
      const sound = this.sounds[key];
      if (sound) {
        await sound.replayAsync();
      }
    } catch (e) {
      console.log('Failed to play sound', e);
    }
  }

  // Common interactions
  playButtonTap() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.playSound('tap');
  }

  playSuccess() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    this.playSound('success');
  }
  
  playDiceRoll() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    this.playSound('dice');
  }

  playCoinFlip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    this.playSound('coin');
  }
}

export const soundManager = new SoundManager();
