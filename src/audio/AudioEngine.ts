import { Audio } from 'expo-av';
import { CloudSoundManager } from './CloudSoundManager';
import { Sound } from '../types/sound';

export class AudioEngine {
  private static soundInstances: Map<string, Audio.Sound> = new Map();

  static async playSound(sound: Sound, volume: number = 1.0) {
    try {
      let source: any;

      if (sound.url) {
        const localUri = await CloudSoundManager.getSoundUri(sound.id, sound.url);
        source = { uri: localUri };
      } else if (sound.localAsset) {
        source = sound.localAsset;
      } else {
        throw new Error('No audio source found for sound: ' + sound.title);
      }

      const { sound: soundInstance } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: true, isLooping: true, volume },
        this.onPlaybackStatusUpdate
      );

      this.soundInstances.set(sound.id, soundInstance);
    } catch (error) {
      console.error('Playback Error:', error);
      throw error;
    }
  }

  static async stopSound(soundId: string) {
    const soundInstance = this.soundInstances.get(soundId);
    if (soundInstance) {
      await soundInstance.stopAsync();
      await soundInstance.unloadAsync();
      this.soundInstances.delete(soundId);
    }
  }

  static async setVolume(soundId: string, volume: number) {
    const soundInstance = this.soundInstances.get(soundId);
    if (soundInstance) {
      await soundInstance.setVolumeAsync(volume);
    }
  }

  static async fadeOutAndStopAll(durationMs: number = 5000) {
    const interval = 100;
    const steps = durationMs / interval;

    // Using exponential decay for natural sound reduction
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const volumeFactor = Math.pow(1 - progress, 2); // Exponential curve

      for (const [soundId, instance] of this.soundInstances.entries()) {
        try {
          const status: any = await instance.getStatusAsync();
          if (status.isLoaded) {
             // We'd need to track original volume to be precise, but for stop-all we fade towards 0
             await instance.setVolumeAsync(volumeFactor * (status.volume || 1));
          }
        } catch (e) {
          console.warn('Fade step failed', e);
        }
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    await this.stopAll();
  }

  private static onPlaybackStatusUpdate(status: any) {
    if (status.error) {
      console.error(`Playback error: ${status.error}`);
    }
  }

  static async stopAll() {
    for (const soundId of Array.from(this.soundInstances.keys())) {
      await this.stopSound(soundId);
    }
  }
}
