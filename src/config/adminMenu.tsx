// src/config/adminMenu.tsx

import StorefrontOutlinedIcon   from '@mui/icons-material/StorefrontOutlined'
import LaptopOutlinedIcon       from '@mui/icons-material/LaptopOutlined'
import TvOutlinedIcon           from '@mui/icons-material/TvOutlined'
import QrCodeOutlinedIcon       from '@mui/icons-material/QrCodeOutlined'
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
      { key: 'dashboard', text: 'ブース管理',       pathSegment: null,       Icon: StorefrontOutlinedIcon },
      { key: 'checkin',   text: '受付操作',         pathSegment: 'checkin',  Icon: LaptopOutlinedIcon },
      { key: 'monitor',   text: '呼び出しモニター', pathSegment: 'monitor',  Icon: TvOutlinedIcon },
    ],
  },
  {
    label: '事前準備',
    items: [
      { key: 'tickets',   text: '整理券 PDF生成', pathSegment: 'tickets',  Icon: QrCodeOutlinedIcon },
      { key: 'settings',  text: 'ブース設定',     pathSegment: 'settings', Icon: SettingsOutlinedIcon },
      { key: 'reset',     text: 'イベント初期化', pathSegment: 'reset',    Icon: RestartAltOutlinedIcon },
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
