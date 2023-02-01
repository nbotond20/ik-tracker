import { useEffect, useState } from 'react'

const applyThemeMode = (themeMode: 'light' | 'dark') => {
  if (typeof window !== 'undefined') {
    themeMode === 'dark'
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark')

    const faviconEl = document.querySelector('link[rel="icon"]')
    if (faviconEl) faviconEl.setAttribute('href', themeMode === 'dark' ? 'favicon-darkmode.ico' : 'favicon.ico')
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

  const toggleThemeMode = () => {
    const mode = localStorage.getItem('theme')
    localStorage.setItem('theme', mode === 'dark' ? 'light' : 'dark')
    mode !== 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    setMode(mode === 'dark' ? 'light' : 'dark')
  }

  return { mode, setMode, toggleThemeMode }
}
