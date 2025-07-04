'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageLoader from '@/components/loaders/PageLoader';
import { API_URL } from '@/configs/url';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/problem`);
      const formatted = res.data.map((item) => ({
        id: item._id,
        name: item.userId?.name || 'N/A',
        email: item.userId?.email || 'N/A',
        phone: item.userId?.phone || 'N/A',
        type: item.type,
        description: item.description,
        status: item.status,
      }));
      setRows(formatted);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${API_URL}/api/problem/${id}`, { status });
      toast.success(res.data.message || 'Status updated');
      fetch();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'type', headerName: 'Issue Type', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1.2,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const currentStatus = params.row.status;
        const id = params.row.id;

        return (
          <FormControl size="small" fullWidth>
            <Select
              value={currentStatus}
              onChange={(e) => handleStatus(id, e.target.value)}
              displayEmpty
            >
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        );
      },
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <Box p={3} sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        User Issue Reports
      </Typography>

      <Paper style={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
        />
      </Paper>
    </Box>
  );
};

export default Page;
