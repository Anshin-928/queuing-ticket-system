// app/admin/[booth_id]/BoothDashboard.tsx
'use client'

import { useState, useTransition } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import CheckIcon from '@mui/icons-material/Check'
import type { Booth, Ticket } from '@/types/database'
import {
  callSpecificTicket,
  completeTicket,
  returnToWaiting,
} from './actions'
import { issueTicket } from './checkin/actions'

// デザイン
const BLUE            = '#3b72bb'
const GREEN_BTN       = '#45a149'
const GREEN_BTN_HOVER = '#39863d'
const TAB_ACTIVE_BG   = '#3b72bb'
const TAB_INACTIVE_BG = '#e0e0e0'
const ROW_CALLED_BG   = '#fff3f3'

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

  const calledTickets  = tickets.filter((t) => t.status === 'called')
  const waitingTickets = tickets.filter((t) => t.status === 'waiting')
  const totalPeople    = [...calledTickets, ...waitingTickets].reduce((s, t) => s + (t.party_size ?? 0), 0)

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
    <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* ── 左パネル ─────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, p: 2, gap: 2 }}>

        {/* 上段：待ち組数 ＋ 発券モードトグル */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, alignItems: 'start' }}>

          {/* 待ち組数 */}
          <Box>
            <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem', mb: 0.25 }}>
              現在の待ち組数
            </Typography>
            <Box display="flex" alignItems="baseline" gap={1}>
              <Typography sx={{ fontSize: '3rem', fontWeight: 'bold', color: '#111', lineHeight: 1 }}>
                {waitingTickets.length + calledTickets.length}
              </Typography>
              <Typography sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
                （{totalPeople}人）
              </Typography>
            </Box>
          </Box>

          {/* 発券モードトグル */}
          <Box sx={{ justifySelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>
              本日の発券
            </Typography>
            <Box display="flex" gap={2.5}>
              {[
                { label: '発券する', suspended: false },
                { label: '停止する', suspended: true },
              ].map((opt) => {
                const active = issueSuspended === opt.suspended
                return (
                  <Box
                    key={opt.label}
                    onClick={() => setIssueSuspended(opt.suspended)}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer', userSelect: 'none' }}
                  >
                    <Box
                      sx={{
                        width: 22, height: 22, borderRadius: '50%',
                        border: `3px solid ${active ? BLUE : '#bbb'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      {active && (
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: BLUE }} />
                      )}
                    </Box>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: active ? 700 : 400, color: active ? BLUE : 'text.secondary' }}>
                      {opt.label}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>

        {/* タブ ＋ チケットリスト */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

          {/* タブヘッダー */}
          <Box sx={{ display: 'flex', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
            {[
              { label: `順番待ち（${waitingTickets.length + calledTickets.length}組）`, idx: 0 },
              { label: '保留', idx: 1 },
            ].map(({ label, idx }) => {
              const active = activeTab === idx
              return (
                <Box
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  sx={{
                    flex: 1,
                    py: 1.1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: active ? TAB_ACTIVE_BG : TAB_INACTIVE_BG,
                    color: active ? '#fff' : '#555',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    transition: 'background 0.2s, color 0.2s',
                    userSelect: 'none',
                  }}
                >
                  {label}
                </Box>
              )
            })}
          </Box>

          {/* チケット一覧 */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              border: '1px solid #e0e0e0',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              bgcolor: '#fafafa',
            }}
          >
            {activeTab === 0 && (
              <>
                {tickets.length === 0 && (
                  <Box display="flex" alignItems="center" justifyContent="center" height={120}>
                    <Typography color="text.disabled">現在の待ちはありません</Typography>
                  </Box>
                )}
                {tickets.map((t) => (
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
        </Box>
      </Box>

      {/* ── 点線の縦区切り ───────────────────────── */}
      <Box
        sx={{
          width: 0,
          borderLeft: '2px dashed #c8c8c8',
          alignSelf: 'stretch',
          my: 2,
          flexShrink: 0,
        }}
      />

      {/* ── 右パネル：発券フォーム ────────────── */}
      <Box sx={{ width: '22%', minWidth: 220, maxWidth: 320, display: 'flex', flexDirection: 'column', p: 2.5, gap: 2.5 }}>

        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#111' }}>
          発券する
        </Typography>

        {/* 人数選択 */}
        <Box>
          <Typography sx={{ color: 'text.secondary', fontSize: '1rem', mb: 1.5 }}>
            人数を入力してください
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>減らす</Typography>
              <IconButton
                onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                sx={{
                  bgcolor: BLUE,
                  borderRadius: 1,
                  width: 52, height: 52,
                  color: '#fff',
                  '&:hover': { bgcolor: '#133b6b' },
                }}
              >
                <RemoveIcon fontSize="large" />
              </IconButton>
            </Box>

            <Box
              sx={{
                border: '2px solid #333',
                borderRadius: 1,
                minWidth: 68,
                height: 68,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#fff',
              }}
            >
              <Typography sx={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#111', lineHeight: 1 }}>
                {partySize}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>増やす</Typography>
              <IconButton
                onClick={() => setPartySize((p) => p + 1)}
                sx={{
                  bgcolor: BLUE,
                  borderRadius: 1,
                  width: 52, height: 52,
                  color: '#fff',
                  '&:hover': { bgcolor: '#133b6b' },
                }}
              >
                <AddIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* 発券ボタン */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={issueSuspended || issuePending}
          onClick={handleIssue}
          sx={{
            bgcolor: issueSuspended ? '#aaa' : GREEN_BTN,
            color: '#fff',
            py: 1.75,
            borderRadius: 1,
            boxShadow: 'none',
            mt: 'auto',
            '&:hover': { bgcolor: issueSuspended ? '#aaa' : GREEN_BTN_HOVER, boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: '#ddd', color: 'rgba(0,0,0,0.35)' },
          }}
        >
          {issuePending ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} sx={{ color: '#fff' }} />
              <span>処理中...</span>
            </Box>
          ) : issueSuspended ? (
            <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>発券停止中</Typography>
          ) : (
            <Box sx={{ textAlign: 'center', lineHeight: 1.4 }}>
              <Typography sx={{ fontSize: '1rem', opacity: 0.85 }}>この内容で</Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>発券する</Typography>
            </Box>
          )}
        </Button>
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

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderBottom: '1px solid #e8e8e8',
        bgcolor: isCalled ? ROW_CALLED_BG : '#fff',
        borderLeft: isCalled ? '4px solid #e53935' : '4px solid transparent',
        opacity: isPending ? 0.5 : 1,
        transition: 'opacity 0.2s',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* ステータスバッジ */}
      <Box
        sx={{
          bgcolor: isCalled ? '#e53935' : '#546e7a',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '0.78rem',
          width: 48,
          py: 0.5,
          borderRadius: 0.75,
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        {isCalled ? '呼出' : '待ち'}
      </Box>

      {/* 番号・人数・時刻 */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '2rem', color: '#111', lineHeight: 1 }}>
          {ticket.ticket_number}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
          人数 {ticket.party_size}
        </Typography>
        <Typography sx={{ color: 'text.disabled', fontSize: '0.78rem' }}>
          {new Date(ticket.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Box>

      {/* アクションボタン */}
      {isCalled ? (
        <Box display="flex" gap={0.75} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            disabled={isPending}
            onClick={() => startTransition(() => returnToWaiting(ticket.id, boothId))}
            sx={{
              color: '#666',
              borderColor: '#bbb',
              fontSize: '0.72rem',
              py: 0.5,
              px: 1,
              minWidth: 0,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: '#555', bgcolor: 'rgba(0,0,0,0.04)' },
            }}
          >
            呼出<br />取消
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={isPending}
            startIcon={<CheckIcon fontSize="small" />}
            onClick={() => startTransition(() => completeTicket(ticket.id, boothId))}
            sx={{
              bgcolor: '#1565c0',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              py: 0.75,
              '&:hover': { bgcolor: '#0d47a1' },
            }}
          >
            完了
          </Button>
        </Box>
      ) : (
        <Button
          size="small"
          variant="contained"
          disabled={isPending}
          startIcon={<PhoneInTalkIcon fontSize="small" />}
          onClick={() => startTransition(() => callSpecificTicket(ticket.id, boothId))}
          sx={{
            bgcolor: '#1565c0',
            fontWeight: 'bold',
            py: 0.75,
            px: 2,
            '&:hover': { bgcolor: '#0d47a1' },
          }}
        >
          呼出
        </Button>
      )}
    </Box>
  )
}