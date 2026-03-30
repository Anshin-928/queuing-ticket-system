// app/admin/[booth_id]/BoothAdminLayout.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Box, AppBar, Toolbar, IconButton, Typography, Divider } from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import Sidebar, { openDrawerWidth } from '@/components/Sidebar'
import { allMenuItems, getBoothPath } from '@/config/adminMenu'

interface BoothAdminLayoutProps {
  children: React.ReactNode
  boothId: string
  boothName: string
}

export default function BoothAdminLayout({ children, boothId, boothName }: BoothAdminLayoutProps) {
  const pathname = usePathname()
  const isMonitor = pathname === `/admin/${boothId}/monitor`
  const [isSidebarOpen, setSidebarOpen] = useState(!isMonitor)

  const currentItem = allMenuItems.find((item) => {
    const path = getBoothPath(boothId, item.pathSegment)
    return pathname === path
  })

  const drawerWidth = isSidebarOpen ? openDrawerWidth : 0

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff' }}>

      {/* ── AppBar ─────────────────────────────────── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          transition: 'width 0.2s, margin 0.2s',
          backgroundColor: isMonitor ? '#274a79' : '#F0EEEB',
          color: isMonitor ? '#fff' : '#1a1a1a',
          borderBottom: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}
      >
        <Toolbar disableGutters sx={{ minHeight: '60px !important' }}>

          {/* ハンバーガー（サイドバーが閉じているときのみ表示） */}
          {!isSidebarOpen && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5 }}>
                <IconButton
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  size="small"
                  sx={{ color: isMonitor ? '#fff' : '#555' }}
                >
                  <MenuRoundedIcon />
                </IconButton>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: isMonitor ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)' }} />
            </>
          )}

          {isMonitor ? (
            /* 呼び出し画面専用 */
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', px: 2.5 }}>
              {/* 左端：ブース名 */}
              <Typography sx={{ fontSize: '26px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                {boothName}
              </Typography>
              {/* 右端：イベント名 */}
              <Typography sx={{ fontSize: '18px', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em' }}>
                いばらき × 立命館DAY 2026
              </Typography>
            </Box>
          ) : (
            /* 通常ページ */
            <Box display="flex" alignItems="center" gap={1} sx={{ px: 2.5 }}>
              {currentItem && (
                <>
                  <currentItem.Icon sx={{ fontSize: '32px', color: '#1E3A5F' }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '22px', color: '#1a1a1a', letterSpacing: '-0.2px' }}>
                    {currentItem.text}
                  </Typography>
                </>
              )}
            </Box>
          )}

        </Toolbar>
      </AppBar>

      {/* ── サイドバー ─────────────────────────────── */}
      <Sidebar isSidebarOpen={isSidebarOpen} boothId={boothId} boothName={boothName} onToggle={() => setSidebarOpen((p) => !p)} />

      {/* ── メインコンテンツ ──────────────────────── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* AppBar の高さ分のスペーサー */}
        <Toolbar sx={{ minHeight: '60px !important', flexShrink: 0 }} />

        {/* コンテンツ */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            ...(isMonitor ? {} : { overflowY: 'auto', p: 4 }),
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
