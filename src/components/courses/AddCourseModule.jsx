'use client';

import React, { useState } from 'react';
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
import { uploadMedia } from '@/utils/upload';
import { API_URL } from '@/configs/url';

const AddCourseModule = ({ isOpen, onClose, data, onSuccess }) => {
  const [modules, setModules] = useState(data?.modules || []);
  const [newModule, setNewModule] = useState({
    title: '',
    content: '',
    url: '',
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'url' && files.length > 0) {
      setFile(files[0]);
    } else {
      setNewModule((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!newModule.title || !newModule.content || !file) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setUploading(true);
      const uploadedUrl = await uploadMedia(file, setUploadProgress);
      const updatedModules = [...modules, { ...newModule, url: uploadedUrl }];

      const jsonPayload = {
        creator: '62b8e7e7e7e7e7e7e7e7e7e7',
        title: data.title,
        description: data.description,
        duration: data.duration,
        price: data.price,
        isPremium: data.isPremium,
        certificateAvailable: data.certificateAvailable,
        status: data.status,
        modules: updatedModules,
        thumbnail: data.thumbnail,
      };

      await axios.put(`${API_URL}/api/courses/${data._id}`, jsonPayload);

      setUploading(false);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error adding module');
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Module</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Module Title"
            name="title"
            value={newModule.title}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Module Content"
            name="content"
            value={newModule.content}
            onChange={handleInputChange}
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            required
          />
          <Button variant="outlined" component="label">
            Upload Audio/Video
            <input
              type="file"
              name="url"
              accept="video/*,audio/*"
              hidden
              onChange={handleInputChange}
            />
          </Button>
          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected file: {file.name}
            </Typography>
          )}

          {uploading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" align="right">
                {uploadProgress.toFixed(0)}%
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="outlined">
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
