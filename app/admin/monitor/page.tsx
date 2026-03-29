// app/admin/monitor/page.tsx
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TvOutlinedIcon from '@mui/icons-material/TvOutlined'

export default function MonitorPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <TvOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
      <Typography variant="h5" fontWeight="bold" color="text.secondary">
        呼び出し画面
      </Typography>
      <Chip label="Coming Soon" color="default" />
    </Box>
  )
}
