export const BUNDLED_IDS = new Set([
  'rain_light',
  'ocean_waves',
  'thunder_distant',
  'forest_morning',
  'forest_night',
])

export const soundAssets: Record<string, number> = {
  'gentle-rainfall.mp3': require('../../assets/sounds/gentle-rainfall.mp3'),
  'water-calm.mp3': require('../../assets/sounds/water-calm.mp3'),
  'rain-and-thunder.mp3': require('../../assets/sounds/rain-and-thunder.mp3'),
  'soft-wind-with-birds.mp3': require('../../assets/sounds/soft-wind-with-birds.mp3'),
  'forest-with-frogs-and-crickets.mp3': require('../../assets/sounds/forest-with-frogs-and-crickets.mp3'),
}
