import { useEffect, useSyncExternalStore, useCallback } from 'react'
import { cloudSoundManager, type SoundStatus } from '../audio/CloudSoundManager'

export function useCloudSound(id: string, url?: string) {
  const status = useSyncExternalStore(
    useCallback(
      (cb: () => void) => cloudSoundManager.subscribe(id, () => cb()),
      [id]
    ),
    useCallback(() => cloudSoundManager.getStatus(id), [id])
  )

  const download = useCallback(() => {
    cloudSoundManager.downloadSound(id, url)
  }, [id, url])

  return { status, download }
}
