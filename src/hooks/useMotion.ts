import { usePreferencesStore } from '../store/preferencesStore'

// Convenience hook: returns whether animations should run. Components can use
// this to skip looping/decorative animations when the user prefers reduced motion.
export function useMotion() {
  const reducedMotion = usePreferencesStore(s => s.reducedMotion)
  return { reducedMotion, animationsEnabled: !reducedMotion }
}
