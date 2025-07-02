'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';

const Page = () => {
  const [data, setData] = useState({
    email: '',
    reason: '',
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!data.email || !data.reason || !data.agreed) {
      toast.error('Please complete all fields and agree to the terms');
      return;
    }

    // API call logic here
    toast.success('Request submitted');
  };

  return (
    <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", maxWidth: "100%" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Delete Account
        </Typography>

        <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
          <TextField
            name="email"
            label="Email"
            type="email"
            value={data.email}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            name="reason"
            label="Reason for deletion"
            multiline
            rows={4}
            value={data.reason}
            onChange={handleChange}
            fullWidth
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                name="agreed"
                checked={data.agreed}
                onChange={handleChange}
              />
            }
            label="I agree to delete my account permanently"
          />

          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Page;
