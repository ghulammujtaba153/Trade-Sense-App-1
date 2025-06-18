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

const ViewResource = ({ open, onClose, resource }) => {
  const videoRef = useRef(null)

  if (!resource) return null

  // Key for localStorage, unique per resource _id
  const storageKey = `video-progress-${resource._id}`

  // Load saved time when metadata is loaded
  const handleLoadedMetadata = () => {
    const savedTime = localStorage.getItem(storageKey)
    if (videoRef.current && savedTime) {
      videoRef.current.currentTime = parseFloat(savedTime)
    }
  }

  // Save time periodically while video is playing
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      localStorage.setItem(storageKey, videoRef.current.currentTime)
      console.log(`Saved at: ${videoRef.current.currentTime}`)
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      localStorage.setItem(storageKey, videoRef.current.currentTime)
      console.log(`Paused at: ${videoRef.current.currentTime}`)
    }
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
          <strong>Type:</strong> {resource.type}
        </Typography>

        <Typography variant="body1">
          <strong>Description:</strong> {resource?.description}
        </Typography>
        <Box sx={{ mt: 1, textAlign: 'center' }}>
              <img 
                src={resource?.thumbnail} 
                alt="Thumbnail preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  objectFit: 'cover'
                }} 
              />
            </Box>

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



        {resource.type === 'audio' ? (
          <Box component="audio" controls sx={{ width: '100%', borderRadius: 1 }}>
            <source src={resource.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </Box>
        ) : (
          <Box
            component="video"
            controls
            ref={videoRef}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePause}
            sx={{ width: '100%', mt: 2, borderRadius: 1 }}
          >
            <source src={resource.url} type="video/mp4" />
            Your browser does not support the video tag.
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewResource
