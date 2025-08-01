"use client";

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ListItemText from '@mui/material/ListItemText';

import { API_URL } from '@/configs/url';

import { AuthContext } from '@/app/context/AuthContext';

const CourseModal = ({ isOpen, onClose, courseData, onSuccess }) => {
  const [data, setData] = useState({
    title: '',
    thumbnail: '',
    description: '',
    plan: [],
    isPremium: false,
    price: 0,
    certificateAvailable: true,
    status: 'published'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const {user} = useContext(AuthContext)

  console.log("user", user)

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/plans/membership`);
      setPlans(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (courseData) {
      setData({
        title: courseData.title || '',
        thumbnail: courseData.thumbnail || '',
        description: courseData.description || '',
        plan: courseData.plan || [],
        isPremium: courseData.isPremium || false,
        price: courseData.price || 0,
        certificateAvailable: courseData.certificateAvailable || false,
        status: courseData.status || 'published'
      });
      console.log("courseData", courseData)
      setSelectedPlans(courseData.plan || []);
      if (courseData.thumbnail) setThumbnailPreview(courseData.thumbnail);
      setIsEditMode(true);
    } else {
      resetForm();
    }
  }, [courseData]);

  const resetForm = () => {
    setData({
      title: '',
      thumbnail: '',
      description: '',
      plan: [],
      isPremium: false,
      price: 0,
      certificateAvailable: false,
      status: 'published'
    });
    setSelectedPlans([]);
    setThumbnailPreview('');
    setThumbnailUploading(false);
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setThumbnailUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_URL}/api/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(prev => ({ ...prev, thumbnail: response.data.s3Url }));
      toast.success('Thumbnail uploaded successfully');
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      toast.error('Thumbnail upload failed');
      // Reset preview on error
      setThumbnailPreview('');
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handlePlanChange = (event) => {
    const value = typeof event.target.value === 'string'
      ? event.target.value.split(',')
      : event.target.value;

    setSelectedPlans(value);
    setData(prev => ({ ...prev, plan: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const jsonPayload = {
        creator: user.userId || user._id,
        title: data.title,
        description: data.description,
        plan: data.plan,
        price: data.price,
        isPremium: data.isPremium,
        certificateAvailable: data.certificateAvailable,
        status: data.status,
        thumbnail: data.thumbnail // Already uploaded URL
      };

      if (isEditMode) {

        await axios.put(`${API_URL}/api/courses/${courseData._id}`, jsonPayload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Course updated successfully');
      } else {
        await axios.post(`${API_URL}/api/courses`, jsonPayload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Course created successfully');
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isEditMode ? 'Edit Course' : 'Add New Course'}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {error && <Typography color="error" gutterBottom>{error}</Typography>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="title"
            label="Course Title"
            value={data.title}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            name="description"
            label="Description"
            multiline
            rows={4}
            value={data.description}
            onChange={handleChange}
            required
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="plan-select-label">Select Plans</InputLabel>
            <Select
              labelId="plan-select-label"
              multiple
              value={selectedPlans}
              onChange={handlePlanChange}
              input={<OutlinedInput label="Select Plans" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(planId => {
                    const plan = plans.find(p => p._id === planId);
                    return (
                      <Chip key={planId} label={plan ? `${plan.name} ($${plan.price})` : planId} />
                    );
                  })}
                </Box>
              )}
            >
              {plans.map(plan => (
                <MenuItem key={plan._id} value={plan._id}>
                  <Checkbox checked={selectedPlans.indexOf(plan._id) > -1} />
                  <ListItemText primary={`${plan.name} ($${plan.price})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="price"
            label="price"
            value={data.price}
            onChange={handleChange}
            fullWidth
          />

          

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={data.status}
              onChange={handleChange}
              input={<OutlinedInput label="Status" />}
              required
            >
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>

          {thumbnailPreview && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" mb={1}>Thumbnail Preview:</Typography>
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail" 
                style={{ 
                  maxHeight: 200, 
                  maxWidth: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }} 
              />
            </Box>
          )}
          <Button variant="outlined" component="label" disabled={thumbnailUploading}>
            {thumbnailUploading ? 'Uploading...' : (data.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail')}
            <input type="file" hidden accept="image/*" onChange={handleThumbnailChange} />
          </Button>

          {thumbnailUploading && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Uploading thumbnail...
              </Typography>
            </Box>
          )}

          <FormControlLabel
            control={
              <Checkbox
                name="isPremium"
                checked={data.isPremium}
                onChange={handleChange}
              />
            }
            label="Premium Course"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained" onClick={handleSubmit} disabled={loading || thumbnailUploading}>
          {loading ? 'Saving...' : isEditMode ? 'Update Course' : 'Create Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseModal;
