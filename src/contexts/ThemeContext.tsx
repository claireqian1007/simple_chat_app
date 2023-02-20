import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react'

export type ThemeContextType = {
  theme: string
  setTheme: (value: string) => void
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)
export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light')

  useEffect(() => {
    if (theme === 'light') {
      document.body.style.cssText =
        '--backgroundColor:#ffffff;--color:#000000;--borderColor:rgba(1, 1, 1, 0.1);--selectedTab:#f0fab5;--messageBox:#a9d134;--sideBarBg:#a9d134'
    } else {
      document.body.style.cssText =
        '--backgroundColor:#2d3218;--color:#ffffff;--borderColor:rgba(255,255,255,0.1);--selectedTab:#6f9412;--messageBox:#545455;--sideBarBg:#809b31'
    }
  }, [theme])

  const value = {
    theme,
    setTheme
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
