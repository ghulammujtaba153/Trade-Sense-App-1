'use client';

import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  MenuItem,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '@/app/context/AuthContext';
import axios from 'axios';
import { API_URL } from '@/configs/url';
import { toast } from 'react-toastify';
import upload from '@/utils/upload';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [ageRange, setAgeRange] = useState(user?.ageRange || '');
  const [password, setPassword] = useState(user?.password);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.profilePic || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      const payload = {
        name,
        email,
        gender,
        phone,
        ageRange,
      };

      if (password && password.length >= 6) {
        payload.password = password;
      }

      if (profilePicture) {
        payload.profilePic = profilePicture;
      }

      const res = await axios.put(`${API_URL}/api/auth/users/update/${user._id}`, payload);
      setUser(res.data.user)
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error updating profile');
    }
  };

  useEffect(() => {
    console.log("context running")
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadedUrl = await upload(file);
      setProfilePicture(uploadedUrl);
      toast.success('Profile picture uploaded');
    } catch (err) {
      toast.error('Failed to upload image');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 6,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={3}>
        Profile
      </Typography>

      <Stack spacing={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={profilePicture} sx={{ width: 56, height: 56 }} />
          <Button component="label" variant="outlined">
            {isUploading ? 'Uploading...' : 'Change Picture'}
            <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
          </Button>
        </Box>

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          select
          label="Gender"
          variant="outlined"
          fullWidth
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value="">Select Gender</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField
          label="Phone"
          variant="outlined"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <TextField
          select
          label="Age Range"
          variant="outlined"
          fullWidth
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
        >
          <MenuItem value="">Select Age Range</MenuItem>
          <MenuItem value="18-24">18-24</MenuItem>
          <MenuItem value="25-34">25-34</MenuItem>
          <MenuItem value="35-44">35-44</MenuItem>
          <MenuItem value="45-64">45-64</MenuItem>
          <MenuItem value="65+">65+</MenuItem>
        </TextField>

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
};

export default ProfilePage;
