// app/page.tsx
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        順番待ちシステム
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        イベント用リアルタイム整理券発券システム
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} alignItems="center">
        <Link href="/admin/booths" style={{ textDecoration: 'none' }}>
          <Button variant="contained" size="large" sx={{ width: 240 }}>
            ブース管理（スタッフ用）
          </Button>
        </Link>
      </Box>
    </Container>
  )
}
