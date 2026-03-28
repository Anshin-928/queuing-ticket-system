// src/components/ComingSoonPage.tsx
'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
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
      <Icon sx={{ fontSize: 64, color: 'text.disabled' }} />
      <Typography variant="h5" fontWeight="bold" color="text.secondary">{text}</Typography>
      <Chip label="Coming Soon" color="default" />
    </Box>
  )
}
