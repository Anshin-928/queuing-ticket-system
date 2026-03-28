// app/admin/export/page.tsx
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'

export default function ExportPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <FileDownloadOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
      <Typography variant="h5" fontWeight="bold" color="text.secondary">
        CSVエクスポート
      </Typography>
      <Chip label="Coming Soon" color="default" />
    </Box>
  )
}
