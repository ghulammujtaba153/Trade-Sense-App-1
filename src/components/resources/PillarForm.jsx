import React, { useEffect, useState } from 'react';
import { 
  Button, 
  TextField, 
  Chip, 
  Box, 
  Stack, 
  Typography 
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '@/configs/url';

const PillarForm = ({ onClose, fetchData, editData }) => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setCategories(editData.categories || []);
    }
  }, [editData]);

  const handleAddCategory = () => {
    const trimmed = categoryInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setCategoryInput('');
    }
  };

  const handleSubmit = async () => {
    const payload = { name: name.trim(), categories };
    try {
      if (editData) {
        await axios.put(`${API_URL}/api/pillars/categories/${editData._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/pillars/categories`, payload);
      }
      fetchData();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
      <TextField
        label="Pillar Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        autoFocus
      />

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
        <TextField
          label="Add Category"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCategory();
            }
          }}
          fullWidth
          size="small"
        />
        <Button variant="outlined" onClick={handleAddCategory} sx={{ height: 40 }}>
          Add
        </Button>
      </Stack>

      <Box sx={{ mt: 2, mb: 2 }}>
        {categories.length > 0 ? (
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {categories.map((cat, idx) => (
              <Chip
                key={idx}
                label={cat}
                onDelete={() => handleDeleteCategory(cat)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No categories added yet.
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!name.trim()}
        >
          {editData ? 'Update' : 'Add'}
        </Button>
      </Box>
    </Box>
  );
};

export default PillarForm;
