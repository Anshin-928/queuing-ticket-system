// app/admin/booths/page.tsx
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import { supabase } from '@/lib/supabase'
import BoothCard from './BoothCard'

export const dynamic = 'force-dynamic'

async function getBoothsWithStats() {
  const { data: booths, error: boothsError } = await supabase
    .from('booths')
    .select('*')
    .order('name')

  if (boothsError) throw new Error(boothsError.message)

  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .in('status', ['called', 'waiting'])

  if (ticketsError) throw new Error(ticketsError.message)

  return booths.map((booth) => {
    const boothTickets = tickets.filter((t) => t.booth_id === booth.id)
    const calledTicket = boothTickets.find((t) => t.status === 'called') ?? null
    const waitingCount = boothTickets.filter((t) => t.status === 'waiting').length
    return { booth, calledTicket, waitingCount }
  })
}

export default async function AdminBoothsPage() {
  let boothsData: Awaited<ReturnType<typeof getBoothsWithStats>> = []
  let errorMessage: string | null = null

  try {
    boothsData = await getBoothsWithStats()
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : '不明なエラーが発生しました'
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        ブース管理ダッシュボード
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        各ブースのステータス管理・呼び出し操作を行います。
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          データの取得に失敗しました: {errorMessage}
        </Alert>
      )}

      {boothsData.length === 0 && !errorMessage && (
        <Alert severity="info">
          ブースが登録されていません。Supabaseダッシュボードからブースを追加してください。
        </Alert>
      )}

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={3}
      >
        {boothsData.map(({ booth, calledTicket, waitingCount }) => (
          <BoothCard
            key={booth.id}
            booth={booth}
            calledTicket={calledTicket}
            waitingCount={waitingCount}
          />
        ))}
      </Box>
    </Container>
  )
}
