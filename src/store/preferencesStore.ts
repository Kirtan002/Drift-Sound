import { create } from 'zustand'

export interface PreferencesState {
  themeMode: 'light' | 'dark' | 'system'
  reducedMotion: boolean
  defaultVolume: number
  crossfadeEnabled: boolean
  fadeOutDuration: number
  keepScreenOn: boolean
  showPlayerNotification: boolean
  timerReminderEnabled: boolean
  premiumUnlocked: boolean
}

interface PreferencesActions {
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  setReducedMotion: (enabled: boolean) => void
  setDefaultVolume: (volume: number) => void
  setCrossfadeEnabled: (enabled: boolean) => void
  setFadeOutDuration: (duration: number) => void
  setKeepScreenOn: (enabled: boolean) => void
  setShowPlayerNotification: (enabled: boolean) => void
  setTimerReminderEnabled: (enabled: boolean) => void
  setPremiumUnlocked: (unlocked: boolean) => void
}

type PreferencesStore = PreferencesState & PreferencesActions

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  themeMode: 'dark',
  reducedMotion: false,
  defaultVolume: 0.7,
  crossfadeEnabled: true,
  fadeOutDuration: 60,
  keepScreenOn: false,
  showPlayerNotification: true,
  timerReminderEnabled: false,
  premiumUnlocked: false,

  setThemeMode: (mode) => set({ themeMode: mode }),
  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  setDefaultVolume: (volume) => set({ defaultVolume: volume }),
  setCrossfadeEnabled: (enabled) => set({ crossfadeEnabled: enabled }),
  setFadeOutDuration: (duration) => set({ fadeOutDuration: duration }),
  setKeepScreenOn: (enabled) => set({ keepScreenOn: enabled }),
  setShowPlayerNotification: (enabled) => set({ showPlayerNotification: enabled }),
  setTimerReminderEnabled: (enabled) => set({ timerReminderEnabled: enabled }),
  setPremiumUnlocked: (unlocked) => set({ premiumUnlocked: unlocked }),
}))
