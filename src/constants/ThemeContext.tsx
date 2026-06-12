import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import { DARK, LIGHT } from './colors'
import { usePreferencesStore } from '../store/preferencesStore'

interface ThemeContextValue {
  colors: Record<string, string>
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: DARK,
  isDark: true,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme()
  const themeMode = usePreferencesStore(s => s.themeMode)
  const reducedMotion = usePreferencesStore(s => s.reducedMotion)

  const isDark = useMemo(() => {
    if (themeMode === 'system') return systemScheme === 'dark'
    return themeMode === 'dark'
  }, [themeMode, systemScheme])

  const value = useMemo(() => ({
    colors: isDark ? DARK : LIGHT,
    isDark,
  }), [isDark])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
