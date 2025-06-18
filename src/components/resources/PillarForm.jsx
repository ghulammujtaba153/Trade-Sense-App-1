'use client'

import React, { useEffect, useState } from 'react';
import {
  Button, TextField, Chip, Box, Stack, Typography
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '@/configs/url';
import upload from './../../utils/upload';

const PillarForm = ({ onClose, fetchData, editData }) => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editData && typeof editData === 'object') {
      // Safely extract values from editData
      const safeEditData = {
        name: editData.name || '',
        categories: Array.isArray(editData.categories) ? editData.categories : [],
        image: editData.image || '',
      };
      
      setName(safeEditData.name);
      setCategories(safeEditData.categories);
      setImage(safeEditData.image);
      setPreviewUrl(safeEditData.image || null);
    }
  }, [editData]);

  useEffect(() => {
    if (preview && typeof window !== 'undefined') {
      const url = URL.createObjectURL(preview);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [preview]);

  const handleAddCategory = () => {
    const trimmed = categoryInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setCategoryInput('');
    }
  };

  const handleDeleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await upload(file);
      setImage(url);
      setPreview(file);
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: name.trim(), image, categories };

    try {
      if (editData && editData._id) {
        await axios.put(`${API_URL}/api/pillars/categories/${editData._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/pillars/categories`, payload);
      }
      fetchData();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
      <TextField
        label="Pillar Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        autoFocus
      />

      <Button variant="contained" component="label" sx={{ mt: 2 }}>
        Upload Image
        <input hidden type="file" accept="image/*" onChange={handleImage} />
      </Button>

      {mounted && previewUrl && (
        <Box sx={{ mt: 2 }}>
          <img src={previewUrl} alt="Preview" style={{ maxHeight: 150, borderRadius: 8 }} />
        </Box>
      )}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
        <TextField
          label="Add Category"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCategory();
            }
          }}
          fullWidth
          size="small"
        />
        <Button variant="outlined" onClick={handleAddCategory} sx={{ height: 40 }}>
          Add
        </Button>
      </Stack>

      <Box sx={{ mt: 2, mb: 2 }}>
        {categories.length > 0 ? (
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {categories.map((cat, idx) => (
              <Chip
                key={idx}
                label={cat}
                onDelete={() => handleDeleteCategory(cat)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No categories added yet.
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
          {editData && editData._id ? 'Update' : 'Add'}
        </Button>
      </Box>
    </Box>
  );
};

export default PillarForm;
