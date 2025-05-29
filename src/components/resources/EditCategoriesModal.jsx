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
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditCategoriesModal = ({ isOpen, onClose, categories: propCategories, user, onSuccess }) => {
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalCategories(propCategories || []);
    }
  }, [isOpen, propCategories]);

  const handleRemove = (name) => {
    setLocalCategories((prev) => prev.filter((cat) => cat !== name));
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/category/update`, {
        userId: user._id,
        categories: localCategories,
      });
      toast.success('Categories updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update categories');
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Categories for {user?.name}</DialogTitle>
      <DialogContent dividers>
        {localCategories.length > 0 ? (
          <List>
            {localCategories.map((cat, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemove(cat)} color="error">
                    <CloseIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={cat} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No categories available.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoriesModal;
