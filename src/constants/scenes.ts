import type { Scene } from '../types/sound'

export const SCENES: Scene[] = [
  {
    id: 'rainy_cabin',
    name: 'Rainy Cabin',
    description: 'Cozy cabin with gentle rainfall, forest frogs, and distant thunder',
    sounds: [
      { soundId: 'gentle_rainfall', volume: 0.7 },
      { soundId: 'forest_frogs', volume: 0.4 },
      { soundId: 'thunder_distant', volume: 0.2 },
    ],
    background: 'cabin_window',
    mood: 'cozy, warm, isolated',
    locked: false,
    emoji: '🏡',
  },
  {
    id: 'ocean_dock',
    name: 'Ocean Dock',
    description: 'Calm water with soft wind at night',
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
    description: 'Night forest with crickets, frogs, and a gentle stream',
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
    description: 'Deep thunderstorm mixed with delta waves for concentration',
    sounds: [
      { soundId: 'thunderstorm', volume: 0.6 },
      { soundId: 'delta_waves', volume: 0.4 },
    ],
    background: 'minimal_dark',
    mood: 'clinical, focused, deep',
    locked: true,
    emoji: '🎯',
  },
  {
    id: 'space_float',
    name: 'Space Float',
    description: 'Cosmic hum with violet noise — float through space',
    sounds: [
      { soundId: 'space_hum', volume: 0.7 },
      { soundId: 'violet_noise', volume: 0.3 },
    ],
    background: 'cosmos',
    mood: 'detached, vast, cosmic',
    locked: true,
    emoji: '🚀',
  },
  {
    id: 'pet_relief',
    name: 'Pet Relief',
    description: 'Thunderstorm with soft rain to calm anxious pets during storms',
    sounds: [
      { soundId: 'thunderstorm', volume: 0.75 },
      { soundId: 'rain_light', volume: 0.3 },
    ],
    background: 'calm_den',
    mood: 'soothing, protective, warm',
    locked: false,
    emoji: '🐾',
  },
  {
    id: 'coffee_morning',
    name: 'Coffee Morning',
    description: 'Warm cafe ambience with light rain in the background',
    sounds: [
      { soundId: 'coffee_shop', volume: 0.65 },
      { soundId: 'rain_light', volume: 0.35 },
    ],
    background: 'cafe_warm',
    mood: 'productive, warm, energized',
    locked: true,
    emoji: '☕',
  },
] as const

export const FREE_SCENE_IDS = SCENES.filter(s => !s.locked).map(s => s.id)
export const LOCKED_SCENE_IDS = SCENES.filter(s => s.locked).map(s => s.id)
