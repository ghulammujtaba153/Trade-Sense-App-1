import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Checkbox,
  FormControlLabel,
  Chip,
  Box,
  LinearProgress,
  Stack,
} from '@mui/material';
import { API_URL } from '@/configs/url';
import upload, { uploadMedia } from '@/utils/upload';
import { toast } from 'react-toastify';

const AddResource = ({ onClose, onSuccess, resource = null }) => {
  const [pillars, setPillars] = useState([]);
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    thumbnail: resource?.thumbnail || '',
    type: resource?.type || 'audio',
    category: resource?.category || '',
    tags: resource?.tags || [],
    pillar: resource?.pillar || '',
    isPremium: resource?.isPremium || false,
    url: resource?.url || '',
  });
  const [tags, setTags] = useState([]);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(resource?.thumbnail || '');
 

  const fetchPillars = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/pillars/categories`);
      setPillars(res.data);
    } catch (error) {
      console.error("Failed to fetch pillars:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tags`);
      setTags(res.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.info("uploading image")

    try {
      setThumbnailFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      
      // Upload thumbnail
      const uploadedUrl = await upload(file);
      setFormData(prev => ({
        ...prev,
        thumbnail: uploadedUrl
      }));
      toast.info("image uploaded successfully")
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      toast.error("error uploading image")
    } 
  };

  useEffect(() => {
    fetchPillars();
    fetchTags();
  }, []);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const getCategoriesForPillar = (pillarName) => {
    const pillar = pillars.find(p => p.name === pillarName);
    return pillar ? pillar.categories : [];
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'pillar' && { category: '' }), // reset category on pillar change
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      let uploadedUrl = formData.url;
      if (file) {
        uploadedUrl = await uploadMedia(file, setUploadProgress);
      }

      const resourceData = {
        ...formData,
        url: uploadedUrl,
      };

      if (resource) {
        await axios.put(`${API_URL}/api/resources/${resource._id}`, resourceData);
      } else {
        await axios.post(`${API_URL}/api/resources`, resourceData);
      }

      setUploading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setUploading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {resource ? 'Edit Resource' : 'Add Resource'}
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Title"
            name="title"
            required
            fullWidth
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter resource description..."
          />

          <FormControl fullWidth>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItem value="audio">Audio</MenuItem>
              <MenuItem value="video">Video</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="pillar-label">Pillar</InputLabel>
            <Select
              labelId="pillar-label"
              label="Pillar"
              name="pillar"
              value={formData.pillar}
              onChange={handleChange}
            >
              <MenuItem value="">Select Pillar</MenuItem>
              {pillars.map(p => (
                <MenuItem key={p._id} value={p.name}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!formData.pillar}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <MenuItem value="">Select Category</MenuItem>
              {getCategoriesForPillar(formData.pillar).map(cat => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <InputLabel>Tags</InputLabel>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
              {tags.map(tag => (
                <Chip
                  key={tag._id}
                  label={tag}
                  clickable
                  color={formData.tags.includes(tag) ? 'primary' : 'default'}
                  onClick={() => toggleTag(tag)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleChange}
              />
            }
            label="Premium Content"
          />

          <Button variant="outlined" component="label" fullWidth>
            Upload Thumbnail
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleThumbnailChange}
            />
          </Button>

          {thumbnailPreview && (
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  objectFit: 'cover'
                }} 
              />
            </Box>
          )}

          <Button variant="outlined" component="label" fullWidth>
            Upload {formData.type === 'audio' ? 'Audio' : 'Video'} File
            <input
              type="file"
              hidden
              accept={formData.type === 'audio' ? 'audio/*' : 'video/*'}
              required={!resource}
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Box mt={1} mb={1}>
              Selected File: {file.name}
            </Box>
          )}

          {uploading && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Box textAlign="right" fontSize={12} mt={0.5}>
                {uploadProgress}%
              </Box>
            </Box>
          )}

          <DialogActions sx={{ px: 0, pt: 3 }}>
            <Button onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={uploading}>
              {uploading ? 'Loading...' : resource ? 'Update Resource' : 'Add Resource'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddResource;
