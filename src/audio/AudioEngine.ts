import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'
import { soundAssets } from './soundAssets'
import { cloudSoundManager } from './CloudSoundManager'

class AudioEngineClass {
  private players: Map<string, any> = new Map()
  private masterVolume: number = 1
  private initialized: boolean = false

  async initialize() {
    if (this.initialized) return
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    })
    this.initialized = true
  }

  async loadSound(id: string, file: string): Promise<boolean> {
    if (this.players.has(id)) return true

    const filename = file.endsWith('.mp3') ? file : file + '.mp3'
    const asset = soundAssets[filename]

    if (asset) {
      try {
        const player = createAudioPlayer(asset)
        player.loop = true
        player.volume = 0
        this.players.set(id, player)
        return true
      } catch {
        return false
      }
    }

    const localPath = await cloudSoundManager.getLocalPath(id)
    if (!localPath) return false

    try {
      const player = createAudioPlayer({ uri: localPath })
      player.loop = true
      player.volume = 0
      this.players.set(id, player)
      return true
    } catch {
      return false
    }
  }

  async playSound(id: string): Promise<boolean> {
    const player = this.players.get(id)
    if (!player) return false
    try {
      player.play()
      return true
    } catch {
      return false
    }
  }

  async stopSound(id: string): Promise<boolean> {
    const player = this.players.get(id)
    if (!player) return false
    try {
      player.pause()
      return true
    } catch {
      return false
    }
  }

  async unloadSound(id: string): Promise<boolean> {
    const player = this.players.get(id)
    if (!player) return false
    try {
      player.remove()
      this.players.delete(id)
      return true
    } catch {
      return false
    }
  }

  async setVolume(id: string, volume: number): Promise<boolean> {
    const player = this.players.get(id)
    if (!player) return false
    try {
      player.volume = volume * this.masterVolume
      return true
    } catch {
      return false
    }
  }

  async setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    const promises: Promise<boolean>[] = []
    this.players.forEach((_, id) => {
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
    const player = this.players.get(id)
    if (!player) return

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
        player.volume = volume
      } catch {
        return
      }

      if (i < steps) {
        await new Promise(r => setTimeout(r, intervalMs))
      }
    }
  }

  async pauseAll() {
    this.players.forEach((player) => {
      try {
        player.pause()
      } catch {}
    })
  }

  async resumeAll() {
    this.players.forEach((player) => {
      try {
        player.play()
      } catch {}
    })
  }

  async stopAll() {
    this.players.forEach((player) => {
      try {
        player.pause()
      } catch {}
    })
  }

  async unloadAll() {
    await this.stopAll()
    this.players.forEach((player) => {
      try {
        player.remove()
      } catch {}
    })
    this.players.clear()
  }

  hasSound(id: string): boolean {
    return this.players.has(id)
  }

  getActiveCount(): number {
    return this.players.size
  }

  async preloadCloudSound(id: string): Promise<boolean> {
    const localPath = await cloudSoundManager.downloadSound(id)
    if (!localPath) return false
    return this.loadSound(id, id + '.mp3')
  }
}

export const audioEngine = new AudioEngineClass()
