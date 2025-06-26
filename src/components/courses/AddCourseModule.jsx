'use client';

import React, { useContext, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  LinearProgress,
  Box,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import upload, { uploadMedia } from '@/utils/upload';
import { API_URL } from '@/configs/url';
import { AuthContext } from '@/app/context/AuthContext';

const AddCourseModule = ({ isOpen, onClose, data, onSuccess }) => {
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    duration: 0, // in seconds
    image: '',
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext);
  const [imageUploading, setImageUploading] = useState(false);

  const resetForm = () => {
    setNewModule({
      title: '',
      description: '',
      duration: 0,
      image: '',
    });
    setFile(null);
    setUploadProgress(0);
    setUploading(false);
    setImageUploading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'url' && files?.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);

      // Read audio duration using Audio element
      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src); // cleanup
        const durationInSeconds = audio.duration;
        setNewModule((prev) => ({ ...prev, duration: durationInSeconds }));
      };

      audio.src = URL.createObjectURL(selectedFile);
    } else {
      setNewModule((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const url = await upload(file);
      setNewModule((prev) => ({ ...prev, image: url }));
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    if (!newModule.title || !newModule.description || !file) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setUploading(true);
      const uploadedUrl = await uploadMedia(file, setUploadProgress);

      const payload = {
        courseID: data._id,
        title: newModule.title,
        description: newModule.description,
        url: uploadedUrl,
        duration: newModule.duration,
      };

      if (newModule.image) {
        payload.image = newModule.image; // only add if available
      }

      await axios.post(`${API_URL}/api/modules`, payload);

      toast.success('Module added successfully!');
      onSuccess?.();
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error adding module');
      setUploading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Module</DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Module Title"
            name="title"
            value={newModule.title}
            onChange={handleInputChange}
            fullWidth
            required
          />

          <TextField
            label="Module Description"
            name="description"
            value={newModule.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            minRows={4}
            required
          />

          <Button variant="outlined" component="label" disabled={imageUploading}>
            {newModule.image ? 'Change Image' : 'Upload Image'}
            <input
              type="file"
              name="image"
              accept="image/*"
              hidden
              onChange={handleImage}
            />
          </Button>

          <Button variant="outlined" component="label">
            Upload Audio
            <input
              type="file"
              name="url"
              accept="audio/*"
              hidden
              onChange={handleInputChange}
            />
          </Button>

          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected file: {file.name}
            </Typography>
          )}

          {newModule.duration > 0 && (
            <Typography variant="body2" color="primary">
              Duration: {Math.round(newModule.duration)} seconds
            </Typography>
          )}

          {uploading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" display="block" align="right">
                {uploadProgress.toFixed(0)}%
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={uploading} variant="contained" color="primary">
          {uploading ? 'Uploading...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCourseModule;
