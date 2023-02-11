import { useCallback, useEffect, useState } from 'react'

const applyThemeMode = (themeMode: 'light' | 'dark') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', themeMode)
    themeMode === 'dark'
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark')
  }
}

const getThemeModeFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const mode = localStorage.getItem('theme')
    return mode === 'dark' ? 'dark' : 'light'
  }
}

export const useThemeMode = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(getThemeModeFromLocalStorage() || 'light')

  useEffect(() => {
    applyThemeMode(mode)
  }, [mode])

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark')
      applyThemeMode('dark')
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (e.matches) {
        setMode('dark')
        applyThemeMode('dark')
      } else {
        setMode('light')
        applyThemeMode('light')
      }
    })
  }, [])

  const toggleThemeMode = useCallback(() => {
    const mode = localStorage.getItem('theme')
    localStorage.setItem('theme', mode === 'dark' ? 'light' : 'dark')
    mode !== 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [])

  return { mode, setMode, toggleThemeMode }
}
