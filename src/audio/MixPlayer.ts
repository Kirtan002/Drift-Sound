import { audioEngine } from './AudioEngine'
import { cloudSoundManager } from './CloudSoundManager'
import type { ActiveSound } from '../types/sound'

const MAX_SOUNDS = 6
const FADE_DURATION = 500

class MixPlayerClass {
  private currentSounds: Map<string, ActiveSound> = new Map()
  private isActive: boolean = false

  private async ensureSoundReady(sound: ActiveSound): Promise<boolean> {
    if (!sound.url) return true

    const cached = await cloudSoundManager.getLocalPath(sound.id)
    if (cached) return true

    const result = await cloudSoundManager.downloadSound(sound.id, sound.url)
    return result.success
  }

  async loadMix(sounds: ActiveSound[]): Promise<boolean> {
    const valid = sounds.slice(0, MAX_SOUNDS)

    const ready = await Promise.all(valid.map(s => this.ensureSoundReady(s)))
    if (!ready.every(Boolean)) return false

    const results = await Promise.all(
      valid.map(s => audioEngine.loadSound(s.id, s.file))
    )
    return results.every(Boolean)
  }

  async startMix(sounds: ActiveSound[]): Promise<boolean> {
    await this.stopAll()

    const loaded = await this.loadMix(sounds)
    if (!loaded) return false

    this.currentSounds.clear()
    sounds.slice(0, MAX_SOUNDS).forEach(s => {
      this.currentSounds.set(s.id, s)
    })

    const playResults = await Promise.all(
      sounds.slice(0, MAX_SOUNDS).map(async (s) => {
        const played = await audioEngine.playSound(s.id)
        if (played) {
          await audioEngine.fadeVolume(s.id, 0, s.volume, FADE_DURATION)
        }
        return played
      })
    )

    this.isActive = playResults.some(Boolean)
    return this.isActive
  }

  async stopAll(fade: boolean = true) {
    const ids = Array.from(this.currentSounds.keys())
    if (fade) {
      await Promise.all(
        ids.map(id => audioEngine.fadeVolume(id, 1, 0, FADE_DURATION))
      )
    }
    await audioEngine.stopAll()
    this.isActive = false
  }

  async addSound(sound: ActiveSound) {
    if (this.currentSounds.size >= MAX_SOUNDS) return
    if (this.currentSounds.has(sound.id)) return

    const ready = await this.ensureSoundReady(sound)
    if (!ready) return

    const loaded = await audioEngine.loadSound(sound.id, sound.file)
    if (!loaded) return

    this.currentSounds.set(sound.id, sound)
    await audioEngine.playSound(sound.id)
    await audioEngine.fadeVolume(sound.id, 0, sound.volume, FADE_DURATION)
    this.isActive = true
  }

  async removeSound(id: string) {
    if (!this.currentSounds.has(id)) return
    await audioEngine.fadeVolume(id, 1, 0, FADE_DURATION)
    await audioEngine.stopSound(id)
    await audioEngine.unloadSound(id)
    this.currentSounds.delete(id)

    if (this.currentSounds.size === 0) {
      this.isActive = false
    }
  }

  async updateVolume(id: string, volume: number) {
    if (!this.currentSounds.has(id)) return
    this.currentSounds.set(id, { ...this.currentSounds.get(id)!, volume })
    await audioEngine.setVolume(id, volume)
  }

  async updateMasterVolume(volume: number) {
    await audioEngine.setMasterVolume(volume)
  }

  async pauseAll() {
    await audioEngine.pauseAll()
    this.isActive = false
  }

  async resumeAll() {
    if (this.currentSounds.size === 0) return
    await audioEngine.resumeAll()
    this.isActive = true
  }

  async unloadAll() {
    await audioEngine.unloadAll()
    this.currentSounds.clear()
    this.isActive = false
  }

  getActiveSounds(): ActiveSound[] {
    return Array.from(this.currentSounds.values())
  }

  getSoundCount(): number {
    return this.currentSounds.size
  }

  getIsActive(): boolean {
    return this.isActive
  }

  async reinitialize() {
    await this.unloadAll()
    await audioEngine.initialize()
  }
}

export const mixPlayer = new MixPlayerClass()
