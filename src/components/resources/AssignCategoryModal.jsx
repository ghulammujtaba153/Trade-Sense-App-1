"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '@/configs/url';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';

const AssignCategoryModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/pillars/categories/all`);
      const tagObjects = res.data.categories.map((tag, idx) => ({
        _id: idx.toString(),
        name: tag,
      }));
      setTags(tagObjects);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch tags');
    }
  };

  const handleAssign = async () => {
    try {
      const selectedTagObject = tags.find((tag) => tag._id === selectedTag);
      await axios.post(`${API_URL}/api/auth/category`, {
        userId: user._id,
        tagName: selectedTagObject?.name || '',
      });
      toast.success('Tag assigned successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to assign tag');
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Assign Category to {user?.name}</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-tag-label">Select Category</InputLabel>
          <Select
            labelId="select-tag-label"
            value={selectedTag}
            label="Select Tag"
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <MenuItem value="">Select Category</MenuItem>
            {tags.map((tag) => (
              <MenuItem key={tag._id} value={tag._id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {tags.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No tags found.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleAssign} variant="contained" color="primary" disabled={!selectedTag}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignCategoryModal;
