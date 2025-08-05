"use client";

import React, { useEffect, useState } from 'react';
import {
  Paper, CardHeader, Box, Tooltip, Modal, IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '@/configs/url';
import ViewTrading from '@/components/trading/ViewTrading';
import { RemoveRedEye } from '@mui/icons-material';
import TradingGraph from '@/components/trading/TradingGraph';

const TradingPage = () => {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [selectedData, setSelectedData] = useState(null);
  const [open, setOpen] = useState(false);

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/trading-form/${id}`);
      setData(res.data.reverse());
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleView = (rowData) => {
    setSelectedData(rowData);
    setOpen(true);
  };

  const columns = [
    { 
      field: 'tradeDate', 
      headerName: 'Trade Date', 
      flex: 1,
      valueFormatter: (params) => {
        if (!params) return 'N/A';
        try {
          return new Date(params).toLocaleDateString();
        } catch {
          return 'N/A';
        }
      }
    },
    { field: 'tradeType', headerName: 'Type', flex: 1 },
    { field: 'setupName', headerName: 'Setup', flex: 1 },
    { field: 'direction', headerName: 'Direction', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title="View"
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
        }}>
          <IconButton onClick={() => handleView(params.row)}>
            <RemoveRedEye />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  const rows = data.map(item => ({
    id: item._id,
    ...item
  }));

  return (
    <Paper sx={{ p: 2 }}>
        <TradingGraph />
      <CardHeader title={`Trading Page ${id || ''}`} />
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 900 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            pagination
            paginationMode="client"
            rowsPerPageOptions={[5, 10, 20, 50]}
            autoHeight
          />
        </Box>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          {selectedData && <ViewTrading data={selectedData} />}
        </Box>
      </Modal>
    </Paper>
  );
};

export default TradingPage;
