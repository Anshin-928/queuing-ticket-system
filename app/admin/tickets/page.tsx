// app/admin/tickets/page.tsx
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import QrCodeOutlinedIcon from '@mui/icons-material/QrCodeOutlined'

export default function TicketsPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <QrCodeOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
      <Typography variant="h5" fontWeight="bold" color="text.secondary">
        整理券 PDF生成
      </Typography>
      <Chip label="Coming Soon" color="default" />
    </Box>
  )
}
