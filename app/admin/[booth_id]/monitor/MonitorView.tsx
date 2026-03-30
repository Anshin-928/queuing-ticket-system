// app/admin/[booth_id]/monitor/MonitorView.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { supabase } from '@/lib/supabase'
import type { Booth, Ticket } from '@/types/database'

interface MonitorViewProps {
  booth: Booth
  initialTickets: Ticket[]
}

export default function MonitorView({ booth, initialTickets }: MonitorViewProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)

  const fetchTickets = useCallback(async () => {
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('booth_id', booth.id)
      .in('status', ['called', 'waiting', 'on_hold'])
      .order('ticket_number', { ascending: true })
    if (data) setTickets(data)
  }, [booth.id])

  useEffect(() => {
    const channel = supabase
      .channel(`monitor-${booth.id}`)
      .on(
        'postgres_changes',
        // filter なしで tickets 全体を購読（filtered subscription は REPLICA IDENTITY FULL が必要なため）
        { event: '*', schema: 'public', table: 'tickets' },
        () => { fetchTickets() }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [booth.id, fetchTickets])

  const calledTickets  = tickets.filter((t) => t.status === 'called')
  const waitingTickets = tickets.filter((t) => t.status === 'waiting')
  const onHoldTickets  = tickets.filter((t) => t.status === 'on_hold')

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f0f2f5', overflow: 'hidden' }}>

      {/* ── ボディ（2カラム） ───────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flexGrow: 1, minHeight: 0 }}>

        {/* 左：呼び出し中 */}
        <Box sx={{
          bgcolor: '#fff', borderRight: '1px solid #e8e8e8',
          p: '28px', display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {/* セクションラベル */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 22, borderRadius: 99, bgcolor: '#e53935', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '28px', fontWeight: 'bold', color: '#555', letterSpacing: '0.04em' }}>
              ただいまご案内中の番号
            </Typography>
          </Box>

          {/* 呼び出し中カード */}
          {calledTickets.length === 0 ? (
            <Box sx={{ py: 4 }}>
              <Typography sx={{ fontSize: '50px', color: '#bbb' }}>
                現在お呼びしている番号はありません
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {calledTickets.map((t) => (
                <Box key={t.id} sx={{
                  position: 'relative',
                  width: 160, height: 160,
                  bgcolor: '#ffffff', border: '2.5px solid #e53935', borderRadius: '10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 1px 6px rgba(0,0,0,0.1)',
                }}>
                  <Typography sx={{ fontSize: '80px', fontWeight: 500, color: '#1a1a1a', lineHeight: 1, mb: '20px' }}>
                    {t.ticket_number}
                  </Typography>
                  <Box sx={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <PeopleAltOutlinedIcon sx={{ fontSize: '16px', color: 'secondary' }} />
                    <Typography sx={{ fontSize: '18px', color: 'secondary' }}>{t.party_size}人</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* 右：順番待ち一覧 */}
        <Box sx={{
          bgcolor: '#fafafa', p: '28px',
          display: 'flex', flexDirection: 'column', gap: 1.5,
          overflow: 'hidden',
        }}>
          {/* セクションラベル */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Box sx={{ width: 4, height: 22, borderRadius: 99, bgcolor: '#274a79', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '28px', fontWeight: 'bold', color: '#555', letterSpacing: '0.04em' }}>
              順番待ちの方
            </Typography>
          </Box>

          {/* 待ちカード */}
          <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
            {waitingTickets.length === 0 ? (
              <Typography sx={{ fontSize: '50px', color: '#bbb', py: 2 }}>
                順番待ちの方はいません
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {waitingTickets.map((t) => (
                  <Box key={t.id} sx={{
                    position: 'relative',
                    width: 140, height: 140,
                    bgcolor: '#fff', border: '2px solid #274a79', borderRadius: '10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 1px 6px rgba(0,0,0,0.1)',
                  }}>
                    <Typography sx={{ fontSize: '64px', fontWeight: 500, color: '#1a1a1a', lineHeight: 1, mb: '20px' }}>
                      {t.ticket_number}
                    </Typography>
                    <Box sx={{ position: 'absolute', bottom: 8, right: 10, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <PeopleAltOutlinedIcon sx={{ fontSize: '14px', color: 'secondary' }} />
                      <Typography sx={{ fontSize: '18px', color: 'secondary' }}>{t.party_size}人</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── 保留セクション（on_hold がある場合のみ表示） ── */}
      {onHoldTickets.length > 0 && (
        <Box sx={{
          borderTop: '1px solid #e8e8e8',
          px: '28px', py: 2,
          bgcolor: '#fffcf5',
          display: 'flex', flexDirection: 'column', gap: 1.25,
          flexShrink: 0,
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 20, borderRadius: 99, bgcolor: '#ef6c00', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#bf5000', letterSpacing: '0.03em' }}>
                不在のため保留中のお客様
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold',color: '#bf5000', opacity: 0.75, ml: '12px', mt: '4px' }}>
              先ほどお呼びしましたが不在でした。お戻りの際はスタッフまでお声がけください。
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', mt: '2px' }}>
            {onHoldTickets.map((t) => (
              <Box key={t.id} sx={{
                position: 'relative',
                width: 110, height: 110,
                bgcolor: '#fff', border: '1.5px solid #ef6c00', borderRadius: '8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 1px 6px rgba(0,0,0,0.1)',
              }}>
                <Typography sx={{ fontSize: '60px', fontWeight: 500, color: '#bf5000', lineHeight: 1, mb: '18px' }}>
                  {t.ticket_number}
                </Typography>
                <Box sx={{ position: 'absolute', bottom: 7, right: 9, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <PeopleAltOutlinedIcon sx={{ fontSize: '16px', color: '#bf5000', opacity: 0.6 }} />
                  <Typography sx={{ fontSize: '16px', color: '#bf5000', opacity: 0.6 }}>{t.party_size}人</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
