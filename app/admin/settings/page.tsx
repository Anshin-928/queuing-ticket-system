// app/admin/settings/page.tsx
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'

export default function SettingsPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <TuneOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
      <Typography variant="h5" fontWeight="bold" color="text.secondary">
        設定
      </Typography>
      <Chip label="Coming Soon" color="default" />
    </Box>
  )
}
