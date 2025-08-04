"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { API_URL } from "@/configs/url";
import PageLoader from "@/components/loaders/PageLoader";
import { toast } from "react-toastify";

const AffiliateUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchAffiliateUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/affiliate/users/records`);
      setRows(res.data);
      setFilteredRows(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateUsers();
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = rows.filter((row) =>
      row?.name?.toLowerCase().includes(query) ||
      row?.email?.toLowerCase().includes(query)
    );
    setFilteredRows(filtered);
  };

  // Handle revoke action
  const handleRevoke = async (id) => {
    try {
      await axios.post(`${API_URL}/api/affiliate/users/revoke/${id}`);
      toast.success("Affiliation revoked");
      fetchAffiliateUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to revoke");
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    //   valueGetter: (params) => params.row?.name || "-",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    //   valueGetter: (params) => params.row?.email || "-",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          color="error"
          variant="outlined"
          onClick={() => handleRevoke(params.row._id)}
        >
          Revoke Affiliation
        </Button>
      ),
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <Box p={2}>
      <Card>
        <CardHeader  title="Affiliate Users" />
        
        <Box px={2} pb={2} style={{ height: 500 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default AffiliateUsersPage;
