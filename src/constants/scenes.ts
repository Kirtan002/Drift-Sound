import type { Scene } from '../types/sound'

// Every scene is composed only of sounds that resolve to bundled assets, so
// each one is guaranteed to play offline.
export const SCENES: Scene[] = [
  {
    id: 'rainy_cabin',
    name: 'Rainy Cabin',
    description: 'Cozy cabin with gentle rainfall, forest frogs, and distant thunder',
    sounds: [
      { soundId: 'gentle_rainfall', volume: 0.7 },
      { soundId: 'forest_frogs', volume: 0.35 },
      { soundId: 'thunder_distant', volume: 0.25 },
    ],
    background: 'cabin_window',
    mood: 'cozy, warm, isolated',
    locked: false,
    emoji: '🏡',
  },
  {
    id: 'ocean_dock',
    name: 'Ocean Dock',
    description: 'Calm water lapping with soft wind at night',
    sounds: [
      { soundId: 'calm_water', volume: 0.8 },
      { soundId: 'wind_gentle', volume: 0.3 },
    ],
    background: 'ocean_night',
    mood: 'open, peaceful, vast',
    locked: false,
    emoji: '🌊',
  },
  {
    id: 'forest_night',
    name: 'Forest Night',
    description: 'Night forest alive with crickets, frogs, and a gentle stream',
    sounds: [
      { soundId: 'forest_night', volume: 0.75 },
      { soundId: 'river_stream', volume: 0.35 },
    ],
    background: 'forest_dark',
    mood: 'earthy, alive, grounded',
    locked: false,
    emoji: '🌲',
  },
  {
    id: 'deep_focus',
    name: 'Deep Focus',
    description: 'Rolling thunder over steady rain to anchor deep concentration',
    sounds: [
      { soundId: 'thunderstorm', volume: 0.55 },
      { soundId: 'gentle_rainfall', volume: 0.35 },
    ],
    background: 'minimal_dark',
    mood: 'clinical, focused, deep',
    locked: true,
    emoji: '🎯',
  },
  {
    id: 'space_float',
    name: 'Space Float',
    description: 'Weightless wind over deep still water — drift through the dark',
    sounds: [
      { soundId: 'soft_wind', volume: 0.65 },
      { soundId: 'ocean_deep', volume: 0.35 },
    ],
    background: 'cosmos',
    mood: 'detached, vast, cosmic',
    locked: true,
    emoji: '🚀',
  },
  {
    id: 'pet_relief',
    name: 'Pet Relief',
    description: 'Soft rain and gentle birdsong to settle anxious pets',
    sounds: [
      { soundId: 'gentle_rainfall', volume: 0.6 },
      { soundId: 'soft_wind', volume: 0.3 },
    ],
    background: 'calm_den',
    mood: 'soothing, protective, warm',
    locked: false,
    emoji: '🐾',
  },
  {
    id: 'coffee_morning',
    name: 'Coffee Morning',
    description: 'Birdsong morning with light rain tapping the window',
    sounds: [
      { soundId: 'forest_morning', volume: 0.6 },
      { soundId: 'rain_light', volume: 0.35 },
    ],
    background: 'cafe_warm',
    mood: 'productive, warm, energized',
    locked: true,
    emoji: '☕',
  },
] as const

export const SCENE_BY_ID: Record<string, Scene> = Object.fromEntries(
  SCENES.map(s => [s.id, s])
)

export const FREE_SCENE_IDS = SCENES.filter(s => !s.locked).map(s => s.id)
export const LOCKED_SCENE_IDS = SCENES.filter(s => s.locked).map(s => s.id)
