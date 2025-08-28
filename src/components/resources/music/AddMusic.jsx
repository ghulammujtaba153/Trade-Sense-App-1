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
import { uploadToS3 } from '@/utils/upload';




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
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(resource?.thumbnail || '');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
 

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

    setThumbnailFile(file);
    
    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
    
    // Upload thumbnail to S3
    setThumbnailUploading(true);
    setThumbnailUploadProgress(0);

    try {
      const response = await uploadToS3(file, (progress) => {
        setThumbnailUploadProgress(progress);
      });

      setFormData(prev => ({
        ...prev,
        thumbnail: response.fileUrl
      }));
      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      toast.error("Thumbnail upload failed");
      // Reset preview on error
      setThumbnailPreview(resource?.thumbnail || '');
    } finally {
      setThumbnailUploading(false);
      setThumbnailUploadProgress(0);
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

    // Validate file type
    if (!selectedFile.type.startsWith('audio/')) {
      toast.error("Please select a valid audio file");
      return;
    }

    

    setFile(selectedFile);

    const audio = document.createElement('audio');
    audio.preload = 'metadata';

    audio.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(audio.src); 
      const durationInSeconds = Math.round(audio.duration);
      setFormData((prev) => ({ ...prev, duration: durationInSeconds }));
      
      // Upload the audio file immediately
      await uploadAudioFile(selectedFile);
    };

    audio.onerror = () => {
      toast.error("Invalid audio file or corrupted file");
      setFile(null);
    };

    audio.src = URL.createObjectURL(selectedFile);
  };

  const uploadAudioFile = async (file) => {
    setAudioUploading(true);
    setAudioUploadProgress(0);
    
    try {
      const response = await uploadToS3(file, (progress) => {
        setAudioUploadProgress(progress);
      });
      
      setFormData(prev => ({
        ...prev,
        url: response.fileUrl
      }));
      toast.success("Audio file uploaded successfully!");
    } catch (error) {
      console.error('Audio upload failed:', error);
      toast.error("Audio upload failed");
    } finally {
      setAudioUploading(false);
      setAudioUploadProgress(0);
    }
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
    if (!resource && !formData.url) {
      toast.error("Audio file is required");
      return;
    }

    try {
      setUploading(true);

      const resourceData = {
        ...formData,
      };

      if (resource) {
        await axios.put(`${API_URL}/api/music/${resource._id}`, resourceData);
        toast.success("Music updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/music`, resourceData);
        toast.success("Music added successfully!");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      toast.error("Failed to save music");
    } finally {
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

          <Button variant="outlined" component="label" fullWidth disabled={thumbnailUploading}>
            {thumbnailUploading ? `Uploading Thumbnail... ${thumbnailUploadProgress > 0 ? `${thumbnailUploadProgress}%` : ''}` : (formData.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail')}
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

          <Button variant="outlined" component="label" fullWidth disabled={audioUploading}>
            {audioUploading ? `Uploading Audio... ${audioUploadProgress > 0 ? `${audioUploadProgress}%` : ''}` : 'Upload Audio File'}
            <input
              type="file"
              hidden
              accept="audio/*"
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
                <Typography variant="body2" color="primary.main">
                  ⏱️ Duration: {Math.round(formData.duration / 60)} minutes
                </Typography>
              )}
            </Box>
          )}

          {formData.url && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ mb: 1 }}>
                <strong>Audio Preview:</strong>
              </Box>
              <audio controls src={formData.url} style={{ width: '100%' }} />
              <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                <Box sx={{ color: 'success.dark', fontSize: '0.875rem' }}>
                  ✓ Audio file uploaded successfully
                </Box>
              </Box>
            </Box>
          )}

          {(thumbnailUploading || audioUploading) && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress 
                variant={
                  (thumbnailUploading && thumbnailUploadProgress > 0) || (audioUploading && audioUploadProgress > 0) 
                    ? "determinate" 
                    : "indeterminate"
                }
                value={thumbnailUploading ? thumbnailUploadProgress : audioUploadProgress}
              />
              <Box textAlign="center" fontSize={12} mt={0.5} color="text.secondary">
                {thumbnailUploading 
                  ? `Uploading thumbnail... ${thumbnailUploadProgress > 0 ? `${thumbnailUploadProgress}%` : ''}` 
                  : `Uploading audio file... ${audioUploadProgress > 0 ? `${audioUploadProgress}%` : ''}`
                }
              </Box>
            </Box>
          )}

          <DialogActions sx={{ px: 0, pt: 3 }}>
            <Button onClick={onClose} disabled={uploading || thumbnailUploading || audioUploading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={uploading || thumbnailUploading || audioUploading}>
              {uploading ? 'Saving...' : resource ? 'Update Music' : 'Add Music'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddMusic;
