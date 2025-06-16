'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
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
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (tagName) => {
    try {
      await axios.post(`${API_URL}/api/tags`, { name: tagName });
      fetchTags();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(`${API_URL}/api/tags/${tagId}`);
      fetchTags();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const filteredTags = data.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      field: 'id',
      headerName: '#',
      width: 80,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'name',
      headerName: 'Tag Name',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="Delete"
            slotProps={{
              popper: {
                className: 'capitalize',
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    color: 'var(--mui-palette-text-primary)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }
                }
              }
            }}
          >
        <IconButton color="error" onClick={() => handleDeleteTag(params.row._id)}>
          <DeleteIcon />
        </IconButton>
        </Tooltip>
      ),
    },
  ];

  const rows = filteredTags.map((tag) => ({
    ...tag,
    id: tag._id, // Required by DataGrid
  }));

  if (loading) {
    return (
      <PageLoader/>
    );
  }

  return (
    <Box sx={{backgroundColor: 'background.paper', borderRadius:2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" px={4} py={3}>
        <Typography variant="h5" fontWeight="bold">
          Tags Management
        </Typography>
        <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          + Add Tag
        </Button>
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
      <Box sx={{ width: '100%', overflowX: 'auto', padding: "4px" }}>
        <Box sx={{ minWidth: '900px' }}>
        {rows.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        ) : (
          <Typography textAlign="center" color="text.secondary">
            No tags found.
          </Typography>
        )}
        </Box>
      </Box>

      {/* Modal */}
      <AddTagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTag}
      />
    </Box>
  );
};

export default TagsManagement;
