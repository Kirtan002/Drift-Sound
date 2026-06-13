import { Paths, File } from 'expo-file-system'

// Minimal JSON persistence backed by expo-file-system (already a dependency).
// Used for preferences and saved mixes — never for secrets.
export function loadJSON<T>(name: string, fallback: T): T {
  try {
    const f = new File(Paths.document, `${name}.json`)
    if (!f.exists) return fallback
    const text = f.textSync()
    if (!text) return fallback
    return { ...fallback, ...JSON.parse(text) }
  } catch {
    return fallback
  }
}

export function saveJSON(name: string, value: unknown): void {
  try {
    const f = new File(Paths.document, `${name}.json`)
    f.write(JSON.stringify(value))
  } catch {}
}
