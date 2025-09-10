"use client";

import { API_URL } from '@/configs/url';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModal from '@/components/dailyQuote/ViewModal';
import QuoteModal from '@/components/dailyQuote/QuoteModal';

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/daily-quote/all`);
      setData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (e) {
      console.error(e);
      toast.error("Error fetching daily quote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // Add Quote
  const handleAdd = () => {
    setModalType('add');
    setSelectedQuote(null);
    setModalOpen(true);
  };

  // Edit Quote
  const handleEdit = (row) => {
    setModalType('edit');
    setSelectedQuote(row);
    setModalOpen(true);
  };

  // View Quote
  const handleView = (row) => {
    setSelectedQuote(row);
    setViewModalOpen(true);
  };

  // Delete Quote
  const handleDelete = async (row) => {
    try {
      await axios.delete(`${API_URL}/api/daily-quote/${row._id}`);
      setData(data.filter(item => item._id !== row._id));
      toast.success("Quote deleted");
    } catch {
      toast.error("Failed to delete quote");
    }
  };

  // Submit Add/Edit
  const handleModalSubmit = async (formData) => {
    try {
      if (modalType === 'add') {
        await axios.post(`${API_URL}/api/daily-quote`, formData);
        toast.success("Quote added");
      } else if (modalType === 'edit' && selectedQuote) {
        await axios.put(`${API_URL}/api/daily-quote/${selectedQuote._id}`, formData);
        toast.success("Quote updated");
      }
      setModalOpen(false);
      fetch();
    } catch {
      toast.error("Failed to save quote");
    }
  };

  const columns = [
    { field: 'quote', headerName: 'Quote', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleView(params.row)}><VisibilityIcon /></IconButton>
          <IconButton onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row)}><DeleteIcon /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Paper style={{ padding: 8 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Quote
        </Button>
      </Box>
      <DataGrid
        rows={data.map((item, idx) => ({ ...item, id: item._id || idx }))}
        columns={columns}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        loading={loading}
      />
      {/* Add/Edit Modal */}
      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalType === 'edit' ? selectedQuote : null}
      />
      {/* View Modal */}
      <ViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        data={selectedQuote}
      />
    </Paper>
  );
};

export default Page;
