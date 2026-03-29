// src/components/PageHeader.tsx
'use client'

import { usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { allMenuItems } from '@/config/adminMenu'

interface PageHeaderProps {
  boothId: string
}

export default function PageHeader({ boothId }: PageHeaderProps) {
  const pathname = usePathname()
  const rootPath = `/admin/${boothId}`

  const currentItem = allMenuItems.find((item) => {
    const itemPath = item.pathSegment ? `${rootPath}/${item.pathSegment}` : rootPath
    return pathname === itemPath
  })

  if (!currentItem) return null

  const { Icon, text } = currentItem

  return (
    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
      <Icon sx={{ fontSize: '2rem', color: 'text.primary' }} />
      <Typography variant="h4" fontWeight="bold">{text}</Typography>
    </Box>
  )
}
