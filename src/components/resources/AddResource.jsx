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
    duration: 0
  });
  const [tags, setTags] = useState([]);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(resource?.thumbnail || '');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
 

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
      setTags([...res.data, 'daily thought']);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnailFile(file);
    
    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
    
    // Upload thumbnail to S3
    setThumbnailUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_URL}/api/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setFormData(prev => ({
        ...prev,
        thumbnail: response.data.s3Url
      }));
      toast.success("Thumbnail uploaded successfully");
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      toast.error("Thumbnail upload failed");
      // Reset preview on error
      setThumbnailPreview(resource?.thumbnail || '');
    } finally {
      setThumbnailUploading(false);
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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Get duration for audio files
    if (formData.type === 'audio') {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = async () => {
        window.URL.revokeObjectURL(audio.src); 
        const durationInSeconds = Math.round(audio.duration);
        setFormData((prev) => ({ ...prev, duration: durationInSeconds }));

        // Upload the media file
        await uploadMediaFile(selectedFile);
      };

      audio.src = URL.createObjectURL(selectedFile);
    } else {
      // For video files, upload immediately
      await uploadMediaFile(selectedFile);
    }
  };

  const uploadMediaFile = async (file) => {
    setMediaUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_URL}/api/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setFormData(prev => ({
        ...prev,
        url: response.data.s3Url
      }));
      toast.success("Media file uploaded successfully");
    } catch (error) {
      console.error('Media upload failed:', error);
      toast.error("Media upload failed");
    } finally {
      setMediaUploading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.pillar || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!resource && !formData.url) {
      toast.error('Please upload a media file');
      return;
    }

    try {
      setUploading(true);

      const resourceData = {
        ...formData,
      };

      if (resource) {
        await axios.put(`${API_URL}/api/resources/${resource._id}`, resourceData);
        toast.success('Resource updated successfully');
      } else {
        await axios.post(`${API_URL}/api/resources`, resourceData);
        toast.success('Resource created successfully');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save resource');
    } finally {
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

          <Button variant="outlined" component="label" fullWidth disabled={thumbnailUploading}>
            {thumbnailUploading ? 'Uploading Thumbnail...' : (formData.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail')}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleThumbnailChange}
            />
          </Button>

          {thumbnailPreview && (
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Box sx={{ mb: 1 }}>
                <strong>Thumbnail Preview:</strong>
              </Box>
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid #ddd'
                }} 
              />
            </Box>
          )}

          <Button variant="outlined" component="label" fullWidth disabled={mediaUploading}>
            {mediaUploading ? `Uploading ${formData.type}...` : `Upload ${formData.type === 'audio' ? 'Audio' : 'Video'} File`}
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
              <strong>Selected File:</strong> {file.name}
              {formData.duration > 0 && (
                <Box sx={{ mt: 0.5, color: 'primary.main' }}>
                  <strong>Duration:</strong> {Math.round(formData.duration / 60)} minutes
                </Box>
              )}
            </Box>
          )}

          {formData.url && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ mb: 1 }}>
                <strong>Media Preview:</strong>
              </Box>
              {formData.type === 'audio' ? (
                <audio controls src={formData.url} style={{ width: '100%' }} />
              ) : (
                <video controls src={formData.url} style={{ width: '100%', maxHeight: '300px' }} />
              )}
              <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                <Box sx={{ color: 'success.dark', fontSize: '0.875rem' }}>
                  ✓ Media file uploaded successfully
                </Box>
              </Box>
            </Box>
          )}

          {(thumbnailUploading || mediaUploading) && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress />
              <Box textAlign="center" fontSize={12} mt={0.5} color="text.secondary">
                {thumbnailUploading ? 'Uploading thumbnail...' : 'Uploading media file...'}
              </Box>
            </Box>
          )}

          <DialogActions sx={{ px: 0, pt: 3 }}>
            <Button onClick={onClose} disabled={uploading || thumbnailUploading || mediaUploading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={uploading || thumbnailUploading || mediaUploading}>
              {uploading ? 'Saving...' : resource ? 'Update Resource' : 'Add Resource'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddResource;
