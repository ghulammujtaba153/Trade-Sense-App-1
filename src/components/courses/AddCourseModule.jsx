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
import { uploadMedia } from '@/utils/upload';
import { API_URL } from '@/configs/url';
import { AuthContext } from '@/app/context/AuthContext';

const AddCourseModule = ({ isOpen, onClose, data, onSuccess }) => {
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'url' && files?.length > 0) {
      setFile(files[0]);
    } else {
      setNewModule((prev) => ({ ...prev, [name]: value }));
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
      };

      await axios.post(`${API_URL}/api/modules`, payload);

      toast.success('Module added successfully!');
      setUploading(false);
      onSuccess?.();
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
        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
