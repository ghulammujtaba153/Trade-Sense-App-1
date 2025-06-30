'use client';

import PageLoader from '@/components/loaders/PageLoader';
import { API_URL } from '@/configs/url';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Paper } from '@mui/material';
import { Box } from '@mui/system';

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/affiliate/requests/get`);

      // Flatten `name` and `email` from userId for DataGrid
      const formatted = res.data.map((item) => ({
        ...item,
        name: item.userId?.name || 'N/A',
        email: item.userId?.email || 'N/A',
        requestTime: item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : 'N/A',
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

      if(status == 'accepted') {
          const resAffiliate = await axios.get(`${API_URL}/api/auth/affiliate/${userId}`);
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
    { field: 'createdAt', headerName: 'Request Time', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const rowId = params?.row?._id;
        const userId = params?.row?.userId._id;
        const status = params?.row?.status;
        if (!rowId) return null;
        if(status !== "pending")  return null;
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleStatus(rowId, userId, 'accepted')}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleStatus(rowId, 'rejected')}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Box p={3} sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
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
