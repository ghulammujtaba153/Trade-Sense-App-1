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
  Typography ,
  Stack,
} from '@mui/material';
import { API_URL } from '@/configs/url';
import { toast } from 'react-toastify';


const getImageUrl = (url) => {
  return `${API_URL}/${url}`;
}

const AddMusic = ({ onClose, onSuccess, resource = null }) => {
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
      setTags([...res.data, 'daily thought']);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }
    
    toast.info("Uploading image...");

    try {
      setThumbnailFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      
      // Upload thumbnail using FormData
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);
      formDataForUpload.append('type', 'image');

      const res = await axios.post(`${API_URL}/api/file/upload`, formDataForUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrl = res.data.file.path;
      setFormData(prev => ({
        ...prev,
        thumbnail: uploadedUrl
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      toast.error("Error uploading image: " + (error.response?.data?.message || error.message));
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
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error("Please select a valid audio file");
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast.error("Audio file size should not exceed 50MB");
      return;
    }

    setFile(file);

    const audio = document.createElement('audio');
    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      window.URL.revokeObjectURL(audio.src); 
      const durationInSeconds = audio.duration;
      setFormData((prev) => ({ ...prev, duration: durationInSeconds }));
      toast.info(`Audio duration: ${Math.floor(durationInSeconds / 60)}:${Math.floor(durationInSeconds % 60).toString().padStart(2, '0')}`);
    };

    audio.onerror = () => {
      toast.error("Invalid audio file or corrupted file");
      setFile(null);
    };

    audio.src = URL.createObjectURL(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.pillar) {
      toast.error("Pillar is required");
      return;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }
    if (!formData.thumbnail) {
      toast.error("Thumbnail is required");
      return;
    }
    if (!resource && !file) {
      toast.error("Audio file is required");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      let uploadedUrl = formData.url;
      
      if (file) {
        toast.info("Uploading audio file...");
        
        // Create FormData for file upload
        const formDataForUpload = new FormData();
        formDataForUpload.append('file', file);
        formDataForUpload.append('type', 'audio');

        const res = await axios.post(`${API_URL}/api/file/upload`, formDataForUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        });
        
        uploadedUrl = res.data.file.path;
        toast.success("Audio file uploaded successfully!");
      }

      const resourceData = {
        ...formData,
        url: uploadedUrl,
      };

      if (resource) {
        await axios.put(`${API_URL}/api/music/${resource._id}`, resourceData);
        toast.success("Music updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/music`, resourceData);
        toast.success("Music added successfully!");
      }

      setUploading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      toast.error("Error uploading music: " + (err.response?.data?.message || err.message));
      setUploading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {resource ? 'Edit Music' : 'Add Music'}
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
                src={getImageUrl(thumbnailPreview)} 
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
            <Box mt={1} mb={1} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Selected Audio File:</strong>
              </Typography>
              <Typography variant="body2">
                📁 {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📊 Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
              {formData.duration > 0 && (
                <Typography variant="body2" color="text.secondary">
                  ⏱️ Duration: {Math.floor(formData.duration / 60)}:{Math.floor(formData.duration % 60).toString().padStart(2, '0')}
                </Typography>
              )}
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
              {uploading ? 'Loading...' : resource ? 'Update Music' : 'Add Music'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddMusic;
