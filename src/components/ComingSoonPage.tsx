// src/components/ComingSoonPage.tsx
'use client'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { getMenuItemByKey } from '@/config/adminMenu'

interface ComingSoonPageProps {
  itemKey: string
}

export default function ComingSoonPage({ itemKey }: ComingSoonPageProps) {
  const item = getMenuItemByKey(itemKey)
  if (!item) return null

  const { Icon, text } = item

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <Chip label="Coming Soon" color="default" />
    </Box>
  )
}
