// app/admin/page.tsx
import { supabase } from '@/lib/supabase'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import StorefrontIcon from '@mui/icons-material/Storefront'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const { data: booths, error } = await supabase
    .from('booths')
    .select('*')
    .order('name')

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 6,
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <StorefrontIcon color="primary" />
          <Typography variant="h4" fontWeight="bold">
            ブース管理
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={4}>
          担当するブースを選択してください。
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            データの取得に失敗しました: {error.message}
          </Alert>
        )}

        {booths?.length === 0 && !error && (
          <Alert severity="info">
            ブースが登録されていません。
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          {booths?.map((booth) => (
            <Link key={booth.id} href={`/admin/${booth.id}`} style={{ textDecoration: 'none' }}>
              <Card elevation={2}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {booth.name}
                        </Typography>
                        <Chip
                          label={booth.status === 'empty' ? '直行モード' : '整理券モード'}
                          color={booth.status === 'empty' ? 'success' : 'warning'}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <ArrowForwardIosIcon fontSize="small" color="action" />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
