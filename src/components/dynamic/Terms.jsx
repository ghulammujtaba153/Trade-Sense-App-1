"use client"
import { API_URL } from '@/configs/url';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import PageLoader from '../loaders/PageLoader';

const Terms = () => {
  const [data, setData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTerms = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/terms`);
      setData(res.data ?? { title: '', content: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load terms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/api/terms`, data);
      toast.success(res.data.message || 'Terms updated successfully');
      fetchTerms();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Terms & Conditions
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <PageLoader />
        </Box>
      ) : (
        <Card elevation={3}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                margin="normal"
                value={data.title}
                onChange={handleChange}
              />
              <TextField
                label="Content"
                name="content"
                fullWidth
                multiline
                minRows={6}
                margin="normal"
                value={data.content}
                onChange={handleChange}
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Update Terms'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Terms;
