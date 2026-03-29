// app/admin/[booth_id]/BoothDashboard.tsx
'use client'

import { useState, useTransition } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import CheckIcon from '@mui/icons-material/Check'
import UndoIcon from '@mui/icons-material/Undo'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import type { Booth, Ticket } from '@/types/database'
import {
  callNextTicket,
  callSpecificTicket,
  completeTicket,
  returnToWaiting,
} from './actions'
import { issueTicket } from './checkin/actions'

interface BoothDashboardProps {
  booth: Booth
  tickets: Ticket[]
}

export default function BoothDashboard({ booth, tickets }: BoothDashboardProps) {
  const [partySize, setPartySize] = useState(1)
  const [issueSuspended, setIssueSuspended] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)
  const [issuePending, startIssueTransition] = useTransition()

  const calledTickets = tickets.filter((t) => t.status === 'called')
  const waitingTickets = tickets.filter((t) => t.status === 'waiting')
  const totalPeople = [...calledTickets, ...waitingTickets].reduce((s, t) => s + (t.party_size ?? 0), 0)

  const handleIssue = () => {
    startIssueTransition(async () => {
      const res = await issueTicket(booth.id, partySize)
      if (res.type === 'issued') {
        setSnackbar({ message: `${res.ticketNumber}番 を発券しました`, severity: 'success' })
        setPartySize(1)
      } else {
        setSnackbar({ message: res.message, severity: 'error' })
      }
    })
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>

      {/* ── 左パネル ─────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>

        {/* 上段：待ち組数 ＋ 発券トグル */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>

          {/* 待ち組数 */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                現在の待ち組数
              </Typography>
              <Box display="flex" alignItems="baseline" gap={1} mt={0.5}>
                <Typography variant="h2" fontWeight="bold" lineHeight={1}>
                  {waitingTickets.length + calledTickets.length}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  （{totalPeople}人）
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* 発券モードトグル */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                本日の発券
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Button
                  variant={!issueSuspended ? 'contained' : 'outlined'}
                  color="primary"
                  size="small"
                  onClick={() => setIssueSuspended(false)}
                  sx={{ flex: 1 }}
                >
                  発券する
                </Button>
                <Button
                  variant={issueSuspended ? 'contained' : 'outlined'}
                  color="error"
                  size="small"
                  onClick={() => setIssueSuspended(true)}
                  sx={{ flex: 1 }}
                >
                  中止する
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* タブ ＋ チケットリスト */}
        <Card elevation={2} sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{ px: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}
          >
            <Tab label={`順番待ち（${waitingTickets.length + calledTickets.length}組）`} />
            <Tab label="保留" />
          </Tabs>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            {activeTab === 0 && (
              <>
                {calledTickets.length === 0 && waitingTickets.length === 0 && (
                  <Box display="flex" alignItems="center" justifyContent="center" height={120}>
                    <Typography color="text.disabled">現在の待ちはありません</Typography>
                  </Box>
                )}
                {calledTickets.map((t) => (
                  <TicketRow key={t.id} ticket={t} boothId={booth.id} />
                ))}
                {waitingTickets.map((t) => (
                  <TicketRow key={t.id} ticket={t} boothId={booth.id} />
                ))}
              </>
            )}
            {activeTab === 1 && (
              <Box display="flex" alignItems="center" justifyContent="center" height={120}>
                <Typography color="text.disabled">Coming Soon</Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Box>

      {/* ── 右パネル：発券フォーム ────────────── */}
      <Box sx={{ width: 260, display: 'flex', flexDirection: 'column' }}>
        <Card elevation={2} sx={{ flexGrow: 1 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold">発券する</Typography>
            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" mb={2}>
                人数を入力してください
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">減らす</Typography>
                  <IconButton
                    onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                    size="large"
                    sx={{ bgcolor: 'action.hover', borderRadius: 2 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>

                <Typography variant="h3" fontWeight="bold" sx={{ minWidth: 64, textAlign: 'center' }}>
                  {partySize}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">増やす</Typography>
                  <IconButton
                    onClick={() => setPartySize((p) => p + 1)}
                    size="large"
                    sx={{ bgcolor: 'action.hover', borderRadius: 2 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={issueSuspended || issuePending}
              onClick={handleIssue}
              startIcon={issuePending ? <CircularProgress size={18} color="inherit" /> : <ConfirmationNumberIcon />}
              sx={{ py: 2, fontSize: '1.1rem', borderRadius: 2, mt: 'auto' }}
            >
              {issuePending ? '処理中...' : issueSuspended ? '発券停止中' : 'この内容で発券する'}
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* スナックバー通知 */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar?.severity} onClose={() => setSnackbar(null)} variant="filled">
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

// ── チケット1行分 ────────────────────────────────────
function TicketRow({ ticket, boothId }: { ticket: Ticket; boothId: string }) {
  const [isPending, startTransition] = useTransition()
  const isCalled = ticket.status === 'called'

  const waitTime = Math.floor(
    (Date.now() - new Date(ticket.updated_at).getTime()) / 60000
  )

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        mb: 0.5,
        bgcolor: isCalled ? 'error.50' : 'background.default',
        border: '1px solid',
        borderColor: isCalled ? 'error.200' : 'divider',
        opacity: isPending ? 0.6 : 1,
      }}
    >
      {/* ステータスチップ */}
      <Chip
        label={isCalled ? '呼出中' : '待ち'}
        color={isCalled ? 'error' : 'default'}
        size="small"
        sx={{ minWidth: 56 }}
      />

      {/* 番号 */}
      <Typography variant="h5" fontWeight="bold" sx={{ minWidth: 48 }}>
        {ticket.ticket_number}
      </Typography>

      {/* 人数・時間 */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {ticket.party_size}人 ・ {waitTime}分前
        </Typography>
      </Box>

      {/* アクションボタン */}
      {isCalled ? (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<UndoIcon fontSize="small" />}
            disabled={isPending}
            onClick={() => startTransition(() => returnToWaiting(ticket.id, boothId))}
          >
            取消
          </Button>
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<CheckIcon fontSize="small" />}
            disabled={isPending}
            onClick={() => startTransition(() => completeTicket(ticket.id, boothId))}
          >
            完了
          </Button>
        </Box>
      ) : (
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<PhoneInTalkIcon fontSize="small" />}
          disabled={isPending}
          onClick={() => startTransition(() => callSpecificTicket(ticket.id, boothId))}
        >
          呼出
        </Button>
      )}
    </Box>
  )
}
