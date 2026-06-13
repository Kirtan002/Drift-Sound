import { useEffect } from 'react'
import { usePlayerStore } from '../../store/playerStore'
import { usePreferencesStore } from '../../store/preferencesStore'

let KeepAwake: any = null
try {
  KeepAwake = require('expo-keep-awake')
} catch {}

const TAG = 'drift-playback'

// Activates the screen-awake lock only while audio plays AND the user enabled
// "keep screen on". Rendered once at the root; renders nothing.
export function PlaybackKeepAwake() {
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const activeCount = usePlayerStore(s => s.activeSounds.length)
  const keepScreenOn = usePreferencesStore(s => s.keepScreenOn)

  useEffect(() => {
    if (!KeepAwake) return
    const shouldKeep = keepScreenOn && isPlaying && activeCount > 0
    if (shouldKeep) {
      KeepAwake.activateKeepAwakeAsync?.(TAG)
    } else {
      KeepAwake.deactivateKeepAwake?.(TAG)
    }
    return () => {
      KeepAwake.deactivateKeepAwake?.(TAG)
    }
  }, [keepScreenOn, isPlaying, activeCount])

  return null
}
