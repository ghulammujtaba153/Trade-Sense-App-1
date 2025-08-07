"use client"

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';

const faqData = [
  {
    question: 'How can I reset my trading password?',
    answer: 'Go to Account Settings > Security > Reset Password. Follow the instructions sent to your email.',
  },
  {
    question: 'Why was my transaction declined?',
    answer: 'It might be due to insufficient balance or security restrictions. Contact support for details.',
  },
  {
    question: 'How to verify my identity?',
    answer: 'Upload your ID proof and address document in the Verification section under your profile.',
  },
];

const SupportPage = () => {
  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setSnackbar({
        open: true,
        message: 'Please fill out all fields.',
        severity: 'error',
      });
      return;
    }

    // Simulate a successful submission
    setSnackbar({
      open: true,
      message: 'Your message has been submitted!',
      severity: 'success',
    });

    // Reset form
    setForm({
      name: '',
      email: '',
      message: '',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Support Center
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Find answers to common questions or reach out to our team for help.
      </Typography>

      {/* Support Categories */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <SupportAgentIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={2}>
                General Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                FAQs, contact options, and app-related help.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <AccountBalanceIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={2}>
                Trading & Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Issues with trading, login, or settings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <PaymentsIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={2}>
                Billing & Payments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment methods, deposits, and withdrawals.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Typography variant="h5" gutterBottom>
        Frequently Asked Questions
      </Typography>
      {faqData.map((item, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Contact Form */}
      <Box mt={6} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Contact Support
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Can’t find what you're looking for? Submit your issue below.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="name"
              label="Full Name"
              fullWidth
              variant="outlined"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email Address"
              fullWidth
              variant="outlined"
              value={form.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="message"
              label="Your Message"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={form.message}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit Request
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupportPage;
