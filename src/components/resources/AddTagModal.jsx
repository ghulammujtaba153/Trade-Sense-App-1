import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const AddTagModal = ({ isOpen, onClose, onAdd }) => {
  const [tagName, setTagName] = useState('');

  const handleSubmit = () => {
    if (tagName.trim() === '') return;
    onAdd(tagName);
    setTagName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Tag</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tag Name"
          type="text"
          fullWidth
          variant="outlined"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Add Tag
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTagModal;
