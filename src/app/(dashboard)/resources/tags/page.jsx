'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import AddTagModal from '@components/resources/AddTagModal';
import { API_URL } from '@/configs/url';
import PageLoader from '@/components/loaders/PageLoader';

const TagsManagement = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tags`);
      setData(res.data); // API returns array of strings
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (tagName) => {
    const cleanedName = tagName.trim().toLowerCase();
    const alreadyExists = data.some(
      (tag) => tag.trim().toLowerCase() === cleanedName
    );

    if (alreadyExists) {
      alert('Tag already exists!');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/tags`, { name: cleanedName });
      fetchTags();
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const filteredTags = data.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      field: 'id',
      headerName: '#',
      width: 80,
    },
    {
      field: 'name',
      headerName: 'Tag Name',
      flex: 1,
    },
  ];

  const rows = filteredTags.map((tag, index) => ({
    id: index + 1,
    name: tag,
  }));

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={4}
        py={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Tags Management
        </Typography>
        {/* <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          + Add Tag
        </Button> */}
      </Box>

      {/* Search Field */}
      <Box px={4} py={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* DataGrid */}
      <Box sx={{ width: '100%', overflowX: 'auto', padding: '4px' }}>
        <Box sx={{ minWidth: '600px' }}>
          {rows.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              autoHeight
            />
          ) : (
            <Typography textAlign="center" color="text.secondary">
              No tags found.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Modal
      <AddTagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTag}
      /> */}
    </Box>
  );
};

export default TagsManagement;
