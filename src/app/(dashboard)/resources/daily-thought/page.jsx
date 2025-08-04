'use client';

import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Tooltip,
} from '@mui/material';
import Loading from '@/components/loaders/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '@/configs/url';
import AddModal from '@/components/dailyThought/AddModal';
import ViewThoughtModal from '@/components/dailyThought/ViewThoughtModal';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageLoader from '@/components/loaders/PageLoader';

const DailyThought = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const fetchDailyThoughts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/daily-thought/get-all`);
      setData(res.data.dailyThoughts || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/daily-thought/delete/${id}`);
      toast.success('Deleted successfully');
      fetchDailyThoughts();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  useEffect(() => {
    fetchDailyThoughts();
  }, []);

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <Avatar alt="Daily Thought" src={params.value} variant="rounded" />
      ),
    },
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'description', headerName: 'Description', width: 600 },
    
    
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <Tooltip title="View" key="view"
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
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="View"
            onClick={() => setViewData(params.row)}
          />
        </Tooltip>,
        <Tooltip title="Edit" key="edit"
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
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => {
              setEditData(params.row);
              setOpenModal(true);
            }}
          />
        </Tooltip>,
        <Tooltip title="Delete" key="delete"
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
          <GridActionsCellItem
            icon={<DeleteIcon color="error" />}
            label="Delete"
            onClick={() => handleDelete(params.row._id)}
          />
        </Tooltip>,
      ],
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <Paper sx={{  width: '100%', p: 2, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Daily Thoughts
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setEditData(null);
            setOpenModal(true);
          }}
        >
          + Add Daily Thought
        </Button>
      </Box>

      <Paper sx={{ height: '100%', width: '100%', mt: 2 }}>
      <DataGrid
  rows={data}
  getRowId={(row) => row._id}
  columns={columns}
  autoHeight
  pagination
  pageSizeOptions={[5, 10, 25, 50]}
  paginationModel={{
    pageSize: 10,
    page: 0,
  }}
  
/>

      </Paper>

      {/* Add/Edit Modal */}
      <AddModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAddSuccess={fetchDailyThoughts}
        editData={editData}
      />

      {/* View Modal */}
      <ViewThoughtModal
        open={!!viewData}
        onClose={() => setViewData(null)}
        data={viewData}
      />
    </Paper>
  );
};

export default DailyThought;
