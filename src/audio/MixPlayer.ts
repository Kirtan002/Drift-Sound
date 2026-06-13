import { audioEngine } from './AudioEngine'
import { cloudSoundManager } from './CloudSoundManager'
import { hasBundledAsset } from './soundAssets'
import type { ActiveSound } from '../types/sound'

const MAX_SOUNDS = 8
const FADE_DURATION = 600

// Every mutating call funnels through a single promise chain so overlapping UI
// actions (rapid add/remove/volume) can never interleave native player calls or
// race the fade engine.
class MixPlayerClass {
  private currentSounds: Map<string, ActiveSound> = new Map()
  private isActive: boolean = false
  private queue: Promise<void> = Promise.resolve()

  private enqueue<T>(op: () => Promise<T>): Promise<T> {
    const run = this.queue.then(op, op)
    this.queue = run.then(() => undefined, () => undefined)
    return run
  }

  private async ensureSoundReady(sound: ActiveSound): Promise<boolean> {
    if (hasBundledAsset(sound.file)) return true

    const cached = await cloudSoundManager.getLocalPath(sound.id)
    if (cached) return true

    if (!sound.url) return false
    const result = await cloudSoundManager.downloadSound(sound.id, sound.url)
    return result.success
  }

  startMix(sounds: ActiveSound[]): Promise<boolean> {
    return this.enqueue(async () => {
      await this.teardown(false)

      const valid = sounds.slice(0, MAX_SOUNDS)
      const started: string[] = []

      for (const s of valid) {
        const ready = await this.ensureSoundReady(s)
        if (!ready) continue
        const loaded = await audioEngine.loadSound(s.id, s.file)
        if (!loaded) continue
        this.currentSounds.set(s.id, s)
        await audioEngine.playSound(s.id, s.name)
        // Fade in concurrently — don't await, so all sounds rise together.
        audioEngine.fadeVolume(s.id, s.volume, FADE_DURATION)
        started.push(s.id)
      }

      this.isActive = started.length > 0
      return this.isActive
    })
  }

  addSound(sound: ActiveSound): Promise<boolean> {
    return this.enqueue(async () => {
      if (this.currentSounds.has(sound.id)) return true
      if (this.currentSounds.size >= MAX_SOUNDS) return false

      const ready = await this.ensureSoundReady(sound)
      if (!ready) return false

      const loaded = await audioEngine.loadSound(sound.id, sound.file)
      if (!loaded) return false

      this.currentSounds.set(sound.id, sound)
      await audioEngine.playSound(sound.id, sound.name)
      audioEngine.fadeVolume(sound.id, sound.volume, FADE_DURATION)
      this.isActive = true
      return true
    })
  }

  removeSound(id: string): Promise<void> {
    return this.enqueue(async () => {
      if (!this.currentSounds.has(id)) return
      this.currentSounds.delete(id)
      await audioEngine.fadeVolume(id, 0, FADE_DURATION)
      await audioEngine.unloadSound(id)
      if (this.currentSounds.size === 0) this.isActive = false
    })
  }

  updateVolume(id: string, volume: number): Promise<void> {
    return this.enqueue(async () => {
      const current = this.currentSounds.get(id)
      if (!current) return
      this.currentSounds.set(id, { ...current, volume })
      audioEngine.setVolume(id, volume)
    })
  }

  updateMasterVolume(volume: number): Promise<void> {
    return this.enqueue(async () => {
      audioEngine.setMasterVolume(volume)
    })
  }

  pauseAll(): Promise<void> {
    return this.enqueue(async () => {
      await audioEngine.pauseAll()
      this.isActive = false
    })
  }

  resumeAll(): Promise<void> {
    return this.enqueue(async () => {
      if (this.currentSounds.size === 0) return
      await audioEngine.resumeAll()
      this.isActive = true
    })
  }

  private async teardown(fade: boolean) {
    const ids = Array.from(this.currentSounds.keys())
    if (fade && ids.length > 0) {
      await Promise.all(ids.map(id => audioEngine.fadeVolume(id, 0, FADE_DURATION)))
    }
    await audioEngine.unloadAll()
    this.currentSounds.clear()
    this.isActive = false
  }

  stopAll(fade: boolean = true): Promise<void> {
    return this.enqueue(() => this.teardown(fade))
  }

  unloadAll(): Promise<void> {
    return this.enqueue(() => this.teardown(false))
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
