// app/components/ThemeRegistry.tsx
'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4285F4',
    },
    background: {
      default: '#F0F4F9', // サイドバー・ページ背景
      paper:   '#FFFFFF', // カード・メインコンテンツ背景
    },
    text: {
      primary:   '#333333',
      secondary: '#666666',
      disabled:  '#aaaaaa',
    },
    divider: '#E8E8E8',
    success: { main: '#34A853' },
    warning: { main: '#FBBC04' },
    error:   { main: '#EA4335' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
