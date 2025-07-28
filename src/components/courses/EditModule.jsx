import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, TextField, Box, LinearProgress
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '@/configs/url';
import { toast } from 'react-toastify';
import { uploadMedia } from '@/utils/upload';

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
      try {
        const uploadedUrl = await uploadMedia(selectedFile, setUploadProgress);
        setEditData(prev => ({
          ...prev,
          url: uploadedUrl,
          duration: durationInSeconds
        }));
        toast.success('Audio uploaded successfully!');
      } catch (error) {
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
            label="Duration (sec)"
            value={editData.duration}
            fullWidth
            variant="outlined"
            disabled
          />

          <Button variant="outlined" component="label">
            Upload Audio
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={handleAudioChange}
            />
          </Button>

          {isUploading && (
            <Box>
              <Typography variant="body2">Uploading...</Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          {editData.url && (
            <Box mt={2}>
              <Typography variant="body2" mb={1}>Preview:</Typography>
              <audio controls src={editData.url} style={{ width: '100%' }} />
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
