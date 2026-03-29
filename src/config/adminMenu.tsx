// src/config/adminMenu.tsx

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import TvOutlinedIcon           from '@mui/icons-material/TvOutlined'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import SettingsOutlinedIcon     from '@mui/icons-material/SettingsOutlined'
import RestartAltOutlinedIcon   from '@mui/icons-material/RestartAltOutlined'
import type { SvgIconComponent } from '@mui/icons-material'

export interface MenuItemConfig {
  key: string
  text: string
  pathSegment: string | null
  Icon: SvgIconComponent
}

export interface MenuGroupConfig {
  label: string
  items: MenuItemConfig[]
}

export const menuGroups: MenuGroupConfig[] = [
  {
    label: '運営当日',
    items: [
      { key: 'dashboard', text: '管理画面TOP', pathSegment: 'dashboard', Icon: DashboardOutlinedIcon },
      { key: 'monitor', text: '呼び出し画面', pathSegment: 'monitor', Icon: TvOutlinedIcon },
    ],
  },
  {
    label: '事前準備',
    items: [
      { key: 'tickets', text: '整理券PDF生成', pathSegment: 'tickets', Icon: ConfirmationNumberOutlinedIcon },
      { key: 'settings', text: '設定', pathSegment: 'settings', Icon: SettingsOutlinedIcon },
      { key: 'reset', text: 'イベント初期化', pathSegment: 'reset', Icon: RestartAltOutlinedIcon },
    ],
  },
]

export const allMenuItems = menuGroups.flatMap((g) => g.items)

export function getMenuItemByKey(key: string): MenuItemConfig | undefined {
  return allMenuItems.find((item) => item.key === key)
}

export function getBoothPath(boothId: string, pathSegment: string | null): string {
  return pathSegment ? `/admin/${boothId}/${pathSegment}` : `/admin/${boothId}`
}