import { create } from 'zustand'
import { loadJSON, saveJSON } from './persist'
import type { ActiveSound, SavedMix } from '../types/sound'

interface MixesState {
  mixes: SavedMix[]
}

interface MixesActions {
  saveMix: (name: string, sounds: ActiveSound[]) => void
  deleteMix: (id: string) => void
}

type MixesStore = MixesState & MixesActions

const PERSIST_KEY = 'saved_mixes'

// Date.now is fine at call time (user-triggered), but we keep a monotonic
// counter fallback so ids stay unique even within the same millisecond.
let counter = 0

const persisted = loadJSON<MixesState>(PERSIST_KEY, { mixes: [] })

export const useMixesStore = create<MixesStore>((set, get) => ({
  mixes: persisted.mixes ?? [],

  saveMix: (name, sounds) => {
    const mix: SavedMix = {
      id: `mix_${Date.now()}_${counter++}`,
      name: name.trim(),
      sounds: sounds.map(s => ({ ...s })),
      createdAt: Date.now(),
    }
    const mixes = [mix, ...get().mixes].slice(0, 50)
    set({ mixes })
    saveJSON(PERSIST_KEY, { mixes })
  },

  deleteMix: (id) => {
    const mixes = get().mixes.filter(m => m.id !== id)
    set({ mixes })
    saveJSON(PERSIST_KEY, { mixes })
  },
}))
