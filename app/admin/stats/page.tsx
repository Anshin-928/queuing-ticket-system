// app/admin/stats/page.tsx
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'

export default function StatsPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <BarChartOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
      <Typography variant="h5" fontWeight="bold" color="text.secondary">
        来場者数ダッシュボード
      </Typography>
      <Chip label="Coming Soon" color="default" />
    </Box>
  )
}
