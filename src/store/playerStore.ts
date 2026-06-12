import { create } from 'zustand'
import type { ActiveSound } from '../types/sound'
import type { PlayerState, PlayerActions } from '../types/player'

type PlayerStore = PlayerState & PlayerActions

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
  },

  pause: () => {
    set({ isPlaying: false })
  },

  resume: () => {
    if (get().activeSounds.length > 0) {
      set({ isPlaying: true })
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
  },

  addSound: (sound: ActiveSound) => {
    const { activeSounds } = get()
    const exists = activeSounds.find(s => s.id === sound.id)
    if (!exists) {
      set({ activeSounds: [...activeSounds, { ...sound, volume: sound.volume ?? 0.6 }], isPlaying: true })
    }
  },

  removeSound: (id: string) => {
    const { activeSounds } = get()
    const filtered = activeSounds.filter(s => s.id !== id)
    if (filtered.length === 0) {
      set({ activeSounds: [], isPlaying: false, activeScene: null })
    } else {
      set({ activeSounds: filtered })
    }
  },

  setVolume: (id: string, volume: number) => {
    const { activeSounds } = get()
    set({
      activeSounds: activeSounds.map(s => s.id === id ? { ...s, volume } : s),
    })
  },

  setMasterVolume: (volume: number) => {
    set({ masterVolume: Math.max(0, Math.min(1, volume)) })
  },

  setTimer: (endTime: number | null) => {
    set({ timerEndTime: endTime })
  },

  setWakeTime: (time: string | null) => {
    set({ wakeTime: time })
  },

  setBreathingGuide: (enabled: boolean) => {
    set({ isBreathingGuide: enabled })
  },

  setActiveScene: (sceneId: string | null) => {
    set({ activeScene: sceneId })
  },
}))
