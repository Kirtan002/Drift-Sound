import { create } from 'zustand'
import { loadJSON, saveJSON } from './persist'

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

const PERSIST_KEY = 'preferences'

const DEFAULTS: PreferencesState = {
  themeMode: 'dark',
  reducedMotion: false,
  defaultVolume: 0.7,
  crossfadeEnabled: true,
  fadeOutDuration: 60,
  keepScreenOn: false,
  showPlayerNotification: true,
  timerReminderEnabled: false,
  premiumUnlocked: false,
}

const persisted = loadJSON<PreferencesState>(PERSIST_KEY, DEFAULTS)

export const usePreferencesStore = create<PreferencesStore>((set, get) => {
  const persist = () => {
    const s = get()
    saveJSON(PERSIST_KEY, {
      themeMode: s.themeMode,
      reducedMotion: s.reducedMotion,
      defaultVolume: s.defaultVolume,
      crossfadeEnabled: s.crossfadeEnabled,
      fadeOutDuration: s.fadeOutDuration,
      keepScreenOn: s.keepScreenOn,
      showPlayerNotification: s.showPlayerNotification,
      timerReminderEnabled: s.timerReminderEnabled,
      premiumUnlocked: s.premiumUnlocked,
    })
  }
  const setAndPersist = (partial: Partial<PreferencesState>) => {
    set(partial)
    persist()
  }

  return {
    ...persisted,

    setThemeMode: (mode) => setAndPersist({ themeMode: mode }),
    setReducedMotion: (enabled) => setAndPersist({ reducedMotion: enabled }),
    setDefaultVolume: (volume) => setAndPersist({ defaultVolume: volume }),
    setCrossfadeEnabled: (enabled) => setAndPersist({ crossfadeEnabled: enabled }),
    setFadeOutDuration: (duration) => setAndPersist({ fadeOutDuration: duration }),
    setKeepScreenOn: (enabled) => setAndPersist({ keepScreenOn: enabled }),
    setShowPlayerNotification: (enabled) => setAndPersist({ showPlayerNotification: enabled }),
    setTimerReminderEnabled: (enabled) => setAndPersist({ timerReminderEnabled: enabled }),
    setPremiumUnlocked: (unlocked) => setAndPersist({ premiumUnlocked: unlocked }),
  }
})
