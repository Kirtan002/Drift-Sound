import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio'
import { soundAssets } from './soundAssets'
import { cloudSoundManager } from './CloudSoundManager'

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

class AudioEngineClass {
  private players: Map<string, AudioPlayer> = new Map()
  // Per-sound volume as set by the user; the applied native volume is always
  // base * masterVolume * fadeFactor, so changing any factor never loses the others.
  private baseVolumes: Map<string, number> = new Map()
  private fadeTokens: Map<string, number> = new Map()
  private masterVolume: number = 1
  private fadeFactor: number = 1
  private initialized: boolean = false
  private lockScreenOwner: string | null = null

  async initialize() {
    if (this.initialized) return
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    })
    this.initialized = true
  }

  private applyVolume(id: string) {
    const player = this.players.get(id)
    if (!player) return
    const base = this.baseVolumes.get(id) ?? 0
    try {
      player.volume = clamp01(base) * this.masterVolume * this.fadeFactor
    } catch {}
  }

  private applyAllVolumes() {
    this.players.forEach((_, id) => this.applyVolume(id))
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
        this.baseVolumes.set(id, 0)
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
      this.baseVolumes.set(id, 0)
      return true
    } catch {
      return false
    }
  }

  async playSound(id: string, lockScreenLabel?: string): Promise<boolean> {
    const player = this.players.get(id)
    if (!player) return false
    try {
      player.play()
      this.ensureLockScreenSession(id, lockScreenLabel)
      return true
    } catch {
      return false
    }
  }

  // Android stops background audio after ~3 minutes unless a player owns the
  // lock-screen/media session (per expo-audio v56 docs).
  private ensureLockScreenSession(id: string, label?: string) {
    if (this.lockScreenOwner && this.players.has(this.lockScreenOwner)) return
    const player = this.players.get(id) as any
    try {
      player?.setActiveForLockScreen?.(true, {
        title: label ?? 'Drift Sound',
        artist: 'Drift Sound',
      })
      this.lockScreenOwner = id
    } catch {}
  }

  private releaseLockScreenSession(id: string) {
    if (this.lockScreenOwner !== id) return
    const player = this.players.get(id) as any
    try {
      player?.clearLockScreenControls?.()
    } catch {}
    this.lockScreenOwner = null
    // Hand the session to any other live player so background audio survives.
    const next = this.players.keys().next()
    if (!next.done && next.value !== id) {
      this.ensureLockScreenSession(next.value)
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
    this.cancelFade(id)
    this.releaseLockScreenSession(id)
    try {
      player.remove()
    } catch {}
    this.players.delete(id)
    this.baseVolumes.delete(id)
    return true
  }

  setVolume(id: string, volume: number): boolean {
    if (!this.players.has(id)) return false
    this.cancelFade(id)
    this.baseVolumes.set(id, clamp01(volume))
    this.applyVolume(id)
    return true
  }

  getVolume(id: string): number {
    return this.baseVolumes.get(id) ?? 0
  }

  setMasterVolume(volume: number) {
    this.masterVolume = clamp01(volume)
    this.applyAllVolumes()
  }

  getMasterVolume(): number {
    return this.masterVolume
  }

  // Scheduler fades (sleep fade-out / wake fade-in) scale every sound without
  // touching per-sound or master volume.
  setFadeFactor(factor: number) {
    this.fadeFactor = clamp01(factor)
    this.applyAllVolumes()
  }

  resetFadeFactor() {
    this.setFadeFactor(1)
  }

  private cancelFade(id: string) {
    this.fadeTokens.set(id, (this.fadeTokens.get(id) ?? 0) + 1)
  }

  async fadeVolume(id: string, to: number, durationMs: number): Promise<void> {
    const player = this.players.get(id)
    if (!player) return

    const token = (this.fadeTokens.get(id) ?? 0) + 1
    this.fadeTokens.set(id, token)

    const from = this.baseVolumes.get(id) ?? 0
    const target = clamp01(to)
    if (from === target || durationMs <= 0) {
      this.baseVolumes.set(id, target)
      this.applyVolume(id)
      return
    }

    const steps = Math.min(40, Math.max(8, Math.floor(durationMs / 40)))
    const intervalMs = durationMs / steps

    for (let i = 1; i <= steps; i++) {
      await new Promise(r => setTimeout(r, intervalMs))
      if (this.fadeTokens.get(id) !== token || !this.players.has(id)) return

      const t = i / steps
      const eased = target > from ? t * t : 1 - (1 - t) * (1 - t)
      this.baseVolumes.set(id, from + (target - from) * eased)
      this.applyVolume(id)
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
    const ids = Array.from(this.players.keys())
    for (const id of ids) {
      await this.unloadSound(id)
    }
  }

  hasSound(id: string): boolean {
    return this.players.has(id)
  }

  getActiveCount(): number {
    return this.players.size
  }

  async preloadCloudSound(id: string): Promise<boolean> {
    const result = await cloudSoundManager.downloadSound(id)
    if (!result.success) return false
    return this.loadSound(id, id + '.mp3')
  }
}

export const audioEngine = new AudioEngineClass()
