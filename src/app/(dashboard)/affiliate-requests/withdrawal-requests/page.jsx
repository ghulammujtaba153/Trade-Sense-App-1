'use client';

import PageLoader from '@/components/loaders/PageLoader';
import { API_URL } from '@/configs/url';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, Paper, Button, Stack } from '@mui/material';

const WithdrawalRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch withdrawal requests
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/payment`);
      const formatted = res.data.withdrawalRequests.map((item) => ({
        ...item,
        name: item.userId?.name || 'N/A', // Extract name from userId object
        formattedAmount: `$${item.amount || 0}`,
        rawCreatedAt: item.createdAt || null,
      }));
      setData(formatted);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  // Handle status update
  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/api/payment/${id}`, { status });
      toast.success(response.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Columns configuration
  const columns = [
    { field: 'name', headerName: 'User Name', flex: 1 },
    { field: 'type', headerName: 'Account Type', flex: 1 },
    {
      field: 'formattedAmount',
      headerName: 'Amount',
      flex: 0.8,
      renderCell: (params) => <span>{params.value}</span>,
    },
    { field: 'accountNumber', headerName: 'Account Number', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'rawCreatedAt',
      headerName: 'Request Date',
      flex: 1,
      renderCell: (params) => {
        const date = params.value
          ? new Date(params.value).toLocaleString()
          : 'N/A';
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
        const { _id, status } = params.row;
        if (status !== 'pending') return null;

        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleUpdateStatus(_id, 'completed')}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleUpdateStatus(_id, 'rejected')}
            >
              Reject
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box p={3} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
      <h2>Withdrawal Requests</h2>
      <Paper style={{ width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          autoHeight
        />
      </Paper>
    </Box>
  );
};

export default WithdrawalRequests;
