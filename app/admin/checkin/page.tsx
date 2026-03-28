// app/admin/checkin/page.tsx
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TabletMacOutlinedIcon from '@mui/icons-material/TabletMacOutlined'

export default function CheckinPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <TabletMacOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
      <Typography variant="h5" fontWeight="bold" color="text.secondary">
        受付操作
      </Typography>
      <Chip label="Coming Soon" color="default" />
    </Box>
  )
}
