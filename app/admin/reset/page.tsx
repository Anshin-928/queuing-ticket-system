// app/admin/reset/page.tsx
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'

export default function ResetPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <RestartAltOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
      <Typography variant="h5" fontWeight="bold" color="text.secondary">
        イベント初期化
      </Typography>
      <Chip label="Coming Soon" color="default" />
    </Box>
  )
}
