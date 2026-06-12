import { Paths, Directory, File } from 'expo-file-system'
import { CLOUD_MANIFEST } from '../constants/cloudManifest'
import { DRIFT_HANDSHAKE_TOKEN } from '../constants/ads'

export type SoundStatus = 'bundled' | 'cached' | 'downloading' | 'not_downloaded' | 'error'

export type DownloadResult =
  | { success: true; uri: string }
  | { success: false; reason: 'unauthorized' | 'network' | 'not_found' | 'unknown' }

type StatusCallback = (id: string, status: SoundStatus) => void

class CloudSoundManagerClass {
  private statuses: Map<string, SoundStatus> = new Map()
  private listeners: Map<string, Set<StatusCallback>> = new Map()
  private downloading: Set<string> = new Set()
  private soundsDir: Directory | null = null

  init() {
    this.soundsDir = new Directory(Paths.document, 'sounds')
    try { this.soundsDir.create() } catch {}
  }

  markBundled(id: string) {
    this.statuses.set(id, 'bundled')
  }

  async getLocalPath(id: string): Promise<string | null> {
    const f = new File(Paths.document, 'sounds', `${id}.mp3`)
    if (f.exists) {
      this.statuses.set(id, 'cached')
      return f.uri
    }
    return null
  }

  getStatus(id: string): SoundStatus {
    return this.statuses.get(id) ?? 'not_downloaded'
  }

  subscribe(id: string, cb: StatusCallback) {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set())
    }
    this.listeners.get(id)!.add(cb)
    const current = this.getStatus(id)
    cb(id, current)
    return () => {
      this.listeners.get(id)?.delete(cb)
    }
  }

  private notify(id: string, status: SoundStatus) {
    this.statuses.set(id, status)
    this.listeners.get(id)?.forEach(cb => cb(id, status))
  }

  async downloadSound(id: string, url?: string): Promise<DownloadResult> {
    const sourceUrl = url ?? CLOUD_MANIFEST[id]?.url
    if (!sourceUrl) {
      this.notify(id, 'error')
      return { success: false, reason: 'not_found' }
    }

    if (this.downloading.has(id)) {
      return { success: false, reason: 'network' }
    }

    const existingPath = await this.getLocalPath(id)
    if (existingPath) {
      return { success: true, uri: existingPath }
    }

    this.downloading.add(id)
    this.notify(id, 'downloading')

    try {
      this.soundsDir ??= new Directory(Paths.document, 'sounds')
      try { this.soundsDir.create() } catch {}
      const dest = new File(this.soundsDir, `${id}.mp3`)
      const file = await File.downloadFileAsync(sourceUrl, dest, {
        headers: { 'X-DriftSound-Token': DRIFT_HANDSHAKE_TOKEN },
        idempotent: true,
      })
      this.downloading.delete(id)
      this.notify(id, 'cached')
      return { success: true, uri: file.uri }
    } catch (error: any) {
      this.downloading.delete(id)
      if (
        error?.message?.includes('401') ||
        error?.message?.includes('403') ||
        error?.message?.includes('Unauthorized')
      ) {
        this.notify(id, 'error')
        return { success: false, reason: 'unauthorized' }
      }
      if (
        error?.message?.includes('404') ||
        error?.message?.includes('not found')
      ) {
        this.notify(id, 'error')
        return { success: false, reason: 'not_found' }
      }
      this.notify(id, 'error')
      return { success: false, reason: 'network' }
    }
  }
}

export const cloudSoundManager = new CloudSoundManagerClass()
