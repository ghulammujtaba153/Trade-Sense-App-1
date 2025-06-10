"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/configs/url';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AdminDrawer = ({ userData, onClose }) => {
  const isEditMode = !!userData;

  const [data, setData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setData({
        name: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        password: '', // always empty on edit
      });
    } else {
      setData({
        name: '',
        phone: '',
        email: '',
        password: '',
      });
      setError('');
      setSuccess(false);
    }
  }, [userData, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      // Prepare payload with role set to 'admin' always
      const payload = { ...data, role: 'admin' };

      // On edit, if password is empty, remove it so backend keeps old password
      if (isEditMode && !payload.password) {
        delete payload.password;
      }

      if (isEditMode) {
        await axios.put(`${API_URL}/api/auth/users/update/${userData._id}`, payload);
        toast.success('User updated successfully');
      } else {
        await axios.post(`${API_URL}/api/auth/register`, payload);
        toast.success('User created successfully');
      }
      setSuccess(true);
      onClose(true); // close drawer and refresh list
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.response?.data?.message || 'Operation failed');
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      p={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        width: { xs: '100%', sm: 400 }
      }} 
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{isEditMode ? 'Edit User' : 'Add User'}</Typography>
        <IconButton onClick={() => onClose(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" mb={2}>
          {isEditMode ? 'User updated successfully!' : 'User added successfully!'}
        </Typography>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <TextField
          label="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
        <TextField
          label="Phone"
          type="tel"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          inputProps={{ minLength: 10, maxLength: 15 }}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />

        <TextField
          label={isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
          type={showPassword ? 'text' : 'password'}
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          minLength={isEditMode ? undefined : 6}
          required={!isEditMode}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 'auto' }}
        >
          {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update User' : 'Add User'}
        </Button>
      </form>
    </Box>
  );
};

export default AdminDrawer;
