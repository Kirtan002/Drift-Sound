import type { Sound } from '../types/sound'
import { hasBundledAsset } from '../audio/soundAssets'

// Sounds whose `file` points at a bundled asset are playable offline today.
// Nature variants are mapped to the closest bundled recording; sounds in other
// categories keep their target filename and surface as "coming soon" until a
// real asset or cloud URL ships for them.
export const SOUNDS: Sound[] = [
  { id: 'rain_light', name: 'Light Rain', file: 'gentle-rainfall.mp3', category: 'nature', emoji: '🌦️', popular: true },
  { id: 'rain_heavy', name: 'Heavy Rain', file: 'rain-and-thunder.mp3', category: 'nature', emoji: '🌧️', popular: true },
  { id: 'gentle_rainfall', name: 'Gentle Rainfall', file: 'gentle-rainfall.mp3', category: 'nature', emoji: '💧', popular: true },
  { id: 'thunder_distant', name: 'Distant Thunder', file: 'rain-and-thunder.mp3', category: 'nature', emoji: '🌩️', popular: false },
  { id: 'calm_water', name: 'Calm Water', file: 'water-calm.mp3', category: 'nature', emoji: '🌊', popular: true },
  { id: 'ocean_deep', name: 'Deep Ocean', file: 'water-calm.mp3', category: 'nature', emoji: '🌌', popular: true },
  { id: 'forest_morning', name: 'Forest Morning', file: 'soft-wind-with-birds.mp3', category: 'nature', emoji: '🐦', popular: true },
  { id: 'forest_night', name: 'Forest Night', file: 'forest-with-frogs-and-crickets.mp3', category: 'nature', emoji: '🌙', popular: false },
  { id: 'river_stream', name: 'River Stream', file: 'water-calm.mp3', category: 'nature', emoji: '🏞️', popular: false },
  { id: 'waterfall', name: 'Waterfall', file: 'water-calm.mp3', category: 'nature', emoji: '💦', popular: false },
  { id: 'wind_gentle', name: 'Gentle Wind', file: 'soft-wind-with-birds.mp3', category: 'nature', emoji: '🍃', popular: false },
  { id: 'soft_wind', name: 'Soft Wind & Birds', file: 'soft-wind-with-birds.mp3', category: 'nature', emoji: '🕊️', popular: true },
  { id: 'thunderstorm', name: 'Thunderstorm', file: 'rain-and-thunder.mp3', category: 'nature', emoji: '⛈️', popular: true },
  { id: 'forest_frogs', name: 'Forest Frogs', file: 'forest-with-frogs-and-crickets.mp3', category: 'nature', emoji: '🐸', popular: true },
  { id: 'pink_noise', name: 'Pink Noise', file: 'pink_noise.mp3', category: 'white_noise', emoji: '🩷', popular: false },
  { id: 'blue_noise', name: 'Blue Noise', file: 'blue_noise.mp3', category: 'white_noise', emoji: '💙', popular: false },
  { id: 'grey_noise', name: 'Grey Noise', file: 'grey_noise.mp3', category: 'white_noise', emoji: '🩶', popular: false },
  { id: 'violet_noise', name: 'Violet Noise', file: 'violet_noise.mp3', category: 'white_noise', emoji: '💜', popular: false },
  { id: 'fan_slow', name: 'Slow Fan', file: 'fan_slow.mp3', category: 'mechanical', emoji: '🌀', popular: false },
  { id: 'fan_medium', name: 'Medium Fan', file: 'fan_medium.mp3', category: 'mechanical', emoji: '🌀', popular: false },
  { id: 'fan_fast', name: 'Fast Fan', file: 'fan_fast.mp3', category: 'mechanical', emoji: '🌀', popular: false },
  { id: 'air_conditioner', name: 'Air Conditioner', file: 'air_conditioner.mp3', category: 'mechanical', emoji: '❄️', popular: false },
  { id: 'box_fan', name: 'Box Fan', file: 'box_fan.mp3', category: 'mechanical', emoji: '📦', popular: false },
  { id: 'vacuum_distant', name: 'Distant Vacuum', file: 'vacuum_distant.mp3', category: 'mechanical', emoji: '🧹', popular: false },
  { id: 'coffee_shop', name: 'Coffee Shop', file: 'coffee_shop.mp3', category: 'urban', emoji: '☕', popular: false },
  { id: 'train_ride', name: 'Train Ride', file: 'train_ride.mp3', category: 'urban', emoji: '🚂', popular: false },
  { id: 'airplane_cabin', name: 'Airplane Cabin', file: 'airplane_cabin.mp3', category: 'urban', emoji: '✈️', popular: false },
  { id: 'library', name: 'Library', file: 'library.mp3', category: 'urban', emoji: '📚', popular: false },
  { id: 'fireplace_indoor', name: 'Fireplace', file: 'fireplace_indoor.mp3', category: 'urban', emoji: '🔥', popular: false },
  { id: 'city_rain', name: 'City Rain', file: 'city_rain.mp3', category: 'urban', emoji: '🌃', popular: false },
  { id: 'space_hum', name: 'Space Hum', file: 'space_hum.mp3', category: 'celestial', emoji: '🚀', popular: false },
  { id: 'tibetan_bowls', name: 'Tibetan Bowls', file: 'tibetan_bowls.mp3', category: 'celestial', emoji: '🔔', popular: false },
  { id: 'brown_binaural', name: 'Brown Binaural', file: 'brown_binaural.mp3', category: 'celestial', emoji: '🎧', popular: false },
  { id: 'delta_waves', name: 'Delta Waves', file: 'delta_waves.mp3', category: 'celestial', emoji: '🧠', popular: false },
  { id: 'theta_waves', name: 'Theta Waves', file: 'theta_waves.mp3', category: 'celestial', emoji: '🌀', popular: false },
  { id: 'womb_sounds', name: 'Womb Sounds', file: 'womb_sounds.mp3', category: 'celestial', emoji: '👶', popular: false },
] as const

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'nature', label: 'Nature' },
  { id: 'white_noise', label: 'White Noise' },
  { id: 'mechanical', label: 'Fan & Mechanical' },
  { id: 'urban', label: 'Urban' },
  { id: 'celestial', label: 'Focus' },
] as const

export function isSoundAvailable(sound: Sound): boolean {
  return hasBundledAsset(sound.file) || !!sound.url
}

export const SOUND_BY_ID: Record<string, Sound> = Object.fromEntries(
  SOUNDS.map(s => [s.id, s])
)

export const POPULAR_IDS = SOUNDS.filter(s => s.popular && isSoundAvailable(s)).map(s => s.id)
