export const BUNDLED_IDS = new Set([
  'gentle_rainfall',
  'calm_water',
  'soft_wind',
  'thunderstorm',
  'forest_frogs',
])

export const soundAssets: Record<string, number> = {
  'gentle-rainfall.mp3': require('../../assets/sounds/gentle-rainfall.mp3'),
  'water-calm.mp3': require('../../assets/sounds/water-calm.mp3'),
  'soft-wind-with-birds.mp3': require('../../assets/sounds/soft-wind-with-birds.mp3'),
  'rain-and-thunder.mp3': require('../../assets/sounds/rain-and-thunder.mp3'),
  'forest-with-frogs-and-crickets.mp3': require('../../assets/sounds/forest-with-frogs-and-crickets.mp3'),
}
