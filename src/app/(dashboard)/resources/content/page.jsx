"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Typography,
  TextField,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import AssignCategoryModal from "@components/resources/AssignCategoryModal";
import EditCategoriesModal from "@components/resources/EditCategoriesModal";
import { API_URL } from "@/configs/url";

const ContentManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModal, setEditModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/editors`);
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchUsers();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (expFilter !== "all") {
      result = result.filter((user) => user.experienceLevel === expFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, expFilter, statusFilter, users]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
    },
    {
      field: "categories",
      headerName: "Categories",
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" flexWrap="wrap" className="mt-3" gap={0.5}>
          {params.row.categories && params.row.categories.length > 0 ? (
            params.row.categories.map((cat, idx) => (
              <Chip key={idx} label={cat} color="primary" size="small" />
            ))
          ) : (
            <Typography fontStyle="italic" color="text.secondary">
              No categories
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "active" ? "success" : "warning"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" className="mt-3" spacing={1}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => openModal(params.row)}
          >
            Assign
          </Button>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt:4, backgroundColor: "background.paper" , padding:2, borderRadius:2 }}>
      <Stack spacing={3} mb={4}>
        <TextField
          label="Search by name or email"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </Stack>

      <Paper elevation={3}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>

      <EditCategoriesModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        user={selectedUser}
        categories={selectedUser?.categories || []}
        onSuccess={handleModalSuccess}
      />

      <AssignCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />
    </Container>
  );
};

export default ContentManagement;
