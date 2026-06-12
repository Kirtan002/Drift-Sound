export interface CloudSoundEntry {
  url: string
  sizeBytes: number
}

const CLOUD_BASE = ''

export const CLOUD_MANIFEST: Record<string, CloudSoundEntry> = {
  rain_light:      { url: `${CLOUD_BASE}/rain_light.mp3`,      sizeBytes: 0 },
  rain_heavy:      { url: `${CLOUD_BASE}/rain_heavy.mp3`,      sizeBytes: 0 },
  thunder_distant: { url: `${CLOUD_BASE}/thunder_distant.mp3`, sizeBytes: 0 },
  ocean_deep:      { url: `${CLOUD_BASE}/ocean_deep.mp3`,      sizeBytes: 0 },
  forest_morning:  { url: `${CLOUD_BASE}/forest_morning.mp3`,  sizeBytes: 0 },
  forest_night:    { url: `${CLOUD_BASE}/forest_night.mp3`,    sizeBytes: 0 },
  river_stream:    { url: `${CLOUD_BASE}/river_stream.mp3`,    sizeBytes: 0 },
  waterfall:       { url: `${CLOUD_BASE}/waterfall.mp3`,       sizeBytes: 0 },
  wind_gentle:     { url: `${CLOUD_BASE}/wind_gentle.mp3`,     sizeBytes: 0 },
  pink_noise:      { url: `${CLOUD_BASE}/pink_noise.mp3`,      sizeBytes: 0 },
  blue_noise:      { url: `${CLOUD_BASE}/blue_noise.mp3`,      sizeBytes: 0 },
  grey_noise:      { url: `${CLOUD_BASE}/grey_noise.mp3`,      sizeBytes: 0 },
  violet_noise:    { url: `${CLOUD_BASE}/violet_noise.mp3`,    sizeBytes: 0 },
  fan_slow:        { url: `${CLOUD_BASE}/fan_slow.mp3`,        sizeBytes: 0 },
  fan_medium:      { url: `${CLOUD_BASE}/fan_medium.mp3`,      sizeBytes: 0 },
  fan_fast:        { url: `${CLOUD_BASE}/fan_fast.mp3`,        sizeBytes: 0 },
  air_conditioner: { url: `${CLOUD_BASE}/air_conditioner.mp3`, sizeBytes: 0 },
  box_fan:         { url: `${CLOUD_BASE}/box_fan.mp3`,         sizeBytes: 0 },
  vacuum_distant:  { url: `${CLOUD_BASE}/vacuum_distant.mp3`,  sizeBytes: 0 },
  coffee_shop:     { url: `${CLOUD_BASE}/coffee_shop.mp3`,     sizeBytes: 0 },
  train_ride:      { url: `${CLOUD_BASE}/train_ride.mp3`,      sizeBytes: 0 },
  airplane_cabin:  { url: `${CLOUD_BASE}/airplane_cabin.mp3`,  sizeBytes: 0 },
  library:         { url: `${CLOUD_BASE}/library.mp3`,         sizeBytes: 0 },
  fireplace_indoor:{ url: `${CLOUD_BASE}/fireplace_indoor.mp3`,sizeBytes: 0 },
  city_rain:       { url: `${CLOUD_BASE}/city_rain.mp3`,       sizeBytes: 0 },
  space_hum:       { url: `${CLOUD_BASE}/space_hum.mp3`,       sizeBytes: 0 },
  tibetan_bowls:   { url: `${CLOUD_BASE}/tibetan_bowls.mp3`,   sizeBytes: 0 },
  brown_binaural:  { url: `${CLOUD_BASE}/brown_binaural.mp3`,  sizeBytes: 0 },
  delta_waves:     { url: `${CLOUD_BASE}/delta_waves.mp3`,     sizeBytes: 0 },
  theta_waves:     { url: `${CLOUD_BASE}/theta_waves.mp3`,     sizeBytes: 0 },
  womb_sounds:     { url: `${CLOUD_BASE}/womb_sounds.mp3`,     sizeBytes: 0 },
  rain_window:     { url: `${CLOUD_BASE}/rain_window.mp3`,     sizeBytes: 0 },
  white_noise:     { url: `${CLOUD_BASE}/white_noise.mp3`,     sizeBytes: 0 },
  brown_noise:     { url: `${CLOUD_BASE}/brown_noise.mp3`,     sizeBytes: 0 },
  campfire:        { url: `${CLOUD_BASE}/campfire.mp3`,        sizeBytes: 0 },
}
