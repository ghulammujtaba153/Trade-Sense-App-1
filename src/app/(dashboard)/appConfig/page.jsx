'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '@/configs/url';
import PageLoader from '@/components/loaders/PageLoader';

const AppConfigPage = () => {
  const [data, setData] = useState({
    theme: 'dark',
    goalImages: false,
    areaImages: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/config`);
      setData({
        theme: res.data?.theme || 'dark',
        goalImages: res.data?.goalImages ?? false,
        areaImages: res.data?.areaImages ?? false,
      });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch config');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/config`, data);
      toast.success('Config updated successfully');
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen w-full">
        <PageLoader />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        App Configuration
      </Typography>

      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel component="legend">Theme</FormLabel>
        <RadioGroup
          name="theme"
          value={data.theme}
          onChange={handleChange}
          row
        >
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          <FormControlLabel value="light" control={<Radio />} label="Light" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              name="goalImages"
              checked={data.goalImages}
              onChange={handleChange}
            />
          }
          label="Enable Goal Images"
        />
      </Box>

      <Box sx={{ mt: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              name="areaImages"
              checked={data.areaImages}
              onChange={handleChange}
            />
          }
          label="Enable Area Images"
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={submitting && <CircularProgress size={20} />}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Container>
  );
};

export default AppConfigPage;
