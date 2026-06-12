import type { ActiveSound } from './sound'

export interface PlayerState {
  isPlaying: boolean
  activeSounds: ActiveSound[]
  activeScene: string | null
  masterVolume: number
  timerEndTime: number | null
  wakeTime: string | null
  isBreathingGuide: boolean
}

export interface PlayerActions {
  play: (sounds: ActiveSound[]) => void
  pause: () => void
  resume: () => void
  stop: () => void
  addSound: (sound: ActiveSound) => void
  removeSound: (id: string) => void
  setVolume: (id: string, volume: number) => void
  setMasterVolume: (volume: number) => void
  setTimer: (endTime: number | null) => void
  setWakeTime: (time: string | null) => void
  setBreathingGuide: (enabled: boolean) => void
  setActiveScene: (sceneId: string | null) => void
}

export type TimerPreset = 5 | 10 | 15 | 20 | 25 | 30 | 45 | 60 | 90 | 120

export interface TimerState {
  remaining: number
  isRunning: boolean
  endTime: number | null
  fadeOutEnabled: boolean
  fadeOutDuration: number
}

export interface WakeFadeConfig {
  enabled: boolean
  wakeTime: string | null
  fadeStartMinutes: number
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system'
  reducedMotion: boolean
}

export interface PlaybackPreferences {
  defaultVolume: number
  crossfadeEnabled: boolean
  fadeOutDuration: number
  keepScreenOn: boolean
}

export interface NotificationPreferences {
  showPlayerNotification: boolean
  timerReminderEnabled: boolean
}
