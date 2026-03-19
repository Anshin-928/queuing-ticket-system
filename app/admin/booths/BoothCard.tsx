'use client'

import { useState, useTransition } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import PersonIcon from '@mui/icons-material/Person'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import type { Booth, Ticket } from '@/types/database'
import { toggleBoothStatus, callNextTicket } from './actions'

interface BoothCardProps {
  booth: Booth
  calledTicket: Ticket | null
  waitingCount: number
}

export default function BoothCard({ booth, calledTicket, waitingCount }: BoothCardProps) {
  const [isPending, startTransition] = useTransition()
  const [isCallPending, startCallTransition] = useTransition()

  const handleToggle = () => {
    startTransition(() => {
      toggleBoothStatus(booth.id, booth.status)
    })
  }

  const handleCallNext = () => {
    startCallTransition(() => {
      callNextTicket(booth.id)
    })
  }

  return (
    <Card sx={{ minWidth: 280, position: 'relative' }} elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="bold">
            {booth.name}
          </Typography>
          <Chip
            label={booth.status === 'empty' ? '直行モード' : '整理券モード'}
            color={booth.status === 'empty' ? 'success' : 'warning'}
            size="small"
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={booth.status === 'crowded'}
              onChange={handleToggle}
              disabled={isPending}
              color="warning"
            />
          }
          label={isPending ? '更新中...' : booth.status === 'empty' ? '空き（直行）' : '混雑（整理券）'}
        />

        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <PhoneInTalkIcon fontSize="small" color={calledTicket ? 'primary' : 'disabled'} />
            <Typography variant="body2">
              呼び出し中:{' '}
              <strong>
                {calledTicket ? `No.${calledTicket.ticket_number}` : 'なし'}
              </strong>
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <HourglassEmptyIcon fontSize="small" color={waitingCount > 0 ? 'warning' : 'disabled'} />
            <Typography variant="body2">
              待ち人数: <strong>{waitingCount}</strong> 組
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={isCallPending ? <CircularProgress size={16} color="inherit" /> : <PersonIcon />}
          onClick={handleCallNext}
          disabled={isCallPending}
        >
          {isCallPending ? '処理中...' : '次の方をどうぞ'}
        </Button>
      </CardActions>
    </Card>
  )
}
