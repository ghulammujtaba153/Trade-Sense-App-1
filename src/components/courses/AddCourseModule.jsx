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

import { API_URL } from '@/configs/url';
import { AuthContext } from '@/app/context/AuthContext';
import { uploadToS3 } from '@/utils/upload';

const AddCourseModule = ({ isOpen, onClose, data, onSuccess }) => {
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    duration: 0, // in seconds
    image: '',
    url: '',
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext);
  const [imageUploading, setImageUploading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);

  const resetForm = () => {
    setNewModule({
      title: '',
      description: '',
      duration: 0,
      image: '',
      url: '',
    });
    setFile(null);
    setUploading(false);
    setImageUploading(false);
    setAudioUploading(false);
    setImageUploadProgress(0);
    setAudioUploadProgress(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    setImageUploadProgress(0);
    
    try {
      const response = await uploadToS3(file, (progress) => {
        setImageUploadProgress(progress);
      });
      
      setNewModule((prev) => ({ ...prev, image: response.fileUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
      setImageUploadProgress(0);
    }
  };

  const handleAudio = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Read audio duration using Audio element
    const audio = document.createElement('audio');
    audio.preload = 'metadata';

    audio.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(audio.src); // cleanup
      const durationInSeconds = Math.round(audio.duration);
      setNewModule((prev) => ({ ...prev, duration: durationInSeconds }));

      // Upload the audio file
      setAudioUploading(true);
      setAudioUploadProgress(0);
      
      try {
        const response = await uploadToS3(selectedFile, (progress) => {
          setAudioUploadProgress(progress);
        });
        
        setNewModule((prev) => ({ ...prev, url: response.fileUrl }));
        toast.success('Audio uploaded successfully');
      } catch (error) {
        console.error('Audio upload failed:', error);
        toast.error('Audio upload failed');
      } finally {
        setAudioUploading(false);
        setAudioUploadProgress(0);
      }
    };

    audio.src = URL.createObjectURL(selectedFile);
  };

  const handleSave = async () => {
    if (!newModule.title || !newModule.description || !newModule.url) {
      toast.error('Please fill all fields and upload audio');
      return;
    }

    try {
      setUploading(true);

      const payload = {
        courseID: data._id,
        title: newModule.title,
        description: newModule.description,
        url: newModule.url,
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
    } finally {
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
            {imageUploading ? `Uploading... ${imageUploadProgress > 0 ? `${imageUploadProgress}%` : ''}` : (newModule.image ? 'Change Image' : 'Upload Image')}
            <input
              type="file"
              name="image"
              accept="image/*"
              hidden
              onChange={handleImage}
            />
          </Button>

          {newModule.image && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" mb={1}>Image Preview:</Typography>
              <img 
                src={newModule.image} 
                alt="Module preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  objectFit: 'cover'
                }} 
              />
            </Box>
          )}

          <Button variant="outlined" component="label" disabled={audioUploading}>
            {audioUploading ? `Uploading... ${audioUploadProgress > 0 ? `${audioUploadProgress}%` : ''}` : 'Upload Audio'}
            <input
              type="file"
              name="audio"
              accept="audio/*"
              hidden
              onChange={handleAudio}
            />
          </Button>

          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected file: {file.name}
            </Typography>
          )}

          {newModule.duration > 0 && (
            <Typography variant="body2" color="primary">
              Duration: {Math.round(newModule.duration / 60)} minutes
            </Typography>
          )}

          {newModule.url && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" mb={1}>Audio Preview:</Typography>
              <audio controls src={newModule.url} style={{ width: '100%' }} />
            </Box>
          )}

          {(imageUploading || audioUploading) && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress 
                variant={
                  (imageUploading && imageUploadProgress > 0) || (audioUploading && audioUploadProgress > 0) 
                    ? "determinate" 
                    : "indeterminate"
                }
                value={imageUploading ? imageUploadProgress : audioUploadProgress}
              />
              <Typography variant="caption" display="block" align="center">
                {imageUploading 
                  ? `Uploading image... ${imageUploadProgress > 0 ? `${imageUploadProgress}%` : ''}` 
                  : `Uploading audio... ${audioUploadProgress > 0 ? `${audioUploadProgress}%` : ''}`
                }
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={uploading || imageUploading || audioUploading} variant="contained" color="primary">
          {uploading ? 'Saving...' : 'Save Module'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCourseModule;
