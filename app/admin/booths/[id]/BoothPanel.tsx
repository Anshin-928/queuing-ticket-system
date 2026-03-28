// app/admin/booths/[id]/BoothPanel.tsx
'use client'

import { useTransition } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import PersonIcon from '@mui/icons-material/Person'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import type { Booth, Ticket } from '@/types/database'
import { toggleBoothStatus, callNextTicket } from '../actions'

interface BoothPanelProps {
  booth: Booth
  calledTicket: Ticket | null
  waitingCount: number
}

export default function BoothPanel({ booth, calledTicket, waitingCount }: BoothPanelProps) {
  const [isTogglePending, startToggleTransition] = useTransition()
  const [isCallPending, startCallTransition] = useTransition()

  const handleToggle = () => {
    startToggleTransition(() => {
      toggleBoothStatus(booth.id, booth.status)
    })
  }

  const handleCallNext = () => {
    startCallTransition(() => {
      callNextTicket(booth.id)
    })
  }

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* ブース名 & モード */}
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Typography variant="h4" fontWeight="bold">
          {booth.name}
        </Typography>
        <Chip
          label={booth.status === 'empty' ? '直行モード' : '整理券モード'}
          color={booth.status === 'empty' ? 'success' : 'warning'}
        />
      </Box>

      <Divider />

      {/* 現在の呼び出し状況 */}
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <PhoneInTalkIcon color={calledTicket ? 'primary' : 'disabled'} />
          <Typography variant="h6">
            呼び出し中:{' '}
            <strong>{calledTicket ? `No. ${calledTicket.ticket_number}` : 'なし'}</strong>
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

      {/* モード切替 */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          モード切替
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={booth.status === 'crowded'}
              onChange={handleToggle}
              disabled={isTogglePending}
              color="warning"
              size="medium"
            />
          }
          label={
            <Typography variant="body1">
              {isTogglePending ? '更新中...' : booth.status === 'empty' ? '空き（直行）' : '混雑（整理券）'}
            </Typography>
          }
        />
      </Box>

      {/* 呼び出しボタン */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleCallNext}
        disabled={isCallPending}
        startIcon={isCallPending ? <CircularProgress size={20} color="inherit" /> : <PersonIcon />}
        sx={{ py: 2, fontSize: '1.1rem', borderRadius: 3 }}
      >
        {isCallPending ? '処理中...' : '次の方をどうぞ'}
      </Button>
    </Box>
  )
}
