// src/components/Sidebar.tsx
'use client'

import React from 'react'
import {
  Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Typography, useMediaQuery, useTheme, alpha, Box,
} from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'

import StorefrontOutlinedIcon    from '@mui/icons-material/StorefrontOutlined'
import TabletMacOutlinedIcon     from '@mui/icons-material/TabletMacOutlined'
import TvOutlinedIcon            from '@mui/icons-material/TvOutlined'
import QrCodeOutlinedIcon        from '@mui/icons-material/QrCodeOutlined'
import TuneOutlinedIcon          from '@mui/icons-material/TuneOutlined'
import RestartAltOutlinedIcon    from '@mui/icons-material/RestartAltOutlined'
import BarChartOutlinedIcon      from '@mui/icons-material/BarChartOutlined'
import FileDownloadOutlinedIcon  from '@mui/icons-material/FileDownloadOutlined'

// ─── 型定義 ──────────────────────────────────────────────
interface SidebarItem {
  text: string
  path: string
  icon: React.ReactElement
}

interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

// ─── メニュー定義（グループ分け） ────────────────────────
export const menuGroups: SidebarGroup[] = [
  {
    label: '運営当日',
    items: [
      { text: 'ブース管理',         path: '/admin/booths',   icon: <StorefrontOutlinedIcon /> },
      { text: '受付操作',           path: '/admin/checkin',  icon: <TabletMacOutlinedIcon /> },
      { text: '呼び出しモニター',   path: '/admin/monitor',  icon: <TvOutlinedIcon /> },
    ],
  },
  {
    label: '事前準備',
    items: [
      { text: '整理券 PDF生成',     path: '/admin/tickets',  icon: <QrCodeOutlinedIcon /> },
      { text: 'ブース設定',         path: '/admin/settings', icon: <TuneOutlinedIcon /> },
      { text: 'イベント初期化',     path: '/admin/reset',    icon: <RestartAltOutlinedIcon /> },
    ],
  },
  {
    label: '集計・分析',
    items: [
      { text: '来場者数ダッシュボード', path: '/admin/stats',  icon: <BarChartOutlinedIcon /> },
      { text: 'CSVエクスポート',        path: '/admin/export', icon: <FileDownloadOutlinedIcon /> },
    ],
  },
]

// 既存コードとの互換用にフラットなリストもエクスポート
export const mainMenus = menuGroups.flatMap((g) => g.items)

// ─── 幅定数 ──────────────────────────────────────────────
export const closedDrawerWidth = 72
export const openDrawerWidth   = 280

// ─── Props ───────────────────────────────────────────────
interface SidebarProps {
  isSidebarOpen: boolean
}

// ─── コンポーネント ───────────────────────────────────────
export default function Sidebar({ isSidebarOpen }: SidebarProps) {
  const router    = useRouter()
  const pathname  = usePathname()
  const theme     = useTheme()
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'))

  // モバイルは非表示（既存の挙動を維持）
  if (isMobile) return null

  const selectedBg = theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.main, 0.18)
    : '#D3E3FD'

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={isSidebarOpen}
      sx={{
        width: isSidebarOpen ? openDrawerWidth : closedDrawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: 'width 0.2s',
        '& .MuiDrawer-paper': {
          width: isSidebarOpen ? openDrawerWidth : closedDrawerWidth,
          transition: 'width 0.2s',
          overflowX: 'hidden',
          backgroundColor: theme.palette.background.default,
          borderRight: 'none',
          color: theme.palette.text.primary,
        },
      }}
    >
      <Toolbar />

      <List sx={{ px: 0, pt: 1 }}>
        {menuGroups.map((group, groupIndex) => (
          <React.Fragment key={group.label}>

            {/* グループ区切り（最初のグループ以外） */}
            {groupIndex > 0 && (
              <Divider
                sx={{
                  my: 1,
                  mx: isSidebarOpen ? 2 : 1,
                  borderColor: theme.palette.divider,
                }}
              />
            )}

            {/* グループラベル（サイドバー展開時のみ表示） */}
            {isSidebarOpen && (
              <Box sx={{ px: '24px', pt: groupIndex === 0 ? 0 : 0.5, pb: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.disabled,
                    fontWeight: 'bold',
                    letterSpacing: '0.08em',
                    fontSize: '14px',
                  }}
                >
                  {group.label.toUpperCase()}
                </Typography>
              </Box>
            )}

            {/* メニューアイテム */}
            {group.items.map((item) => {
              const isSelected = pathname === item.path

              return (
                <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0 }}>
                  <ListItemButton
                    onClick={() => router.push(item.path)}
                    selected={isSelected}
                    sx={{
                      minHeight: 44,
                      justifyContent: 'flex-start',
                      ml: isSidebarOpen ? 0 : 1,
                      mr: isSidebarOpen ? 2 : 1,
                      px: 0,
                      // ピル型ハイライト：開いているときは右側だけ丸く、閉じているときは完全な円
                      borderRadius: isSidebarOpen ? '0 24px 24px 0' : '24px',
                      '&.Mui-selected': {
                        backgroundColor: selectedBg,
                        '&:hover': { backgroundColor: selectedBg },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        ml: isSidebarOpen ? '24px' : '16px',
                        mr: '16px',
                        justifyContent: 'center',
                        color: isSelected
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {isSidebarOpen && (
                      <ListItemText
                        primary={item.text}
                        sx={{
                          '& .MuiTypography-root': {
                            fontSize: '16px',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            color: isSelected
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              )
            })}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  )
}