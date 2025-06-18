"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import PillarForm from "@components/resources/PillarForm";
import { API_URL } from "@/configs/url";
import PageLoader from "@/components/loaders/PageLoader";

const PillarsCategories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/pillars/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const formatted = res.data.map((item) => ({
        ...item,
        categories: item.categories.join(", "),
      }));

      setData(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleEdit = (rowData) => {
    // Ensure we're working with a plain object, not a proxy
    const plainRowData = {
      _id: rowData._id,
      name: rowData.name,
      categories: rowData.categories ? rowData.categories.split(", ") : [],
      image: rowData.image || ""
    };
    setEditData(plainRowData);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/pillars/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "categories",
      headerName: "Categories",
      flex: 2,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        // Extract the row data safely
        const rowData = {
          _id: params.row._id,
          name: params.row.name,
          categories: params.row.categories,
          image: params.row.image
        };
        
        return (
          <>
            <Tooltip title="Edit"
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
              <IconButton onClick={() => handleEdit(rowData)} color="primary">
                <Edit />
              </IconButton>
            </Tooltip>

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
              <IconButton onClick={() => handleDelete(rowData._id)} color="error">
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  if (loading) {
    return (
      <PageLoader />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, backgroundColor: "background.paper", p: 2, borderRadius: 2, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1">
          Pillars & Categories
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Pillar
        </Button>
      </Box>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Box sx={{ minWidth: '900px' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row._id}
          disableRowSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
        />
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editData && editData._id ? "Update Pillar" : "Add New Pillar"}</DialogTitle>
        <DialogContent>
          <PillarForm onClose={handleClose} fetchData={fetchData} editData={editData} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PillarsCategories;
