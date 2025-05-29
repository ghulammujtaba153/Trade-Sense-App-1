'use client'

import React, { useContext, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '@/app/context/AuthContext';
import axios from 'axios';
import { API_URL } from '@/configs/url';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [ageRange, setAgeRange] = useState(user?.ageRange || '');
  const [password, setPassword] = useState(user?.password || '');
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      const payload = {
        name,
        email,
        gender,
        phone,
        ageRange
      };

      if (password && password.length >= 6) {
        payload.password = password;
      }

      const response = await axios.put(`${API_URL}/api/auth/users/update/${user._id}`, payload);

      console.log(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error updating profile');
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
          <MenuItem value="18-25">18-25</MenuItem>
          <MenuItem value="26-35">26-35</MenuItem>
          <MenuItem value="36-45">36-45</MenuItem>
          <MenuItem value="46-60">46-60</MenuItem>
          <MenuItem value="60+">60+</MenuItem>
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
