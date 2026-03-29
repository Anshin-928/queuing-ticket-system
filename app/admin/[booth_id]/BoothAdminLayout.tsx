// app/admin/[booth_id]/BoothAdminLayout.tsx
'use client'

import { useState } from 'react'
import { Box, AppBar, Toolbar, IconButton, Typography, useTheme } from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import Sidebar, { closedDrawerWidth, openDrawerWidth } from '@/components/Sidebar'
import PageHeader from '@/components/PageHeader'

interface BoothAdminLayoutProps {
  children: React.ReactNode
  boothId: string
  boothName: string
}

export default function BoothAdminLayout({ children, boothId, boothName }: BoothAdminLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: theme.palette.background.default }}>

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
          いばらき ✕ 立命館DAY 2026
          </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar isSidebarOpen={isSidebarOpen} boothId={boothId} boothName={boothName} />

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
        <Toolbar sx={{ minHeight: '64px !important' }} />
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
          <Box sx={{ maxWidth: '1100px', width: '100%', mx: 'auto', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <PageHeader boothId={boothId} />
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
