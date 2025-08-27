import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, TextField, Box, LinearProgress
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '@/configs/url';
import { toast } from 'react-toastify';
import { uploadToS3 } from '@/utils/upload';


const EditModule = ({ isOpen, onClose, data, onModuleUpdated }) => {
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    duration: '',
    url: ''
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (data) {
      setEditData({
        title: data.title || '',
        description: data.description || '',
        duration: data.duration || '',
        url: data.url || ''
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAudioChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Get duration of audio file
    const audio = document.createElement('audio');
    audio.preload = 'metadata';

    audio.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(audio.src); // Cleanup
      const durationInSeconds = Math.round(audio.duration);

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      try {
        const response = await uploadToS3(selectedFile, (progress) => {
          setUploadProgress(progress);
        });

        setEditData(prev => ({
          ...prev,
          url: response.fileUrl,
          duration: durationInSeconds
        }));
        toast.success('Audio uploaded successfully!');
      } catch (error) {
        console.error('Audio upload failed:', error);
        toast.error('Audio upload failed!');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    audio.src = URL.createObjectURL(selectedFile);
  };

  const handleEdit = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/modules/${data._id}`, editData);
      toast.success(res.data.message || 'Module updated successfully');
      onModuleUpdated && onModuleUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to edit module');
    }
  };

  const handleClose = () => {
    onClose();
    if (data) {
      setEditData({
        title: data.title || '',
        description: data.description || '',
        duration: data.duration || '',
        url: data.url || ''
      });
      setFile(null);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Course Module</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Title"
            value={editData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Description"
            value={editData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />

                     <TextField
             label="Duration (minutes)"
             value={editData.duration ? Math.round(editData.duration / 60) : ''}
             fullWidth
             variant="outlined"
             disabled
           />

          <Button variant="outlined" component="label" disabled={isUploading}>
            {isUploading ? `Uploading Audio... ${uploadProgress > 0 ? `${uploadProgress}%` : ''}` : 'Upload Audio'}
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={handleAudioChange}
            />
          </Button>

          {file && (
            <Box mt={1} mb={1} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Selected Audio File:</strong>
              </Typography>
              <Typography variant="body2">
                📁 {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📊 Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
              {editData.duration > 0 && (
                <Typography variant="body2" color="primary.main">
                  ⏱️ Duration: {Math.round(editData.duration / 60)} minutes
                </Typography>
              )}
            </Box>
          )}

          {isUploading && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Box textAlign="center" fontSize={12} mt={0.5} color="text.secondary">
                {`Uploading audio file... ${uploadProgress > 0 ? `${uploadProgress}%` : ''}`}
              </Box>
            </Box>
          )}

          {editData.url && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" mb={1}>
                <strong>Audio Preview:</strong>
              </Typography>
              <audio controls src={editData.url} style={{ width: '100%' }} />
              <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                <Box sx={{ color: 'success.dark', fontSize: '0.875rem' }}>
                  ✓ Audio file uploaded successfully
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleEdit} variant="contained" color="primary" disabled={isUploading}>
          Update Module
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModule;
