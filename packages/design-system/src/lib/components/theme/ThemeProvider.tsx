import { baseTheme, BaseThemeType } from './BaseTheme'
import { ReactNode, useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import '../assets/styles/index.scss'

export interface ThemeProps {
  theme?: BaseThemeType
  children: ReactNode
}

export function ThemeProvider({ theme = baseTheme, children }: ThemeProps) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
