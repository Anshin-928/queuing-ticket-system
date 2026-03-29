// app/admin/[booth_id]/BoothPanel.tsx
'use client'

import { useTransition } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import PersonIcon from '@mui/icons-material/Person'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import type { Booth, Ticket } from '@/types/database'
import { callNextTicket } from './actions'

interface BoothPanelProps {
  booth: Booth
  calledTicket: Ticket | null
  waitingCount: number
}

export default function BoothPanel({ booth, calledTicket, waitingCount }: BoothPanelProps) {
  const [isCallPending, startCallTransition] = useTransition()

  return (
    <Box sx={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 4 }}>

      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <PhoneInTalkIcon color={calledTicket ? 'primary' : 'disabled'} />
          <Typography variant="h6">
            呼び出し中: <strong>{calledTicket ? `No. ${calledTicket.ticket_number}` : 'なし'}</strong>
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1.5}>
          <HourglassEmptyIcon color={waitingCount > 0 ? 'warning' : 'disabled'} />
          <Typography variant="h6">
            待ち: <strong>{waitingCount}</strong> 組
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => startCallTransition(() => callNextTicket(booth.id))}
        disabled={isCallPending}
        startIcon={isCallPending ? <CircularProgress size={20} color="inherit" /> : <PersonIcon />}
        sx={{ py: 2, fontSize: '1.1rem', borderRadius: 3 }}
      >
        {isCallPending ? '処理中...' : '次の方をどうぞ'}
      </Button>
    </Box>
  )
}
