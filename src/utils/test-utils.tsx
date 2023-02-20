import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
export default function renderWithProviders(ui: any) {
  function Wrapper({ children }: any): JSX.Element {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    )
  }

  return { ...render(ui, { wrapper: Wrapper }) }
}
