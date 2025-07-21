'use client';

import PageLoader from '@/components/loaders/PageLoader';
import { API_URL } from '@/configs/url';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import { Button, MenuItem, Paper, Select } from '@mui/material';
import { Box } from '@mui/system';

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/affiliate/requests/records/all`);

      const formatted = res.data.map((item) => ({
        ...item,
        name: item.userId?.name || 'N/A',
        email: item.userId?.email || 'N/A',
        rawCreatedAt: item.createdAt || null, // raw date for formatting
      }));

      setData(formatted);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleStatus = async (id, userId = '', status) => {
    try {
      const res = await axios.patch(`${API_URL}/api/affiliate/requests/update/${id}`, {
        status,
      });

      if (status === 'accepted') {
        await axios.get(`${API_URL}/api/auth/affiliate/${userId}`);
      }

      toast.success(res.data.message);
      fetch(); // Refresh after update
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading) return <PageLoader />;

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'status', headerName: 'Status', flex: 1.5 },
    {
      field: 'rawCreatedAt',
      headerName: 'Request Time',
      flex: 1.2,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value).toLocaleString() : 'N/A';
        return <span>{date}</span>;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const rowId = params?.row?._id;
        const userId = params?.row?.userId?._id;
        const currentStatus = params?.row?.status;

        if (!rowId || currentStatus !== 'pending') return null;

        const handleChange = async (e) => {
          const newStatus = e.target.value;
          await handleStatus(rowId, userId, newStatus);
        };

        return (
          <Select
            value=""
            onChange={handleChange}
            displayEmpty
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="" disabled>
              Select
            </MenuItem>
            <MenuItem value="accepted">Accept</MenuItem>
            <MenuItem value="rejected">Reject</MenuItem>
          </Select>
        );
      },
    },
  ];

  return (
    <Box p={3} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
      <h2>Affiliate Requests</h2>
      <Paper style={{ width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default Page;
