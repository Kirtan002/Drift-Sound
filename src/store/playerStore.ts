import { create } from 'zustand'
import type { ActiveSound } from '../types/sound'
import type { PlayerState, PlayerActions } from '../types/player'
import { mixPlayer } from '../audio/MixPlayer'
import { audioEngine } from '../audio/AudioEngine'
import { fadeScheduler } from '../audio/FadeScheduler'

type PlayerStore = PlayerState & PlayerActions

let engineReady: Promise<void> | null = null
function ensureEngine(): Promise<void> {
  if (!engineReady) engineReady = audioEngine.initialize().catch(() => {})
  return engineReady
}

// The store is the single source of truth for UI; every mutation also drives the
// audio engine through mixPlayer (whose internal queue serializes native calls).
// Audio side effects are fire-and-forget so the UI stays instant.
export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isPlaying: false,
  activeSounds: [],
  activeScene: null,
  masterVolume: 0.7,
  timerEndTime: null,
  wakeTime: null,
  isBreathingGuide: false,

  play: (sounds: ActiveSound[]) => {
    set({ activeSounds: sounds, isPlaying: true, activeScene: null })
    ensureEngine().then(() => {
      audioEngine.setMasterVolume(get().masterVolume)
      audioEngine.resetFadeFactor()
      mixPlayer.startMix(sounds)
    })
  },

  pause: () => {
    set({ isPlaying: false })
    mixPlayer.pauseAll()
  },

  resume: () => {
    if (get().activeSounds.length > 0) {
      set({ isPlaying: true })
      ensureEngine().then(() => mixPlayer.resumeAll())
    }
  },

  stop: () => {
    set({
      isPlaying: false,
      activeSounds: [],
      activeScene: null,
      timerEndTime: null,
      wakeTime: null,
    })
    fadeScheduler.cancelAll()
    mixPlayer.stopAll(true)
  },

  addSound: (sound: ActiveSound) => {
    const { activeSounds } = get()
    if (activeSounds.find(s => s.id === sound.id)) return
    const normalized = { ...sound, volume: sound.volume ?? 0.6 }
    set({ activeSounds: [...activeSounds, normalized], isPlaying: true })
    ensureEngine().then(() => {
      audioEngine.setMasterVolume(get().masterVolume)
      mixPlayer.addSound(normalized)
    })
  },

  removeSound: (id: string) => {
    const { activeSounds } = get()
    const filtered = activeSounds.filter(s => s.id !== id)
    if (filtered.length === 0) {
      set({ activeSounds: [], isPlaying: false, activeScene: null })
      fadeScheduler.cancelAll()
      mixPlayer.stopAll(true)
    } else {
      set({ activeSounds: filtered })
      mixPlayer.removeSound(id)
    }
  },

  setVolume: (id: string, volume: number) => {
    const v = Math.max(0, Math.min(1, volume))
    set({
      activeSounds: get().activeSounds.map(s => s.id === id ? { ...s, volume: v } : s),
    })
    mixPlayer.updateVolume(id, v)
  },

  setMasterVolume: (volume: number) => {
    const v = Math.max(0, Math.min(1, volume))
    set({ masterVolume: v })
    mixPlayer.updateMasterVolume(v)
  },

  setTimer: (endTime: number | null, fadeOutMs: number = 60000) => {
    set({ timerEndTime: endTime })
    fadeScheduler.cancelSleep()
    if (endTime && endTime > Date.now()) {
      const durationMs = endTime - Date.now()
      const fadeMs = Math.min(fadeOutMs, durationMs)
      fadeScheduler.scheduleSleepFade(durationMs, fadeMs, () => {
        usePlayerStore.getState().stop()
      })
    } else {
      audioEngine.resetFadeFactor()
    }
  },

  // Pure state setter. The timer screen owns fade-start config and arms the
  // scheduler via scheduleWake() below so the two never disagree.
  setWakeTime: (time: string | null) => {
    set({ wakeTime: time })
    if (!time) {
      fadeScheduler.cancelWake()
      audioEngine.resetFadeFactor()
    }
  },

  setBreathingGuide: (enabled: boolean) => {
    set({ isBreathingGuide: enabled })
  },

  setActiveScene: (sceneId: string | null) => {
    set({ activeScene: sceneId })
  },
}))
