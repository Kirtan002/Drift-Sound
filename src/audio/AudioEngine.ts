import { Audio } from 'expo-av'
import { soundAssets } from './soundAssets'
import { cloudSoundManager } from './CloudSoundManager'

type SoundInstance = Audio.Sound

class AudioEngineClass {
  private sounds: Map<string, SoundInstance> = new Map()
  private masterVolume: number = 1
  private initialized: boolean = false

  async initialize() {
    if (this.initialized) return
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    })
    this.initialized = true
  }

  async loadSound(id: string, file: string): Promise<boolean> {
    if (this.sounds.has(id)) return true

    const filename = file.endsWith('.mp3') ? file : file + '.mp3'
    const asset = soundAssets[filename]

    if (asset) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          asset,
          { isLooping: true, shouldPlay: false, volume: 0 }
        )
        this.sounds.set(id, sound)
        return true
      } catch {
        return false
      }
    }

    const localPath = await cloudSoundManager.getLocalPath(id)
    if (!localPath) return false

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: localPath },
        { isLooping: true, shouldPlay: false, volume: 0 }
      )
      this.sounds.set(id, sound)
      return true
    } catch {
      return false
    }
  }

  async playSound(id: string): Promise<boolean> {
    const sound = this.sounds.get(id)
    if (!sound) return false
    try {
      await sound.playAsync()
      return true
    } catch {
      return false
    }
  }

  async stopSound(id: string): Promise<boolean> {
    const sound = this.sounds.get(id)
    if (!sound) return false
    try {
      await sound.stopAsync()
      return true
    } catch {
      return false
    }
  }

  async unloadSound(id: string): Promise<boolean> {
    const sound = this.sounds.get(id)
    if (!sound) return false
    try {
      await sound.unloadAsync()
      this.sounds.delete(id)
      return true
    } catch {
      return false
    }
  }

  async setVolume(id: string, volume: number): Promise<boolean> {
    const sound = this.sounds.get(id)
    if (!sound) return false
    try {
      await sound.setVolumeAsync(volume * this.masterVolume)
      return true
    } catch {
      return false
    }
  }

  async setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    const promises: Promise<boolean>[] = []
    this.sounds.forEach((_, id) => {
      promises.push(this.setVolume(id, 1))
    })
    await Promise.all(promises)
  }

  async fadeVolume(
    id: string,
    from: number,
    to: number,
    durationMs: number
  ): Promise<void> {
    const sound = this.sounds.get(id)
    if (!sound) return

    const steps = Math.min(40, Math.max(10, Math.floor(durationMs / 50)))
    const intervalMs = durationMs / steps

    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      let volume: number

      if (to > from) {
        volume = from + (to - from) * (t * t)
      } else if (to < from) {
        const eased = 1 - (1 - t) * (1 - t)
        volume = from + (to - from) * eased
      } else {
        volume = from
      }

      volume = Math.max(0, Math.min(1, volume)) * this.masterVolume

      try {
        await sound.setVolumeAsync(volume)
      } catch {
        return
      }

      if (i < steps) {
        await new Promise(r => setTimeout(r, intervalMs))
      }
    }
  }

  async pauseAll() {
    const promises: Promise<void>[] = []
    this.sounds.forEach(async (sound) => {
      try {
        promises.push(sound.pauseAsync().then(() => {}))
      } catch {}
    })
    await Promise.all(promises)
  }

  async resumeAll() {
    const promises: Promise<void>[] = []
    this.sounds.forEach(async (sound) => {
      try {
        promises.push(sound.playAsync().then(() => {}))
      } catch {}
    })
    await Promise.all(promises)
  }

  async stopAll() {
    const promises: Promise<void>[] = []
    this.sounds.forEach(async (sound) => {
      try {
        promises.push(sound.stopAsync().then(() => {}))
      } catch {}
    })
    await Promise.all(promises)
  }

  async unloadAll() {
    await this.stopAll()
    const promises: Promise<void>[] = []
    this.sounds.forEach(async (sound) => {
      try {
        promises.push(sound.unloadAsync().then(() => {}))
      } catch {}
    })
    await Promise.all(promises)
    this.sounds.clear()
  }

  hasSound(id: string): boolean {
    return this.sounds.has(id)
  }

  getActiveCount(): number {
    return this.sounds.size
  }

  async preloadCloudSound(id: string): Promise<boolean> {
    const localPath = await cloudSoundManager.downloadSound(id)
    if (!localPath) return false
    return this.loadSound(id, id + '.mp3')
  }
}

export const audioEngine = new AudioEngineClass()
