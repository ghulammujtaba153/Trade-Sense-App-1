'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '@/configs/url';

const ModuleModal = ({ isOpen, onClose, data, onSuccess }) => {
  const [modules, setModules] = useState(data?.modules || []);

  const handleDeleteModule = (index) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
  };

  const updateModule = async () => {
    try {
      const jsonPayload = {
        creator: data.creator._id,
        title: data.title,
        description: data.description,
        duration: data.duration,
        price: data.price,
        isPremium: data.isPremium,
        certificateAvailable: data.certificateAvailable,
        status: data.status,
        modules: modules,
        thumbnail: data.thumbnail,
      };

      await axios.put(`${API_URL}/api/courses/${data._id}`, jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Course updated successfully');
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error updating course');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Modules</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh' }}>
        {modules.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No modules found.
          </Typography>
        ) : (
          modules.map((module, index) => (
            <Paper
              key={module._id || index}
              sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              elevation={2}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{module.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.content}
                </Typography>
                <audio controls>
  <source src={module.url} type="audio/mpeg" />
  Your browser does not support the audio element.
</audio>

              </Box>
              <IconButton
                onClick={() => handleDeleteModule(index)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={updateModule} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModuleModal;
