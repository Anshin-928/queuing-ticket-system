// app/admin/layout.tsx
'use client'

import { useState } from 'react'
import { Box, AppBar, Toolbar, IconButton, Typography, useTheme } from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import Sidebar, { closedDrawerWidth, openDrawerWidth } from '@/components/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: theme.palette.background.default }}>

      {/* ヘッダー */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderBottom: 'none',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ px: 2, minHeight: '64px !important' }}>
          <IconButton
            onClick={() => setSidebarOpen((prev) => !prev)}
            edge="start"
            sx={{ ml: '-8px', mr: 2, color: theme.palette.text.primary }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px', letterSpacing: '-0.3px' }}>
            整理券管理システム
          </Typography>
        </Toolbar>
      </AppBar>

      {/* サイドバー */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          pb: 2,
          pr: 2,
          transition: 'margin-left 0.2s',
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* ヘッダー分のスペーサー */}
        <Toolbar sx={{ minHeight: '64px !important' }} />

        {/* 丸いホワイトカード */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            flexGrow: 1,
            borderRadius: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            overflowX: 'hidden',
            overflowY: 'auto',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
