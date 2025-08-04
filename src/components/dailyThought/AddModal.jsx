'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  LinearProgress,
  Typography,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '@/configs/url';

const AddModal = ({ open, onClose, onAddSuccess, editData }) => {
  const [data, setData] = useState({
    title: '',
    description: '',
    audio: '',
    image: '',
    duration: '',
    instructor: ''
  });

  const [uploadProgress, setUploadProgress] = useState({
    audio: 0,
    image: 0,
  });

  const [instructors, setInstructors] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Fetch instructors
  const fetchInstructors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/editors`);
      setInstructors(res.data.users || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch instructors');
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setData({
        title: editData.title || '',
        description: editData.description || '',
        audio: editData.audio || '',
        image: editData.image || '',
        duration: editData.duration || '',
        instructor: editData.instructor._id || ''
      });
    } else {
      setData({
        title: '',
        description: '',
        audio: '',
        image: '',
        duration: '',
        instructor: ''
      });
    }
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    const name = e.target.name;

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    toast.loading('Uploading...');

    try {
      const res = await axios.post(`${API_URL}/api/file/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(prev => ({ ...prev, [name]: percent }));
        }
      });

      const fileUrl = res.data.s3Url;

      if (name === 'audio') {
        const audio = new Audio(fileUrl);
        audio.onloadedmetadata = () => {
          setData(prev => ({
            ...prev,
            audio: fileUrl,
            duration: audio.duration.toFixed(2),
          }));
        };
      } else {
        setData(prev => ({ ...prev, [name]: fileUrl }));
      }

      toast.success(`${name === 'audio' ? 'Audio' : 'Image'} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${name}`);
      console.error(`Upload failed: ${name}`, error);
    } finally {
      toast.dismiss();
    }
  };

  const handleSubmit = async () => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/api/daily-thought/update/${editData._id}`, data);
        toast.success('Daily thought updated successfully');
      } else {
        await axios.post(`${API_URL}/api/daily-thought/create`, data);
        toast.success('Daily thought added successfully');
      }

      onAddSuccess();
      onClose();
      setUploadProgress({ audio: 0, image: 0 });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save daily thought');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? 'Edit Daily Thought' : 'Add Daily Thought'}</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Title"
            name="title"
            value={data.title}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Description"
            name="description"
            value={data.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />

          {/* Instructor Dropdown */}
          <Box>
            <InputLabel>Instructor</InputLabel>
            <Select
              name="instructor"
              value={data.instructor}
              onChange={handleChange}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>Select Instructor</MenuItem>
              {instructors.map((inst) => (
                <MenuItem key={inst._id} value={inst._id}>
                  {inst.name || inst.email}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Image Upload */}
          <Box>
            <InputLabel>Upload Image</InputLabel>
            <Button
              variant="outlined"
              onClick={() => imageInputRef.current?.click()}
              sx={{ mb: 1 }}
            >
              {data.image ? 'Change Image' : 'Select Image'}
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
            {uploadProgress.image > 0 && (
              <LinearProgress variant="determinate" value={uploadProgress.image} />
            )}
            {data.image && (
              <>
                <Box mt={1} onClick={() => setPreviewOpen(true)} sx={{ cursor: 'pointer' }}>
                  <img
                    src={data.image}
                    alt="uploaded"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Box>
                <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md">
                  <DialogContent>
                    <img src={data.image} alt="preview" style={{ width: '100%' }} />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </Box>

          {/* Audio Upload */}
          <Box>
            <InputLabel>Upload Audio</InputLabel>
            <Button
              variant="outlined"
              onClick={() => audioInputRef.current?.click()}
              sx={{ mb: 1 }}
            >
              {data.audio ? 'Change Audio' : 'Select Audio'}
            </Button>
            <input
              ref={audioInputRef}
              type="file"
              name="audio"
              accept="audio/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
            {uploadProgress.audio > 0 && (
              <LinearProgress variant="determinate" value={uploadProgress.audio} />
            )}
            {data.audio && (
              <Box mt={1}>
                <audio controls src={data.audio} style={{ width: '100%' }} />
                <Typography variant="caption">
                  Duration: {data.duration || 'calculating...'} seconds
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;
