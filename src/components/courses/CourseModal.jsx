"use client";

import React, { useState, useEffect } from 'react';
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
import upload from '@/utils/upload';

const CourseModal = ({ isOpen, onClose, courseData, onSuccess }) => {
  const [data, setData] = useState({
    title: '',
    thumbnail: '',
    description: '',
    duration: '',
    plan: [],
    modules: [{ title: '', content: '', videoUrl: '' }],
    isPremium: false,
    certificateAvailable: true,
    status: 'published'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);

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
        duration: courseData.duration || '',
        plan: courseData.plan || [],
        modules: courseData.modules?.length
          ? courseData.modules.map(m => ({
              title: m.title || '',
              content: m.content || '',
              videoUrl: m.videoUrl || ''
            }))
          : [{ title: '', content: '', videoUrl: '' }],
        isPremium: courseData.isPremium || false,
        certificateAvailable: courseData.certificateAvailable || false,
        status: courseData.status || 'published'
      });
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
      duration: '',
      plan: [],
      modules: [{ title: '', content: '', videoUrl: '' }],
      isPremium: false,
      certificateAvailable: false,
      status: 'published'
    });
    setSelectedPlans([]);
    setThumbnailPreview('');
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setData(prev => ({ ...prev, thumbnail: file }));
      };
      reader.readAsDataURL(file);
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
      let thumbnailUrl = '';

      if (data.thumbnail instanceof File) {
        thumbnailUrl = await upload(data.thumbnail);
      } else if (data.thumbnail) {
        thumbnailUrl = data.thumbnail;
      }

      const jsonPayload = {
        creator: "62b8e7e7e7e7e7e7e7e7e7e7",
        title: data.title,
        description: data.description,
        duration: data.duration,
        plan: data.plan,
        isPremium: data.isPremium,
        certificateAvailable: data.certificateAvailable,
        status: data.status,
        modules: data.modules,
        thumbnail: thumbnailUrl
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
            name="duration"
            label="Duration"
            value={data.duration}
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
            <Box>
              <img src={thumbnailPreview} alt="Thumbnail" style={{ maxHeight: 120, objectFit: 'cover' }} />
            </Box>
          )}
          <Button variant="outlined" component="label">
            Upload Thumbnail
            <input type="file" hidden accept="image/*" onChange={handleThumbnailChange} />
          </Button>

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
        <Button type="submit" variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : isEditMode ? 'Update Course' : 'Create Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseModal;
