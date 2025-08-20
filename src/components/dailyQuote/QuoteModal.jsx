import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const QuoteModal = ({ open, onClose, onSubmit, initialData }) => {
  const [data, setData] = useState({
    quote: '',
    author: '',
  });

  useEffect(() => {
    if (initialData) {
      setData({
        quote: initialData.quote || '',
        author: initialData.author || '',
      });
    } else {
      setData({ quote: '', author: '' });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!data.quote) return;
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Edit Quote' : 'Add Quote'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Quote"
            name="quote"
            value={data.quote}
            onChange={handleChange}
            fullWidth
            required
            multiline
            minRows={2}
          />
          <TextField
            label="Author"
            name="author"
            value={data.author}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuoteModal;
