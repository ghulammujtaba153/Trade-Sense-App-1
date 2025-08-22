import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const ViewModal = ({ open, onClose, data }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>View Quote</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>
            "{data?.quote || ''}"
          </Typography>
          {data?.author && (
            <Typography variant="body2" color="text.secondary">
              — {data.author}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewModal;
