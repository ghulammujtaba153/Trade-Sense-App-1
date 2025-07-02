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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';

const Page = () => {
  const [data, setData] = useState({
    email: '',
    reason: '',
    agreed: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!data.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Invalid email format';

    if (!data.reason) newErrors.reason = 'Reason is required';
    if (!data.agreed) newErrors.agreed = 'You must agree before submitting';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setOpenConfirm(true);
  };

  const confirmDeletion = () => {
    setOpenConfirm(false);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Account deletion request submitted!');
      setData({ email: '', reason: '', agreed: false });
    }, 1500);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Paper elevation={4} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center">
          Delete Account
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <TextField
            name="email"
            label="Email"
            type="email"
            value={data.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            name="reason"
            label="Reason for deletion"
            multiline
            rows={4}
            value={data.reason}
            onChange={handleChange}
            error={!!errors.reason}
            helperText={errors.reason}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                name="agreed"
                checked={data.agreed}
                onChange={handleChange}
                color="error"
              />
            }
            label="I understand this action is permanent"
          />
          {errors.agreed && (
            <Typography color="error" variant="body2" sx={{ ml: 1.5 }}>
              {errors.agreed}
            </Typography>
          )}

          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit this account deletion request? This action is
            irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeletion} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Page;
