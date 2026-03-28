// src/components/Sidebar.tsx
'use client'

import React from 'react'
import {
  Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Typography, useMediaQuery, useTheme, alpha, Box, Chip,
} from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import { menuGroups, getBoothPath } from '@/config/adminMenu'

export const closedDrawerWidth = 72
export const openDrawerWidth   = 280

interface SidebarProps {
  isSidebarOpen: boolean
  boothId: string
  boothName: string
}

export default function Sidebar({ isSidebarOpen, boothId, boothName }: SidebarProps) {
  const router   = useRouter()
  const pathname = usePathname()
  const theme    = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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

      {isSidebarOpen && (
        <Box sx={{ px: 3, pt: 1, pb: 1 }}>
          <Chip label={boothName} color="primary" size="small" sx={{ fontWeight: 'bold', fontSize: '13px' }} />
        </Box>
      )}

      <List sx={{ px: 0, pt: 0.5 }}>
        {menuGroups.map((group, groupIndex) => (
          <React.Fragment key={group.label}>
            {groupIndex > 0 && (
              <Divider sx={{ my: 1, mx: isSidebarOpen ? 2 : 1, borderColor: theme.palette.divider }} />
            )}

            {isSidebarOpen && (
              <Box sx={{ px: '24px', pt: 0.5, pb: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.disabled, fontWeight: 'bold', letterSpacing: '0.08em', fontSize: '14px' }}
                >
                  {group.label.toUpperCase()}
                </Typography>
              </Box>
            )}

            {group.items.map((item) => {
              const path = getBoothPath(boothId, item.pathSegment)
              const isSelected = pathname === path

              return (
                <ListItem key={item.key} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    onClick={() => router.push(path)}
                    selected={isSelected}
                    sx={{
                      minHeight: 44,
                      ml: isSidebarOpen ? 0 : 1,
                      mr: isSidebarOpen ? 2 : 1,
                      px: 0,
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
                        color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                      }}
                    >
                      <item.Icon />
                    </ListItemIcon>

                    {isSidebarOpen && (
                      <ListItemText
                        primary={item.text}
                        sx={{
                          '& .MuiTypography-root': {
                            fontSize: '16px',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary,
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

        {/* ブース選択に戻る */}
        <Divider sx={{ my: 1, mx: isSidebarOpen ? 2 : 1 }} />
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/admin"
            sx={{
              minHeight: 44,
              ml: isSidebarOpen ? 0 : 1,
              mr: isSidebarOpen ? 2 : 1,
              px: 0,
              borderRadius: isSidebarOpen ? '0 24px 24px 0' : '24px',
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 0, ml: isSidebarOpen ? '24px' : '16px', mr: '16px', justifyContent: 'center', color: theme.palette.text.secondary }}
            >
              <ArrowBackOutlinedIcon />
            </ListItemIcon>
            {isSidebarOpen && (
              <ListItemText
                primary="ブース選択に戻る"
                sx={{ '& .MuiTypography-root': { fontSize: '16px', color: theme.palette.text.secondary } }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}
