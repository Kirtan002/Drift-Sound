export type SoundCategory =
  | 'nature'
  | 'white_noise'
  | 'mechanical'
  | 'urban'
  | 'celestial'
  | (string & {})

export interface Sound {
  id: string
  name: string
  file: string
  url?: string
  category: SoundCategory
  emoji: string
  popular: boolean
}

export interface ActiveSound {
  id: string
  name: string
  volume: number
  file: string
  url?: string
  emoji?: string
}

export interface SceneMix {
  soundId: string
  volume: number
}

export interface Scene {
  id: string
  name: string
  description: string
  sounds: SceneMix[]
  background: string
  mood: string
  locked: boolean
  emoji: string
}

export interface SavedMix {
  id: string
  name: string
  sounds: ActiveSound[]
  createdAt: number
}
