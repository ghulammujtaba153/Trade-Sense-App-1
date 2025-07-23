import React, { useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { API_URL } from '@/configs/url'

const ViewMusic = ({ open, onClose, resource }) => {
  const audioRef = useRef(null)

  if (!resource) return null

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pr: 1
        }}
      >
        {resource.title}
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body1">
          <strong>Description:</strong> {resource?.description}
        </Typography>
        {resource?.thumbnail && (
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <img 
              src={`${API_URL}/${resource.thumbnail}`} 
              alt="Thumbnail preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                borderRadius: '8px',
                objectFit: 'cover'
              }} 
            />
          </Box>
        )}

        <Typography variant="body1">
          <strong>Pillar:</strong> {resource.pillar}
        </Typography>
        <Typography variant="body1">
          <strong>Category:</strong> {resource.category}
        </Typography>
        <Typography variant="body1">
          <strong>Tags:</strong> {Array.isArray(resource.tags) ? resource.tags.join(', ') : ''}
        </Typography>
        <Typography variant="body1">
          <strong>Premium:</strong> {resource.isPremium ? 'Yes' : 'No'}
        </Typography>
        
        <Typography variant="body1">
          <strong>Duration:</strong> {formatDuration(resource.duration)}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Audio Player:</strong>
          </Typography>
          <Box
            component="audio"
            controls
            ref={audioRef}
            sx={{ width: '100%', borderRadius: 1 }}
          >
            <source src={`${API_URL}/${resource.url}`} type="audio/mpeg" />
            <source src={`${API_URL}/${resource.url}`} type="audio/wav" />
            <source src={`${API_URL}/${resource.url}`} type="audio/mp3" />
            Your browser does not support the audio element.
          </Box>
        </Box>

      </DialogContent>
    </Dialog>
  )
}

export default ViewMusic
