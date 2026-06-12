export const BUNDLED_IDS = new Set([
  'rain_window',
  'ocean_waves',
  'white_noise',
  'brown_noise',
  'campfire',
])

export const soundAssets: Record<string, number> = {
  'rain_window.mp3': require('../../assets/sounds/rain_window.mp3'),
  'ocean_waves.mp3': require('../../assets/sounds/ocean_waves.mp3'),
  'white_noise.mp3': require('../../assets/sounds/white_noise.mp3'),
  'brown_noise.mp3': require('../../assets/sounds/brown_noise.mp3'),
  'campfire.mp3': require('../../assets/sounds/campfire.mp3'),
}
